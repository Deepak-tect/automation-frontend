import React from 'react';
import './Dashboard.css';

const stages = ['Pulling terraform Script', 'Provisioning cluster', 'Setting up jumpbox', 'Domain mapping', 'Pulling the latest LightBeam', 'Installing LightBeam', 'Credentials'];

const StatusTracker = ({ currentStage }) => {
  return (
    <div className="status-tracker-wrapper">
      <div className="status-tracker">
        {stages.map((stage, index) => (
          <div className="tracker-item" key={index}>
            <div className="tracker-icon-container">
              <div className={`circle ${index < currentStage ? 'done' : index === currentStage ? 'active' : ''}`}>
                {index < currentStage ? '✔' : index + 1}
              </div>
              {index < stages.length - 1 && (
                <div className={`vertical-line ${index < currentStage - 1 ? 'done' : ''}`} />
              )}
            </div>
            <div className="tracker-label">{stage}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusTracker;
