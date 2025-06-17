import React, { useState } from 'react';
import './Dashboard.css';
import { useEffect } from 'react';
import socket from '../socket'; 
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import StatusTracker from './StatusTracker';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('deploy');
  const [activeTab, setActiveTab] = useState('deploy');
  const [currentStage, setCurrentStage] = useState(0);
  const [statusMessages, setStatusMessages] = useState([]);

  const [formData, setFormData] = useState({
    customerName: '',
    nodes: '',
    domain: '',
    dockerSecrets: '',
    publicKey: '',
    publicIP: '',
    rc: '',
    policy: 'US',
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
  socket.on('deployment-update', (data) => {
    console.log('Deployment Update:', data);

    setCurrentStage(data.stage);
    setStatusMessages((prev) => [...prev, data.message]);
  });

  return () => {
    socket.off('deployment-update');
  };
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('You are not authenticated');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setActiveTab('status');
      } else {
        alert(data.message || 'Deployment failed');
      }
    } catch (error) {
      console.error('Deployment error:', error);
      alert('Failed to submit form');
    }
  };


  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      navigate('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };


  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Automation Panel</h2>
        <ul className="menu">
          <li className={activeMenu === 'deploy' ? 'active' : ''} onClick={() => setActiveMenu('deploy')}>Deploy Cluster</li>
          <li className={activeMenu === 'delete' ? 'active' : ''} onClick={() => setActiveMenu('delete')}>Delete Cluster</li>
          <li className={activeMenu === 'list' ? 'active' : ''} onClick={() => setActiveMenu('list')}>List of Cluster</li>
          <li onClick={handleSignOut}>Sign Out</li>

        </ul>
      </div>

      {/* Content Area */}
      <div className="content">
        {/* Top Tabs */}
        <div className="tabs-header">
          <div className={`tab ${activeTab === 'deploy' ? 'active' : ''}`} onClick={() => setActiveTab('deploy')}>
            📝 Deploy
          </div>
          <div className={`tab ${activeTab === 'status' ? 'active' : ''}`} onClick={() => setActiveTab('status')}>
            📊 Status
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'deploy' && (
            <form onSubmit={handleSubmit} className="form">
              <h2>Deployment Form</h2>

              <label>Customer Name:</label>
              <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required />

              <label>Number of Nodes:</label>
              <input type="number" name="nodes" value={formData.nodes} onChange={handleChange} required />

              <label>Domain Name:</label>
              <input type="text" name="domain" value={formData.domain} onChange={handleChange} required />

              <label>Docker Secrets: <span className="optional">(Optional)</span></label>
              <input name="dockerSecrets" value={formData.dockerSecrets} onChange={handleChange} />

              <label>Public Key: <span className="optional">(Optional)</span></label>
              <textarea name="publicKey" value={formData.publicKey} onChange={handleChange} />

              <label>Public IP: <span className="optional">(Optional)</span></label>
              <input type="text" name="publicIP" value={formData.publicIP} onChange={handleChange} />

              <label>RC:</label>
              <input type="text" name="rc" value={formData.rc} onChange={handleChange} required />

              <label>Policy:</label>
              <select name="policy" value={formData.policy} onChange={handleChange}>
                <option value="US">US</option>
                <option value="CANADA">CANADA</option>
                <option value="NONE">NONE</option>
              </select>

              <button type="submit">Submit</button>
            </form>
          )}

          {activeTab === 'status' && (
            <div className="status">
              <h2>Deployment Status</h2>
              <StatusTracker currentStage={currentStage} messages={statusMessages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
