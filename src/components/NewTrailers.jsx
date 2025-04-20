import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
  Paper,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
//import MovieFooter from '../components/MovieFooter';//

const sampleTrailers = [
  { id: 1, title: "Avengers: Endgame" },
  { id: 2, title: "Oppenheimer" },
  { id: 3, title: "Dune: Part Two" },
  { id: 4, title: "Deadpool 3" },
];

const NewTrailers = () => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 450,
        mx: "auto",
        mt: 6,
        px: 4,
        py: 5,
        borderRadius: "20px",
        backgroundColor: "#ffffff",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      }}
    >
        
      <Typography
        variant="h5"
        fontWeight="600"
        textAlign="center"
        mb={3}
        color="primary"
      >
        🔥 Latest Trailers
      </Typography>

      <List>
        {sampleTrailers.map((trailer, index) => (
          <React.Fragment key={trailer.id}>
            <ListItem
              button
              onClick={() => navigate("/trailers")}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "#f4f6f8",
                  transform: "scale(1.02)",
                },
              }}
            >  
              <ListItemIcon>
                <PlayCircleOutlineIcon color="action" />
              </ListItemIcon>
              <ListItemText primary={trailer.title} />
            </ListItem>
            {index < sampleTrailers.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/trailers")}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
            py: 1.2,
            borderRadius: "30px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          View All Trailers
        </Button>
      </Box>
    </Paper>
      
   
  );
};

export default NewTrailers;
