import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  TextField,
  Collapse,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
} from "@mui/material";

const features = [
  "Unlimited HD Streaming",
  "Exclusive Movie Releases",
  "Download More Than 3 Videos",
  "Ad-Free Experience",
  "Access to Premium Support",
];

const Subscribe = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [formData, setFormData] = useState({
    upi: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubscribeClick = () => {
    setShowPayment(true);
    setSuccessMessage("");
  };

  const handlePaymentMethodChange = (_, newMethod) => {
    if (newMethod !== null) {
      setPaymentMethod(newMethod);
      setSuccessMessage("");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (paymentMethod === "upi") {
      if (!formData.upi.trim()) newErrors.upi = "UPI ID is required";
    } else {
      if (!/^\d{12,19}$/.test(formData.cardNumber))
        newErrors.cardNumber = "Card Number must be 12–19 digits";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry))
        newErrors.expiry = "Expiry must be in MM/YY format";
      if (!/^\d{3,4}$/.test(formData.cvv))
        newErrors.cvv = "CVV must be 3 or 4 digits";
    }
    return newErrors;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setSuccessMessage("");

    if (Object.keys(validationErrors).length === 0) {
      setSuccessMessage("🎉 Subscription successful! Welcome to Premium.");
      setFormData({ upi: "", cardNumber: "", expiry: "", cvv: "" });
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: "#fff9f0",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" align="center" color="secondary">
          Subscribe for More Features
        </Typography>

        <Typography variant="body2" align="center">
          Enjoy Premium Access:
        </Typography>

        <Grid container spacing={1}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box
                sx={{
                  backgroundColor: "#ffe0b2",
                  borderRadius: 2,
                  p: 1,
                  fontSize: "0.8rem",
                }}
              >
                🔓 {feature}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          size="small"
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: "none",
            bgcolor: "red",
            "&:hover": { bgcolor: "darkred" },
            alignSelf: "center",
            mt: 1,
          }}
          onClick={handleSubscribeClick}
        >
          Subscribe Now
        </Button>

        <Collapse in={showPayment}>
          <Box
            component="form"
            onSubmit={handlePaymentSubmit}
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              backgroundColor: "#ffffff",
              p: 2,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" align="center">
              Choose Payment Method
            </Typography>

            <ToggleButtonGroup
              value={paymentMethod}
              exclusive
              onChange={handlePaymentMethodChange}
              fullWidth
              size="small"
              color="primary"
            >
              <ToggleButton value="upi">UPI</ToggleButton>
              <ToggleButton value="card">Card</ToggleButton>
            </ToggleButtonGroup>

            {paymentMethod === "upi" && (
              <TextField
                label="UPI ID"
                variant="outlined"
                size="small"
                fullWidth
                required
                name="upi"
                value={formData.upi}
                onChange={handleChange}
                error={!!errors.upi}
                helperText={errors.upi}
              />
            )}

            {paymentMethod === "card" && (
              <>
                <TextField
                  label="Card Number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                />
                <Box display="flex" gap={1}>
                  <TextField
                    label="Expiry (MM/YY)"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                    error={!!errors.expiry}
                    helperText={errors.expiry}
                  />
                  <TextField
                    label="CVV"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    error={!!errors.cvv}
                    helperText={errors.cvv}
                  />
                </Box>
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              size="small"
              sx={{
                bgcolor: "red",
                textTransform: "none",
                "&:hover": { bgcolor: "darkred" },
                alignSelf: "center",
                px: 4,
              }}
            >
              Pay & Subscribe
            </Button>

            {successMessage && (
              <Alert severity="success" sx={{ mt: 2, fontSize: "0.9rem" }}>
                {successMessage}
              </Alert>
            )}
          </Box>
        </Collapse>
      </Paper>
    </Container>
  );
};

export default Subscribe;
