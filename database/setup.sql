-- Create database (run this as a superuser if needed)
-- CREATE DATABASE bmw_electric_cars;
-- \c bmw_electric_cars

-- Create electric_cars table
CREATE TABLE IF NOT EXISTS electric_cars (
    id SERIAL PRIMARY KEY,
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
);

-- Import data from CSV (see importData.js or use \copy in psql) 