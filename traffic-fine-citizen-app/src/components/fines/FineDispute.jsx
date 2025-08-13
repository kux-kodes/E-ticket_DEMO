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
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Alert
} from '@mui/material';
import { Upload as UploadIcon, Description, Send } from '@mui/icons-material';
import Dropzone from 'react-dropzone';

const disputeReasons = [
  'Not my vehicle',
  'Incorrect violation',
  'Mistaken identity',
  'Other (please specify)'
];

const FineDispute = () => {
  const { id } = useParams();
  const { submitDispute } = useContext(FineContext);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [explanation, setExplanation] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleCustomReasonChange = (event) => {
    setCustomReason(event.target.value);
  };

  const handleExplanationChange = (event) => {
    setExplanation(event.target.value);
  };

  const handleDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = async () => {
    if (!reason) {
      setError('Please select a reason for your dispute');
      return;
    }

    if (reason === 'Other (please specify)' && !customReason.trim()) {
      setError('Please specify your reason for disputing');
      return;
    }

    if (!explanation.trim()) {
      setError('Please provide a detailed explanation');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const disputeReason = reason === 'Other (please specify)' ? customReason : reason;
      await submitDispute(id, {
        reason: disputeReason,
        explanation,
        files
      });
      setSuccess(true);
      setTimeout(() => {
        navigate(`/fines/${id}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit dispute. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your dispute has been submitted successfully!
          </Alert>
          <Typography>
            Your dispute for Fine #{id} has been received. You will be notified when it's reviewed.
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={() => navigate(`/fines/${id}`)}>
            Back to Fine Details
          </Button>
        </CardActions>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Dispute Fine #{id}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Please provide details about why you're disputing this fine. Include as much information as possible to help us review your case.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Reason for Dispute</FormLabel>
              <RadioGroup 
                aria-label="dispute-reason" 
                name="dispute-reason" 
                value={reason}
                onChange={handleReasonChange}
              >
                {disputeReasons.map((option) => (
                  <FormControlLabel 
                    key={option} 
                    value={option} 
                    control={<Radio />} 
                    label={option} 
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {reason === 'Other (please specify)' && (
              <TextField
                fullWidth
                label="Please specify your reason"
                variant="outlined"
                value={customReason}
                onChange={handleCustomReasonChange}
                margin="normal"
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Detailed Explanation"
              variant="outlined"
              multiline
              rows={4}
              value={explanation}
              onChange={handleExplanationChange}
              placeholder="Provide a detailed explanation of why you believe this fine was issued incorrectly..."
            />
          </Grid>

          <Grid item xs={12}>
            <FormLabel component="legend">Supporting Documents (Optional)</FormLabel>
            <Typography variant="body2" color="textSecondary" paragraph>
              Upload any photos or documents that support your dispute (max 5 files, 5MB each)
            </Typography>

            <Dropzone onDrop={handleDrop} maxFiles={5} maxSize={5 * 1024 * 1024}>
              {({getRootProps, getInputProps}) => (
                <Paper 
                  {...getRootProps()} 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderStyle: 'dashed'
                  }}
                >
                  <input {...getInputProps()} />
                  <UploadIcon color="action" />
                  <Typography>
                    Drag and drop files here, or click to select files
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Accepted files: JPG, PNG, PDF (max 5MB each)
                  </Typography>
                </Paper>
              )}
            </Dropzone>

            {files.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2">Selected Files:</Typography>
                <List dense>
                  {files.map((file, index) => (
                    <Paper key={index} elevation={1} sx={{ p: 1, mb: 1 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                          <Description color="action" />
                          <Typography variant="body2" ml={1}>
                            {file.name} ({Math.round(file.size / 1024)} KB)
                          </Typography>
                        </Box>
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </List>
              </Box>
            )}
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button 
          onClick={() => navigate(`/fines/${id}`)}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || !reason || !explanation}
          endIcon={<Send />}
        >
          {loading ? 'Submitting...' : 'Submit Dispute'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default FineDispute;