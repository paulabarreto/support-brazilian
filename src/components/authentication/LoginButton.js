// src/components/login-button.js

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from '@material-ui/core/Button';

const LoginButton = () => {
  const { loginWithPopup } = useAuth0();
  return (
    <Button variant="contained" color="primary" disableElevation
      onClick={() => loginWithPopup({
        screen_hint: "login",
      })}
    >
      Log In
    </Button>
  );
};

export default LoginButton;