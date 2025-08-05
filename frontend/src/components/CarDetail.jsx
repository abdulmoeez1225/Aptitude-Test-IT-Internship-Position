import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  DirectionsCar as CarIcon,
  Speed as SpeedIcon,
  BatteryChargingFull as BatteryIcon,
  Euro as EuroIcon,
  EventSeat as SeatIcon,
} from "@mui/icons-material";
import axios from "axios";

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/cars/${id}`
        );
        setCar(response.data);
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Back to Cars
        </Button>
      </Box>
    );
  }

  if (!car) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Car not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Back to Cars
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back to Cars
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <CarIcon sx={{ fontSize: 40, mr: 2, color: "primary.main" }} />
          <Box>
            <Typography variant="h4" gutterBottom>
              {car.brand} {car.model}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {car.bodystyle} • {car.segment} Segment
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Performance Specifications */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <SpeedIcon sx={{ mr: 1 }} />
                  Performance
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Top Speed
                    </Typography>
                    <Typography variant="h6">
                      {car.topspeed_kmh} km/h
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Acceleration
                    </Typography>
                    <Typography variant="h6">
                      {car.accelsec}s (0-100 km/h)
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Battery & Range */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <BatteryIcon sx={{ mr: 1 }} />
                  Battery & Range
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Range
                    </Typography>
                    <Typography variant="h6">{car.range_km} km</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Efficiency
                    </Typography>
                    <Typography variant="h6">
                      {car.efficiency_whkm} Wh/km
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Charging */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Charging
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Fast Charge
                    </Typography>
                    <Typography variant="h6">
                      {car.fastcharge_kmh} km/h
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Rapid Charge
                    </Typography>
                    <Typography variant="h6">
                      {car.rapidcharge === "Yes" ? (
                        <Chip label="Available" color="success" size="small" />
                      ) : (
                        <Chip
                          label="Not Available"
                          color="default"
                          size="small"
                        />
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Technical Details */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Technical Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Power Train
                    </Typography>
                    <Typography variant="h6">{car.powertrain}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Plug Type
                    </Typography>
                    <Typography variant="h6">{car.plugtype}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Price & Seats */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <EuroIcon sx={{ mr: 1 }} />
                  Price & Capacity
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="h6">
                      €{car.priceeuro?.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Seats
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <SeatIcon sx={{ mr: 0.5, fontSize: 20 }} />
                      {car.seats}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Info */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Body Style
                    </Typography>
                    <Typography variant="h6">{car.bodystyle}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Segment
                    </Typography>
                    <Typography variant="h6">{car.segment}</Typography>
                  </Grid>
                  {car.date && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Date Added
                      </Typography>
                      <Typography variant="h6">
                        {new Date(car.date).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CarDetail;
