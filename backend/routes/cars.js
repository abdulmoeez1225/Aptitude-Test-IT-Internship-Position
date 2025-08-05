const express = require("express");
const router = express.Router();
const pool = require("../database");

// Get all cars with optional search and filtering
router.get("/", async (req, res) => {
  try {
    const {
      search,
      filter,
      sortBy,
      sortOrder,
    } = req.query;
    let query = "SELECT * FROM electric_cars WHERE 1=1";
    const params = [];

    // Search functionality
    if (search) {
      query +=
        " AND (Brand LIKE ? OR Model LIKE ? OR BodyStyle LIKE ? OR Segment LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Filter functionality
    if (filter) {
      const filters = JSON.parse(filter);
      Object.keys(filters).forEach((key) => {
        if (filters[key] && filters[key].value) {
          const { operator, value } = filters[key];
          switch (operator) {
            case "contains":
              query += ` AND ${key} LIKE ?`;
              params.push(`%${value}%`);
              break;
            case "equals":
              query += ` AND ${key} = ?`;
              params.push(value);
              break;
            case "startsWith":
              query += ` AND ${key} LIKE ?`;
              params.push(`${value}%`);
              break;
            case "endsWith":
              query += ` AND ${key} LIKE ?`;
              params.push(`%${value}`);
              break;
            case "isEmpty":
              query += ` AND (${key} IS NULL OR ${key} = '')`;
              break;
            case "greaterThan":
              query += ` AND ${key} > ?`;
              params.push(value);
              break;
            case "lessThan":
              query += ` AND ${key} < ?`;
              params.push(value);
              break;
          }
        }
      });
    }

    // Sorting
    if (sortBy) {
      query += ` ORDER BY ${sortBy} ${sortOrder || "ASC"}`;
    }

    

    const [rows] = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = "SELECT COUNT(*) as total FROM electric_cars WHERE 1=1";
    const countParams = [];
    if (search) {
      countQuery +=
        " AND (Brand LIKE ? OR Model LIKE ? OR BodyStyle LIKE ? OR Segment LIKE ?)";
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Convert all column names to lowercase
    const lowerCaseRows = rows.map((row) => {
      const newRow = {};
      Object.keys(row).forEach((key) => {
        newRow[key.toLowerCase()] = row[key];
      });
      return newRow;
    });
    res.json({
      data: lowerCaseRows,
    
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get car by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM electric_cars WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }
    // Convert all column names to lowercase for single record
    const row = rows[0];
    const newRow = {};
    Object.keys(row).forEach((key) => {
      newRow[key.toLowerCase()] = row[key];
    });
    res.json(newRow);
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete car by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM electric_cars WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
