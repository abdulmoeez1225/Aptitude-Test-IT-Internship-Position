import * as fs from "fs";
const csv = require("csv-parser");
import * as mysql from "mysql2/promise";
import * as dotenv from "dotenv";

// Load environment variables from backend config
dotenv.config({ path: "../backend/config.env" });

// Create database connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'bmw_cars',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

interface ElectricCarData {
  Brand?: string;
  Model?: string;
  AccelSec?: string;
  TopSpeed_KmH?: string;
  Range_Km?: string;
  Efficiency_WhKm?: string;
  FastCharge_KmH?: string;
  RapidCharge?: string;
  PowerTrain?: string;
  PlugType?: string;
  BodyStyle?: string;
  Segment?: string;
  Seats?: string;
  PriceEuro?: string;
  Date?: string;
}

interface ProcessedCarData {
  Brand: string | null;
  Model: string | null;
  AccelSec: number | null;
  TopSpeed_KmH: number | null;
  Range_Km: number | null;
  Efficiency_WhKm: number | null;
  FastCharge_KmH: number;
  RapidCharge: string | null;
  PowerTrain: string | null;
  PlugType: string | null;
  BodyStyle: string | null;
  Segment: string | null;
  Seats: number | null;
  PriceEuro: number | null;
  Date: string | null;
}

async function importData(): Promise<void> {
  try {
    console.log("Starting data import...");

    const results: ElectricCarData[] = [];

    // Read CSV file - corrected path to root directory
    fs.createReadStream("../BMW_Aptitude_Test_Test_Data_ElectricCarData.csv")
      .pipe(csv())
      .on("data", (data: ElectricCarData) => results.push(data))
      .on("end", async () => {
        console.log(`Found ${results.length} records to import`);

        // Create table if it doesn't exist (MySQL syntax)
        await pool.query(`
          CREATE TABLE IF NOT EXISTS electric_cars (
            id INT AUTO_INCREMENT PRIMARY KEY,
            Brand VARCHAR(100),
            Model VARCHAR(200),
            AccelSec DECIMAL(5,2),
            TopSpeed_KmH INT,
            Range_Km INT,
            Efficiency_WhKm INT,
            FastCharge_KmH INT,
            RapidCharge VARCHAR(10),
            PowerTrain VARCHAR(20),
            PlugType VARCHAR(50),
            BodyStyle VARCHAR(50),
            Segment VARCHAR(10),
            Seats INT,
            PriceEuro INT,
            Date DATE
          )
        `);

        // Clear existing data
        await pool.query("DELETE FROM electric_cars");

        // Insert new data
        for (const row of results) {
          const query = `
            INSERT INTO electric_cars (
              Brand, Model, AccelSec, TopSpeed_KmH, Range_Km, 
              Efficiency_WhKm, FastCharge_KmH, RapidCharge, PowerTrain, 
              PlugType, BodyStyle, Segment, Seats, PriceEuro, Date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          // Convert date to YYYY-MM-DD format for MySQL
          let formattedDate: string | null = null;
          if (row.Date && row.Date.trim() !== "") {
            // Handles formats like '8/24/16' or '08/24/2016'
            const parts = row.Date.split("/");
            if (parts.length === 3) {
              let year = parts[2];
              if (year.length === 2) {
                year = parseInt(year) < 50 ? "20" + year : "19" + year;
              }
              const month = parts[0].padStart(2, "0");
              const day = parts[1].padStart(2, "0");
              formattedDate = `${year}-${month}-${day}`;
            }
          }

          const values: (string | number | null)[] = [
            row.Brand?.trim() || null,
            row.Model?.trim() || null,
            row.AccelSec ? parseFloat(row.AccelSec) : null,
            row.TopSpeed_KmH ? parseInt(row.TopSpeed_KmH) : null,
            row.Range_Km ? parseInt(row.Range_Km) : null,
            row.Efficiency_WhKm ? parseInt(row.Efficiency_WhKm) : null,
            row.FastCharge_KmH !== "-" && row.FastCharge_KmH ? parseInt(row.FastCharge_KmH) : 0,
            row.RapidCharge?.trim() || null,
            row.PowerTrain?.trim() || null,
            row.PlugType?.trim() || null,
            row.BodyStyle?.trim() || null,
            row.Segment?.trim() || null,
            row.Seats ? parseInt(row.Seats) : null,
            row.PriceEuro ? parseInt(row.PriceEuro) : null,
            formattedDate,
          ];
          
          console.log("Inserting values:", values);
          await pool.query(query, values);
        }

        console.log("Data import completed successfully!");
        process.exit(0);
      });
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
}

importData();
