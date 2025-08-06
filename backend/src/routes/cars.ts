import express, { Request, Response } from 'express';
import pool from '../database';
import { ElectricCar, FilterObject, QueryParams, ApiResponse, ErrorResponse } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

// Get all cars with optional search and filtering
router.get('/', async (req: Request<{}, ApiResponse<ElectricCar[]> | ErrorResponse, {}, QueryParams>, res: Response<ApiResponse<ElectricCar[]> | ErrorResponse>): Promise<void> => {
  try {
    const {
      search,
      filter,
      sortBy,
      sortOrder = 'ASC',
    } = req.query;
    
    let query = 'SELECT * FROM electric_cars WHERE 1=1';
    const params: (string | number)[] = [];

    // Search functionality
    if (search) {
      query += ' AND (Brand LIKE ? OR Model LIKE ? OR BodyStyle LIKE ? OR Segment LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Filter functionality
    if (filter) {
      try {
        const filters: FilterObject = JSON.parse(filter);
        Object.keys(filters).forEach((key) => {
          if (filters[key] && filters[key].value) {
            const { operator, value } = filters[key];
            switch (operator) {
              case 'contains':
                query += ` AND ${key} LIKE ?`;
                params.push(`%${value}%`);
                break;
              case 'equals':
                query += ` AND ${key} = ?`;
                params.push(value);
                break;
              case 'startsWith':
                query += ` AND ${key} LIKE ?`;
                params.push(`${value}%`);
                break;
              case 'endsWith':
                query += ` AND ${key} LIKE ?`;
                params.push(`%${value}`);
                break;
              case 'isEmpty':
                query += ` AND (${key} IS NULL OR ${key} = '')`;
                break;
              case 'greaterThan':
                query += ` AND ${key} > ?`;
                params.push(value);
                break;
              case 'lessThan':
                query += ` AND ${key} < ?`;
                params.push(value);
                break;
            }
          }
        });
      } catch (parseError) {
        res.status(400).json({ error: 'Invalid filter format' });
        return;
      }
    }

    // Sorting
    if (sortBy) {
      query += ` ORDER BY ${sortBy} ${sortOrder}`;
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM electric_cars WHERE 1=1';
    const countParams: (string | number)[] = [];
    if (search) {
      countQuery += ' AND (Brand LIKE ? OR Model LIKE ? OR BodyStyle LIKE ? OR Segment LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Convert all column names to lowercase
    const lowerCaseRows: ElectricCar[] = rows.map((row) => {
      const newRow: any = {};
      Object.keys(row).forEach((key) => {
        newRow[key.toLowerCase()] = row[key];
      });
      return newRow as ElectricCar;
    });

    res.json({
      data: lowerCaseRows,
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get car by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response<ElectricCar | ErrorResponse>): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM electric_cars WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }
    
    // Convert all column names to lowercase for single record
    const row = rows[0];
    if (!row) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }
    const newRow: any = {};
    Object.keys(row).forEach((key) => {
      newRow[key.toLowerCase()] = row[key];
    });
    
    res.json(newRow as ElectricCar);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete car by ID
router.delete('/:id', async (req: Request<{ id: string }>, res: Response<{ message: string } | ErrorResponse>): Promise<void> => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM electric_cars WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }
    
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
