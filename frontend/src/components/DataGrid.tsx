import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
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
  SelectChangeEvent,
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
import axios, { AxiosError } from "axios";
import { ColDef, GridReadyEvent, CellClickedEvent, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { ElectricCar, ApiResponse, GridFilter, FilterOperator } from "../types";

// Backend car data interface (flexible to handle different field name formats)
interface BackendCarData {
  id: number;
  // Handle both camelCase and PascalCase field names from backend
  brand?: string;
  Brand?: string;
  model?: string;
  Model?: string;
  accelsec?: string;
  AccelSec?: string;
  accel_sec?: string;
  topspeed_kmh?: number;
  TopSpeed_KmH?: number;
  top_speed_kmh?: number;
  range_km?: number;
  Range_Km?: number;
  efficiency_whkm?: number;
  efficiency_wh_km?: number;
  Efficiency_WhKm?: number;
  fastcharge_kmh?: number;
  fastcharge_km_h?: number;
  FastCharge_KmH?: number;
  rapidcharge?: string;
  RapidCharge?: string;
  rapid_charge?: string;
  powertrain?: string;
  Powertrain?: string;
  PowerTrain?: string;
  plugtype?: string;
  PlugType?: string;
  plug_type?: string;
  bodystyle?: string;
  BodyStyle?: string;
  body_style?: string;
  segment?: string;
  Segment?: string;
  seats?: number;
  Seats?: number;
  priceeuro?: number;
  price_euro?: number;
  PriceEuro?: number;
  Price_Euro?: number;
  date?: string;
  Date?: string;
  availability?: string;
  Availability?: string;
  Available?: string;
}

// Action cell renderer props
interface ActionCellRendererProps extends ICellRendererParams {
  data: ElectricCar;
}

// Filter type options
interface FilterTypeOption {
  value: FilterOperator;
  label: string;
}

// FilterDialog component props
interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: GridFilter) => void;
  filters: GridFilter;
}

// Utility: Map backend keys to frontend keys with proper typing
const mapCarData = (car: any): ElectricCar => {
  // The backend returns data with underscored field names, map them to frontend format
  return {
    id: car.id,
    brand: car.brand || car.Brand,
    model: car.model || car.Model,
    accelsec: car.accelsec || car.AccelSec || car.accel_sec || '',
    topspeed_kmh: car.topspeed_kmh || car.TopSpeed_KmH || car.top_speed_kmh || 0,
    range_km: car.range_km || car.Range_Km || 0,
    efficiency_whkm: car.efficiency_whkm || car.efficiency_wh_km || car.Efficiency_WhKm || 0,
    fastcharge_kmh: car.fastcharge_kmh || car.fastcharge_km_h || car.FastCharge_KmH || 0,
    rapidcharge: car.rapidcharge || car.RapidCharge || car.rapid_charge || '',
    powertrain: car.powertrain || car.Powertrain || car.PowerTrain || '',
    plugtype: car.plugtype || car.PlugType || car.plug_type || '',
    bodystyle: car.bodystyle || car.BodyStyle || car.body_style || '',
    segment: car.segment || car.Segment || '',
    seats: car.seats || car.Seats || 0,
    priceeuro: car.priceeuro || car.price_euro || car.PriceEuro || car.Price_Euro || 0,
    date: car.date || car.Date || '',
    efficiency_wh_km: car.efficiency_wh_km || car.Efficiency_WhKm,
    fastcharge_km_h: car.fastcharge_km_h || car.FastCharge_KmH,
    price_euro: car.price_euro || car.PriceEuro || car.Price_Euro,
    availability: car.availability || car.Availability || car.Available || '',
  };
};

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: GridFilter) => void;
  filters: GridFilter;
}

