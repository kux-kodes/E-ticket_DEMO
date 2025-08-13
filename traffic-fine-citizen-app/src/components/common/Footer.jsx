import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        px: 2, 
        mt: 'auto', 
        backgroundColor: (theme) => theme.palette.grey[200]
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} NAMPOL Traffic Fine System
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        <Link href="/privacy" color="inherit" sx={{ mx: 1 }}>
          Privacy Policy
        </Link>
        |
        <Link href="/terms" color="inherit" sx={{ mx: 1 }}>
          Terms of Service
        </Link>
        |
        <Link href="/contact" color="inherit" sx={{ mx: 1 }}>
          Contact Us
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;