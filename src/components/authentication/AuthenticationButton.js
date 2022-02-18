// src/components/authentication-button.js

import React from "react";

import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";
import LogoutButton from "./LogoutButton";

import { useAuth0 } from "@auth0/auth0-react";

const AuthenticationButton = () => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <LogoutButton /> : <div><LoginButton /> | <SignupButton /></div>;
};

export default AuthenticationButton;