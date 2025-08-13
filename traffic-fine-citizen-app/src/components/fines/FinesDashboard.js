import React from 'react';
import { Container, Typography } from '@mui/material';

const FinesDashboard = ({ data }) => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Your Traffic Fines
      </Typography>
      {/* Add your fines list/table here */}
    </Container>
  );
};

export default FinesDashboard;