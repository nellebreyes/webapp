import React from "react";

function Register() {
  return (
    <div className="form-container">
      <form autoComplete="off">
        <label for="email">Email</label>
        <div>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter a valid email"
          />
        </div>
        <label for="password">Password</label>
        <div>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter password"
          />
        </div>
        <label for="confirmPassword">Confirm Password</label>
        <div>
          <input
            type="confirmPassword"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm password"
          />
        </div>
        <label for="avatar">Profile Image</label>
        <div>
          <input
            type="file"
            name="avatar"
            id="myFile"
            // onChange={this.handleFile}
          />
        </div>
        <button type="submit ">Create Account</button>
      </form>
    </div>
  );
}

export default Register;
