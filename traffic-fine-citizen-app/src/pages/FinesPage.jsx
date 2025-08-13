import React, { useContext } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { FineContext } from '../context/FineContext';
import FineList from '../components/fines/FineList';
import FineDetail from '../components/fines/FineDetail';
import { Box, Typography } from '@mui/material';

const FinesPage = () => {
  const { id } = useParams();
  const { fines, loading, error } = useContext(FineContext);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4">Your Traffic Fines</Typography>
      {id ? (
        <Outlet /> // Renders nested routes (e.g., /fines/:id/pay)
      ) : (
        <>
          <FineList fines={fines} loading={loading} error={error} />
          <Outlet />
        </>
      )}
    </Box>
  );
};

export default FinesPage;