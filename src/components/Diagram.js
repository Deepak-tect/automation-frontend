import React from "react";
import "./Diagram.css";

const Diagram = () => {
  return (
    <div className="diagram-container">
      {/* Replace this with actual SVG/diagram if needed */}
      <h2>Deployment Flow</h2>
      <ul>
        <li>🛠️ Infra Provision (Terraform)</li>
        <li>🚀 GKE Cluster Setup</li>
        <li>🔐 Jumpbox Access</li>
        <li>📦 Helm Installations</li>
      </ul>
    </div>
  );
};

export default Diagram;
