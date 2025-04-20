// src/pages/Guidelines.jsx

import React from "react";
import {
  Typography,
  Container,
  Box,
  Paper,
  Divider,
  Link,
} from "@mui/material";

const Guidelines = () => {
  return (
    <Container maxWidth="xs" sx={{ py: 4 }}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: "#fffdf6",
          height: "400px",
          overflowY: "auto",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          align="center"
          color="primary"
          fontWeight="bold"
        >
          📜 Streaming Guidelines
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="body2" component="div" sx={{ lineHeight: 1.6 }}>
          1. Respect fellow users when posting comments or reviews. <br />
          2. No pirated, illegal, or harmful content sharing. <br />
          3. Offensive language may lead to suspension. <br />
          4. Avoid spoilers without warning. <br />
          5. Do not share private data or login credentials. <br />
          6. Avoid excessive downloads or scraping tools. <br />
          7. Use platform only for personal entertainment. <br />
          8. Keep your app up to date for security. <br />
          9. Follow content ratings and age restrictions. <br />
          10. No harassment, spam, or inappropriate behavior.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
          sx={{ mb: 1 }}
        >
          🔽 For full legal terms, download the document below
        </Typography>

        <Box textAlign="center">
          <Link
            href="/terms-and-conditions.pdf"
            target="_blank"
            rel="noopener"
            download
            underline="hover"
            sx={{
              fontSize: "0.8rem",
              fontWeight: "bold",
              color: "#1e88e5",
            }}
          >
            📥 Download Terms & Conditions PDF
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default Guidelines;
