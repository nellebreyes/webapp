import React from "react";

function Login() {
  return (
    <div className="form-container">
      <form autoComplete="off">
        <label for="email">Email</label>
        <div>
          <input type="email" name="email" id="email" autoComplete />
        </div>
        <label for="password">Password</label>
        <div>
          <input type="password" name="password" id="password" />
        </div>
        <button type="submit ">Login</button>
      </form>
    </div>
  );
}

export default Login;
