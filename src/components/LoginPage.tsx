import Button from "./common/Button";
import "./LoginPage.css";
import React from "react";

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="content">
        <h3>Sign in to Decklabs</h3>
        <form>
          <div className="mb-3">
            <label
              htmlFor="exampleFormControlInput1"
              className="form-label"
            >
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="emailInput"
              placeholder="name@example.com"
            ></input>
          </div>
          <div className="mb-3">
            <label
              htmlFor="exampleFormControlTextarea1"
              className="form-label"
            >
              Password
            </label>
            <input
              className="form-control"
              id="passwordInput"
            ></input>
          </div>
          <Button classes="btn-primary">Sign in</Button>
          <Button>Continue as guest</Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
