import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  DirectionsCar as CarIcon,
  BatteryChargingFull as BatteryIcon,
  Euro as EuroIcon,
  EventSeat as SeatIcon,
  Speed as SpeedIcon,

  EvStation as ChargingIcon,
  Category as SegmentIcon,
  CalendarToday as DateIcon,
} from "@mui/icons-material";
import axios from "axios";
import { ElectricCar } from "../types";

interface DetailCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  unit?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({ title, value, icon, unit }) => (
  <Card sx={{ minHeight: 120, flex: 1 }}>
    <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", height: "100%" }}>
      <Box sx={{ mb: 1, color: "primary.main" }}>
        {icon}
      </Box>
      <Typography variant="h6" component="div" gutterBottom>
        {value}{unit && ` ${unit}`}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<ElectricCar | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) {
        setError("Car ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get<ElectricCar>(
          `http://localhost:5000/api/cars/${id}`
        );
        setCar(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setError("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Back to List
        </Button>
      </Container>
    );
  }

  if (!car) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Car not found
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Back to List
        </Button>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mb: 2 }}
        >
          Back to List
        </Button>
        <Typography variant="h3" component="h1" gutterBottom>
          {car.brand} {car.model}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label={car.segment} color="primary" />
          <Chip label={car.bodystyle} color="secondary" />
          <Chip label={car.powertrain} />
          <Chip label={car.rapidcharge === "Yes" ? "Rapid Charge" : "Standard Charge"} 
                color={car.rapidcharge === "Yes" ? "success" : "default"} />
        </Stack>
      </Box>

      {/* Main Details */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Vehicle Specifications
        </Typography>
        
        {/* Performance Section */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
          Performance
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
          <DetailCard
            title="Acceleration (0-100 km/h)"
            value={car.accelsec}
            icon={<SpeedIcon />}
            unit="sec"
          />
          <DetailCard
            title="Top Speed"
            value={car.topspeed_kmh}
            icon={<SpeedIcon />}
            unit="km/h"
          />
        </Stack>

        {/* Range & Efficiency Section */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
          Range & Efficiency
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
          <DetailCard
            title="Range"
            value={car.range_km}
            icon={<BatteryIcon />}
            unit="km"
          />
          <DetailCard
            title="Efficiency"
            value={car.efficiency_whkm}
            icon={<BatteryIcon />}
            unit="Wh/km"
          />
          <DetailCard
            title="Fast Charge Speed"
            value={car.fastcharge_kmh}
            icon={<ChargingIcon />}
            unit="km/h"
          />
        </Stack>

        {/* Vehicle Details Section */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
          Vehicle Details
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
          <DetailCard
            title="Seats"
            value={car.seats}
            icon={<SeatIcon />}
          />
          <DetailCard
            title="Segment"
            value={car.segment}
            icon={<SegmentIcon />}
          />
          <DetailCard
            title="Body Style"
            value={car.bodystyle}
            icon={<CarIcon />}
          />
          <DetailCard
            title="Plug Type"
            value={car.plugtype}
            icon={<ChargingIcon />}
          />
        </Stack>

        {/* Pricing & Date Section */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
          Pricing & Information
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
          <DetailCard
            title="Price"
            value={car.priceeuro.toLocaleString()}
            icon={<EuroIcon />}
            unit="€"
          />
          <DetailCard
            title="Release Date"
            value={formatDate(car.date)}
            icon={<DateIcon />}
          />
        </Stack>
      </Paper>

      {/* Additional Information */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Additional Information
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Car ID:
            </Typography>
            <Typography variant="body1">{car.id}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Powertrain:
            </Typography>
            <Typography variant="body1">{car.powertrain}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Rapid Charging:
            </Typography>
            <Typography variant="body1">{car.rapidcharge}</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CarDetail;
