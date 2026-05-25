// ErrorPage.jsx

import React from "react";
import "./errorPage.css";

const ErrorPage = ({ code, error }) => {
  return (
    <section className="errorSection">
      <div className="errorCard">
        <h1 className="errorCode">Error Code : {code}</h1>
        <h2 className="errorMessage">{error}</h2>
      </div>
    </section>
  );
};

export default ErrorPage;