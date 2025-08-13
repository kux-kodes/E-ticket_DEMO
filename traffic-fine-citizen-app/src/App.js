import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './styles/theme';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import FinesPage from './pages/FinesPage';
import PaymentPage from './pages/PaymentPage';
import DisputePage from './pages/DisputePage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/common/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { FineProvider } from './context/FineContext';
import NotificationBanner from './components/common/NotificationBanner';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <FineProvider>
          <Router>
            <Header />
            <Box 
              component="main"
              sx={{
                minHeight: 'calc(100vh - 128px)',
                backgroundColor: theme.palette.background.default,
                p: 3
              }}
            >
              <NotificationBanner />
              <Container maxWidth="xl">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route element={<PrivateRoute />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/fines" element={<FinesPage />} />
                    <Route path="/fines/:id/pay" element={<PaymentPage />} />
                    <Route path="/fines/:id/dispute" element={<DisputePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Routes>
              </Container>
            </Box>
            <Footer />
          </Router>
        </FineProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

