// src/components/signup-button.js

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';

const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button variant="contained" color="primary" disableElevation
    onClick={() => loginWithRedirect({
      screen_hint: "signup",
    })}
    >
      Sign Up
    </Button>
  );
};

export default SignupButton;