import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FineContext } from '../../context/FineContext';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Divider, 
  Grid, 
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField
} from '@mui/material';
import { Payment as PaymentIcon, CreditCard, AccountBalance, Smartphone } from '@mui/icons-material';

const paymentMethods = [
  { value: 'credit_card', label: 'Credit/Debit Card', icon: <CreditCard /> },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: <AccountBalance /> },
  { value: 'mobile_wallet', label: 'Mobile Wallet', icon: <Smartphone /> },
];

const steps = ['Select Payment Method', 'Enter Details', 'Review & Pay'];

const FinePayment = () => {
  const { id } = useParams();
  const { payFine } = useContext(FineContext);
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePayment();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCardDetailChange = (field) => (event) => {
    setCardDetails({
      ...cardDetails,
      [field]: event.target.value
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      await payFine(id, {
        method: paymentMethod,
        details: paymentMethod === 'credit_card' ? cardDetails : {}
      });
      navigate(`/fines/${id}`, { state: { paymentSuccess: true } });
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">Select Payment Method</FormLabel>
            <RadioGroup 
              aria-label="payment-method" 
              name="payment-method" 
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              {paymentMethods.map((method) => (
                <Paper key={method.value} elevation={1} sx={{ mb: 1, p: 1 }}>
                  <FormControlLabel 
                    value={method.value} 
                    control={<Radio />} 
                    label={
                      <Box display="flex" alignItems="center">
                        {method.icon}
                        <Typography ml={1}>{method.label}</Typography>
                      </Box>
                    } 
                  />
                </Paper>
              ))}
            </RadioGroup>
          </FormControl>
        );
      case 1:
        return paymentMethod === 'credit_card' ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                variant="outlined"
                value={cardDetails.number}
                onChange={handleCardDetailChange('number')}
                placeholder="1234 5678 9012 3456"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cardholder Name"
                variant="outlined"
                value={cardDetails.name}
                onChange={handleCardDetailChange('name')}
                placeholder="John Doe"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                variant="outlined"
                value={cardDetails.expiry}
                onChange={handleCardDetailChange('expiry')}
                placeholder="MM/YY"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVV"
                variant="outlined"
                value={cardDetails.cvv}
                onChange={handleCardDetailChange('cvv')}
                placeholder="123"
                type="password"
              />
            </Grid>
          </Grid>
        ) : (
          <Typography>
            {paymentMethod === 'bank_transfer' 
              ? 'After submitting, you will receive bank transfer details to complete your payment.' 
              : 'Open your mobile wallet app to complete the payment.'}
          </Typography>
        );
      case 2:
        return (
          <div>
            <Typography variant="h6" gutterBottom>
              Review Your Payment
            </Typography>
            <Typography>
              You are about to pay <strong>150 NAD</strong> using {paymentMethods.find(m => m.value === paymentMethod).label}.
            </Typography>
            {paymentMethod === 'credit_card' && (
              <Typography variant="body2" color="textSecondary" mt={2}>
                Card ending in {cardDetails.number.slice(-4)}
              </Typography>
            )}
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Pay Fine #{id}
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ minHeight: '200px' }}>
          {getStepContent(activeStep)}
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Button 
          disabled={activeStep === 0 || loading} 
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={loading}
          endIcon={<PaymentIcon />}
        >
          {activeStep === steps.length - 1 ? 'Confirm Payment' : 'Next'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default FinePayment;