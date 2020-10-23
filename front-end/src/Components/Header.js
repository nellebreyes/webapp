import React from "react";

function Header() {
  return (
    <div className="header">
      <div className="container">
        <div className="logo">
          <h1>
            <a href="index.js" alt="Web App">
              Web App
            </a>
          </h1>
        </div>
        <div className="nav">
          <ul>
            <li>
              <a href="#">Register</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
