import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AppleIcon from "@mui/icons-material/Apple";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const title = "GA Snake";

const Header = () => {
  return (
    <AppBar color="primary" position="sticky" sx={{ top: 0, zIndex: 1300 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AppleIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {title}
          </Typography>
          <Link to="/play">
            <Button sx={{ my: 2, color: "white" }}>Play</Button>
          </Link>
          <Link to="/training">
            <Button sx={{ my: 2, color: "white" }}>Training</Button>
          </Link>
          <Link to="/trained-models">
            <Button sx={{ my: 2, color: "white" }}>Trained Models</Button>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
