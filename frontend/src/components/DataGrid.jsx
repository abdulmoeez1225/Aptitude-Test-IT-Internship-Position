import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";

// Utility: Map backend keys to frontend keys if needed
const mapCarData = (car) => ({
  id: car.id,
  brand: car.brand,
  model: car.model,
  bodystyle: car.bodystyle,
  segment: car.segment,
  topspeed_kmh: car.topspeed_kmh,
  range_km: car.range_km,
  priceeuro: car.priceeuro,
});

const DataGrid = () => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState("");

  // Memoized column definitions
  const columnDefs = useMemo(
    () => [
      {
        field: "brand",
        headerName: "Brand",
        sortable: true,
        filter: true,
        width: 120,
      },
      {
        field: "model",
        headerName: "Model",
        sortable: true,
        filter: true,
        width: 200,
      },
      {
        field: "bodystyle",
        headerName: "Body Style",
        sortable: true,
        filter: true,
        width: 120,
      },
      {
        field: "segment",
        headerName: "Segment",
        sortable: true,
        filter: true,
        width: 100,
      },
      {
        field: "topspeed_kmh",
        headerName: "Top Speed (km/h)",
        sortable: true,
        filter: true,
        width: 150,
      },
      {
        field: "range_km",
        headerName: "Range (km)",
        sortable: true,
        filter: true,
        width: 120,
      },
      {
        field: "priceeuro",
        headerName: "Price (€)",
        sortable: true,
        filter: true,
        width: 120,
      },
      {
        headerName: "Actions",
        width: 120,
        cellRenderer: (params) => (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                color="primary"
                aria-label="View Details"
                onClick={() => handleView(params.data.id)}
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                aria-label="Delete"
                onClick={() => handleDelete(params.data.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  // Fetch data from backend
  const fetchData = useCallback(async () => {
    try {
      setError("");
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(Object.keys(filters).length > 0 && {
          filter: JSON.stringify(filters),
        }),
      });
      const response = await axios.get(
        `http://localhost:5000/api/cars?${params}`
      );
      setRowData(response.data.data.map(mapCarData));
    } catch (error) {
      setError("Failed to fetch car data. Please try again.");
      console.error("Error fetching data:", error);
    }
  }, [searchTerm, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers
  const handleSearch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters);
    setFilterDialogOpen(false);
  }, []);

  const handleView = useCallback(
    (id) => {
      navigate(`/car/${id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm("Are you sure you want to delete this car?")) {
        try {
          await axios.delete(`http://localhost:5000/api/cars/${id}`);
          fetchData();
        } catch (error) {
          setError("Failed to delete car. Please try again.");
          console.error("Error deleting car:", error);
        }
      }
    },
    [fetchData]
  );

  const handleRefresh = useCallback(() => {
    setSearchTerm("");
    setFilters({});
    fetchData();
  }, [fetchData]);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Electric Cars Database
        </Typography>

        {/* Search and Filter Controls */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch} aria-label="Search">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setFilterDialogOpen(true)}
                aria-label="Open Filters"
              >
                Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                aria-label="Refresh"
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Active Filters Display */}
        {Object.keys(filters).length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Active Filters:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {Object.entries(filters).map(([key, filter]) => (
                <Chip
                  key={key}
                  label={`${key}: ${filter.operator} ${filter.value}`}
                  onDelete={() => {
                    const newFilters = { ...filters };
                    delete newFilters[key];
                    setFilters(newFilters);
                  }}
                  color="primary"
                  variant="outlined"
                  aria-label={`Remove filter ${key}`}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Data Grid */}
        <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            pagination={true}
            paginationPageSize={20} // or any page size you prefer
            loadingOverlayComponent={() => (
              <div style={{ padding: "20px" }}>
                <Typography>Loading...</Typography>
              </div>
            )}
            loadingOverlayComponentParams={{
              loadingMessage: "Loading cars...",
            }}
            overlayLoadingTemplate={
              '<span class="ag-overlay-loading-center">Loading cars...</span>'
            }
            overlayNoRowsTemplate={
              '<span class="ag-overlay-no-rows-center">No cars found</span>'
            }
            suppressRowClickSelection={true}
            rowSelection="single"
            animateRows={true}
            defaultColDef={{
              resizable: true,
              sortable: true,
              // filter: true,
              // floatingFilter: true,
            }}
          />
        </div>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        </Snackbar>

        {/* Filter Dialog */}
        <FilterDialog
          open={filterDialogOpen}
          onClose={() => setFilterDialogOpen(false)}
          onApply={handleFilter}
          filters={filters}
        />
      </Paper>
    </Box>
  );
};

// Filter Dialog Component
const FilterDialog = ({ open, onClose, onApply, filters }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [selectedField, setSelectedField] = useState("");
  const [operator, setOperator] = useState("contains");
  const [value, setValue] = useState("");

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const fields = [
    { value: "brand", label: "Brand" },
    { value: "model", label: "Model" },
    { value: "bodystyle", label: "Body Style" },
    { value: "segment", label: "Segment" },
    { value: "topspeed_kmh", label: "Top Speed" },
    { value: "range_km", label: "Range" },
    { value: "priceeuro", label: "Price" },
  ];

  const operators = [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "startsWith", label: "Starts with" },
    { value: "endsWith", label: "Ends with" },
    { value: "isEmpty", label: "Is empty" },
    { value: "greaterThan", label: "Greater than" },
    { value: "lessThan", label: "Less than" },
  ];

  const handleAddFilter = () => {
    if (selectedField && operator && (value || operator === "isEmpty")) {
      setLocalFilters((prev) => ({
        ...prev,
        [selectedField]: { operator, value },
      }));
      setSelectedField("");
      setOperator("contains");
      setValue("");
    }
  };

  const handleRemoveFilter = (field) => {
    const newFilters = { ...localFilters };
    delete newFilters[field];
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Advanced Filters</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Field</InputLabel>
              <Select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                label="Field"
              >
                {fields.map((field) => (
                  <MenuItem key={field.value} value={field.value}>
                    {field.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Operator</InputLabel>
              <Select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                label="Operator"
              >
                {operators.map((op) => (
                  <MenuItem key={op.value} value={op.value}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={operator === "isEmpty"}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddFilter}
              disabled={
                !selectedField ||
                !operator ||
                (!value && operator !== "isEmpty")
              }
            >
              Add Filter
            </Button>
          </Grid>
        </Grid>

        {/* Active Filters */}
        {Object.keys(localFilters).length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Active Filters:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {Object.entries(localFilters).map(([field, filter]) => (
                <Chip
                  key={field}
                  label={`${field}: ${filter.operator} ${filter.value}`}
                  onDelete={() => handleRemoveFilter(field)}
                  color="primary"
                  variant="outlined"
                  aria-label={`Remove filter ${field}`}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply} variant="contained">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

FilterDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
};

export default DataGrid;
