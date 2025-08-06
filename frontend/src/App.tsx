import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import DataGrid from './components/DataGrid';
import CarDetail from './components/CarDetail';
import Header from './components/Header';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0066b1', // BMW Blue
    },
    secondary: {
      main: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<DataGrid />} />
            <Route path="/car/:id" element={<CarDetail />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
