import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FineContext } from '../../context/FineContext';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Chip, 
  Divider, 
  Grid, 
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  LocationOn, 
  DateRange, 
  Receipt, 
  Payment, 
  CarCrash,
  Description,
  PhotoCamera
} from '@mui/icons-material';
import Map from './Map';

const FineDetail = () => {
  const { id } = useParams();
  const { getFineById } = useContext(FineContext);
  const [fine, setFine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFine = async () => {
      try {
        const fineData = await getFineById(id);
        setFine(fineData);
      } catch (err) {
        setError(err.message || 'Failed to load fine details');
      } finally {
        setLoading(false);
      }
    };
    fetchFine();
  }, [id, getFineById]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'due': return 'error';
      case 'disputed': return 'warning';
      default: return 'info';
    }
  };

  if (loading) return <Typography>Loading fine details...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!fine) return <Typography>Fine not found</Typography>;

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2">
            Fine #{fine.id}
          </Typography>
          <Chip 
            label={fine.status.toUpperCase()} 
            color={getStatusColor(fine.status)} 
            size="medium"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Violation Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CarCrash />
                  </ListItemIcon>
                  <ListItemText primary="Violation Type" secondary={fine.violation} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Description />
                  </ListItemIcon>
                  <ListItemText primary="Violation Code" secondary={fine.violationCode} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Receipt />
                  </ListItemIcon>
                  <ListItemText primary="Fine Amount" secondary={`${fine.amount} NAD`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DateRange />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Issued On" 
                    secondary={new Date(fine.date).toLocaleString()} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Payment />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Due Date" 
                    secondary={new Date(fine.dueDate).toLocaleDateString()} 
                    secondaryTypographyProps={{ 
                      color: new Date(fine.dueDate) < new Date() && fine.status !== 'paid' ? 'error' : 'inherit'
                    }}
                  />
                </ListItem>
              </List>
            </Paper>

            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Location
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <LocationOn color="primary" />
                <Typography variant="body2" ml={1}>
                  {fine.location.address || 'Location details not available'}
                </Typography>
              </Box>
              <Box height="200px">
                <Map coordinates={fine.location.coordinates} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Evidence
              </Typography>
              {fine.evidence.photos && fine.evidence.photos.length > 0 ? (
                <Grid container spacing={1}>
                  {fine.evidence.photos.map((photo, index) => (
                    <Grid item xs={6} key={index}>
                      <Box 
                        component="img" 
                        src={photo.url} 
                        alt={`Evidence ${index + 1}`} 
                        sx={{ 
                          width: '100%', 
                          height: '120px', 
                          objectFit: 'cover',
                          borderRadius: 1,
                          cursor: 'pointer'
                        }}
                        onClick={() => window.open(photo.url, '_blank')}
                      />
                      <Typography variant="caption" display="block" textAlign="center">
                        Photo {index + 1}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No photos available
                </Typography>
              )}
            </Paper>

            {fine.officer && (
              <Paper elevation={0} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Issuing Officer
                </Typography>
                <Typography variant="body2">
                  {fine.officer.name} (Badge #{fine.officer.badgeNumber})
                </Typography>
                {fine.officer.unit && (
                  <Typography variant="body2" color="textSecondary">
                    {fine.officer.unit}
                  </Typography>
                )}
              </Paper>
            )}
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        {fine.status === 'due' && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate(`/fines/${fine.id}/pay`)}
          >
            Pay Now
          </Button>
        )}
        {fine.status !== 'disputed' && (
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={() => navigate(`/fines/${fine.id}/dispute`)}
          >
            Dispute Fine
          </Button>
        )}
        <Button onClick={() => navigate(-1)}>Back to List</Button>
      </CardActions>
    </Card>
  );
};

export default FineDetail;