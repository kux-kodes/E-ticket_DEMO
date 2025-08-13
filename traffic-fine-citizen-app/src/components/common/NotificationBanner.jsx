import { Alert, Snackbar, Slide } from '@mui/material';

const NotificationBanner = ({ 
  open, 
  onClose, 
  message, 
  severity = 'info',
  autoHideDuration = 6000 
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={Slide}
    >
      <Alert 
        onClose={onClose} 
        severity={severity}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationBanner;