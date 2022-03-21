// src/components/signup-button.js

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from '@material-ui/core/Button';

const SignupButton = () => {
  const { loginWithPopup } = useAuth0();
  return (
    <Button variant="contained" color="primary" disableElevation
    onClick={() => loginWithPopup({
      screen_hint: "signup",
    })}
    >
      Sign Up
    </Button>
  );
};

export default SignupButton;