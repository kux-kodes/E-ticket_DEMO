import { AppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material';
import { Menu, Notifications } from '@mui/icons-material';

const Header = () => {
  return (
    <AppBar 
      position="sticky"
      sx={{ 
        backgroundColor: 'primary.main',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Traffic Fines Portal
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" gap={2}>
          <Button 
            color="inherit"
            startIcon={<Notifications />}
            sx={{ 
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          />
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36,
              backgroundColor: 'secondary.main'
            }}
          >
            U
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
