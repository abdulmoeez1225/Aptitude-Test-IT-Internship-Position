import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#0066b1" }}>
      <Toolbar>
        <DirectionsCarIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          BMW Electric Cars DataGrid
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            IT Internship Test
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