const DataGrid: React.FC = () => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState<ElectricCar[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<GridFilter>({});
  const [error, setError] = useState<string>("");

  // Action cell renderer component with proper typing
  const ActionCellRenderer: React.FC<ActionCellRendererProps> = ({ data }) => (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Tooltip title="View Details">
        <IconButton
          size="small"
          onClick={() => navigate(`/car/${data.id}`)}
        >
          <ViewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDelete(data.id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  // Value formatter functions with proper typing
  const formatRange = (params: ValueFormatterParams): string => {
    return params.value ? `${params.value} km` : '';
  };

  const formatEfficiency = (params: ValueFormatterParams): string => {
    return params.value ? `${params.value} Wh/km` : '';
  };

  const formatFastCharge = (params: ValueFormatterParams): string => {
    return params.value ? `${params.value} km/h` : '';
  };

  const formatPrice = (params: ValueFormatterParams): string => {
    return params.value ? `€${Number(params.value).toLocaleString()}` : '';
  };

  const formatAcceleration = (params: ValueFormatterParams): string => {
    return params.value ? `${params.value} sec` : '';
  };

  const formatTopSpeed = (params: ValueFormatterParams): string => {
    return params.value ? `${params.value} km/h` : '';
  };

  // Memoized column definitions with proper typing
  const columnDefs = useMemo<ColDef<ElectricCar>[]>(
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
        field: "accelsec",
        headerName: "Acceleration (0-100)",
        sortable: true,
        filter: true,
        width: 150,
        valueFormatter: formatAcceleration,
      },
      {
        field: "topspeed_kmh",
        headerName: "Top Speed",
        sortable: true,
        filter: true,
        width: 120,
        valueFormatter: formatTopSpeed,
      },
      {
        field: "range_km",
        headerName: "Range",
        sortable: true,
        filter: true,
        width: 120,
        valueFormatter: formatRange,
      },
      {
        field: "efficiency_whkm",
        headerName: "Efficiency",
        sortable: true,
        filter: true,
        width: 130,
        valueFormatter: formatEfficiency,
      },
      {
        field: "fastcharge_kmh",
        headerName: "Fast Charge",
        sortable: true,
        filter: true,
        width: 130,
        valueFormatter: formatFastCharge,
      },
      {
        field: "priceeuro",
        headerName: "Price",
        sortable: true,
        filter: true,
        width: 120,
        valueFormatter: formatPrice,
      },
      {
        field: "seats",
        headerName: "Seats",
        sortable: true,
        filter: true,
        width: 80,
      },
      {
        field: "powertrain",
        headerName: "Powertrain",
        sortable: true,
        filter: true,
        width: 100,
      },
      {
        headerName: "Actions",
        width: 120,
        cellRenderer: ActionCellRenderer,
        sortable: false,
        filter: false,
        pinned: 'right',
      },
    ],
    [navigate]
  );

  // Error handling utility
  const handleApiError = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>;
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      }
      if (axiosError.response?.data?.error) {
        return axiosError.response.data.error;
      }
      if (axiosError.message) {
        return axiosError.message;
      }
    }
    if (error instanceof Error) {
      return error.message;
    }
    return defaultMessage;
  };

  // Fetch data from API with improved error handling
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const params = new URLSearchParams();
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      
      if (Object.keys(filters).length > 0) {
        // Convert frontend filter format to backend format
        const backendFilters: { [key: string]: { operator: string; value: string | number } } = {};
        Object.keys(filters).forEach(key => {
          const filter = filters[key];
          if (filter && filter.filter && filter.type) {
            backendFilters[key] = {
              operator: filter.type,
              value: filter.filter
            };
          }
        });
        params.append('filter', JSON.stringify(backendFilters));
      }

      const response = await axios.get<ApiResponse<BackendCarData[]>>(
        `http://localhost:5000/api/cars?${params.toString()}`,
        {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (Array.isArray(response.data.data)) {
        const mappedData = response.data.data.map(mapCarData);
        setRowData(mappedData);
        setError("");
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      const errorMessage = handleApiError(error, "Failed to fetch car data. Please try again.");
      setError(errorMessage);
      setRowData([]); // Clear data on error
    }
  }, [searchTerm, filters]);

  // Delete car with improved error handling
  const handleDelete = useCallback(async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this car?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/cars/${id}`, {
        timeout: 5000, // 5 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Refresh data after successful deletion
      await fetchData();
    } catch (error) {
      console.error("Error deleting car:", error);
      const errorMessage = handleApiError(error, "Failed to delete car. Please try again.");
      setError(errorMessage);
    }
  }, [fetchData]);

  // Handle search with proper typing
  const handleSearch = useCallback((): void => {
    fetchData();
  }, [fetchData]);

  // Handle filter apply with proper typing
  const handleFilterApply = useCallback((newFilters: GridFilter): void => {
    setFilters(newFilters);
    setFilterDialogOpen(false);
  }, []);

  // Handle refresh data
  const handleRefresh = useCallback((): void => {
    fetchData();
  }, [fetchData]);

  // Clear all filters
  const clearFilters = useCallback((): void => {
    setFilters({});
    setSearchTerm("");
  }, []);

  // Grid event handlers with proper typing
  const onGridReady = useCallback((params: GridReadyEvent<ElectricCar>): void => {
    console.log('Grid is ready', params.api.getDisplayedRowCount(), 'rows');
    // Auto-size columns to fit content
    params.api.sizeColumnsToFit();
  }, []);

  const onCellClicked = useCallback((params: CellClickedEvent<ElectricCar>): void => {
    if (params.colDef?.field && params.colDef.field !== 'actions') {
      console.log('Cell clicked:', {
        field: params.colDef.field,
        value: params.value,
        data: params.data
      });
    }
  }, []);



  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        BMW Electric Cars
      </Typography>

      {/* Search and Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <TextField
            fullWidth
            label="Search cars..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: 'flex-start' }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setFilterDialogOpen(true)}
            >
              Advanced Filter
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button variant="text" onClick={clearFilters}>
              Clear All
            </Button>
          </Box>
        </Box>

      {/* Active Filters Display */}
      {Object.keys(filters).length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Active Filters:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {Object.entries(filters).map(([key, filter]) => (
              <Chip
                key={key}
                label={`${key}: ${filter.type} ${filter.filter || filter.filterTo || ''}`}
                onDelete={() => {
                  const newFilters = { ...filters };
                  delete newFilters[key];
                  setFilters(newFilters);
                }}
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Data Grid */}
      <Box className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          onCellClicked={onCellClicked}
          animateRows={true}
          rowSelection="single"
          pagination={true}
          paginationPageSize={20}
          suppressRowClickSelection={true}
        />
      </Box>

      {/* Filter Dialog */}
      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onApply={handleFilterApply}
        filters={filters}
      />

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert onClose={() => setError("")} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

// Filter Dialog Component
const FilterDialog: React.FC<FilterDialogProps> = ({ open, onClose, onApply, filters }) => {
  const [localFilters, setLocalFilters] = useState<GridFilter>(filters);

  const filterableColumns = [
    { key: "Brand", label: "Brand" },
    { key: "Model", label: "Model" },
    { key: "BodyStyle", label: "Body Style" },
    { key: "Segment", label: "Segment" },
    { key: "Range_Km", label: "Range (km)" },
    { key: "Efficiency_WhKm", label: "Efficiency (Wh/km)" },
    { key: "FastCharge_KmH", label: "Fast Charge (km/h)" },
    { key: "PriceEuro", label: "Price (€)" },
    { key: "Powertrain", label: "Powertrain" },
    { key: "Seats", label: "Seats" },
  ];

  const filterTypes = [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "startsWith", label: "Starts With" },
    { value: "endsWith", label: "Ends With" },
    { value: "greaterThan", label: "Greater Than" },
    { value: "lessThan", label: "Less Than" },
  ];

  const handleFilterChange = (columnKey: string, filterType: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [columnKey]: {
        filterType: 'text',
        type: filterType,
        filter: value,
      },
    }));
  };

  const removeFilter = (columnKey: string) => {
    setLocalFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[columnKey];
      return newFilters;
    });
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({});
  };

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Advanced Filters</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {filterableColumns.map((column) => (
            <Box key={column.key} sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Box sx={{ minWidth: '120px', flex: '0 0 auto' }}>
                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'medium' }}>
                  {column.label}
                </Typography>
              </Box>
              <Box sx={{ minWidth: '150px', flex: '0 0 auto' }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filter Type</InputLabel>
                  <Select
                    value={localFilters[column.key]?.type || ''}
                    label="Filter Type"
                    onChange={(e: SelectChangeEvent<string>) => handleFilterChange(column.key, e.target.value, localFilters[column.key]?.filter || '')}
                  >
                    {filterTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: '200px', flex: '1 1 auto' }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Value"
                  value={localFilters[column.key]?.filter || ''}
                  onChange={(e) => handleFilterChange(column.key, localFilters[column.key]?.type || 'contains', e.target.value)}
                  disabled={!localFilters[column.key]?.type}
                />
              </Box>
              <Box sx={{ flex: '0 0 auto' }}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => removeFilter(column.key)}
                  disabled={!localFilters[column.key]}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear}>Clear All</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply} variant="contained">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DataGrid;
