import React from "react";
import LoginForm from "../../components/auth/LoginForm";

const Login = () => {
    return <LoginForm role="customer" title="Customer Sign In" showRegisterLink={true} />;
};

export default Login;
