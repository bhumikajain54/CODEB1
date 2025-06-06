import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar";

const ManageChain = () => {
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newGstnNo, setNewGstnNo] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [editChainId, setEditChainId] = useState(null);
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editGstnNo, setEditGstnNo] = useState("");
  const [editGroupId, setEditGroupId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [totalChains, setTotalChains] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const [showAddChain, setShowAddChain] = useState(false);
  const [showEditChain, setShowEditChain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterGroupId, setFilterGroupId] = useState("");

  useEffect(() => {
    fetchGroups();
    fetchChains();
  }, []);

  // Fetch All Groups for dropdown
  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/groups");
      const activeGroups = response.data.filter(group => group.active !== false);
      setGroups(activeGroups);
      setTotalGroups(activeGroups.length);
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError("Failed to load groups. Please try again.");
    }
  };

  // Fetch All Chains
  const fetchChains = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/chains");
      const activeChains = response.data.filter(chain => chain.active !== false);
      setChains(activeChains);
      setTotalChains(activeChains.length);
      console.log("Fetched chains:", response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching chains:", err);
      setError("Failed to load chains. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter chains by group
  const filteredChains = filterGroupId 
    ? chains.filter(chain => chain.group.groupId.toString() === filterGroupId) 
    : chains;

  // Add a New Chain
  const handleAddChain = async () => {
    if (!newCompanyName.trim()) {
      setError("Company name cannot be empty");
      return;
    }
    if (!newGstnNo.trim()) {
      setError("GSTN number cannot be empty");
      return;
    }
    if (!selectedGroupId) {
      setError("Please select a group");
      return;
    }

    try {
      const selectedGroup = groups.find(g => g.groupId.toString() === selectedGroupId);
      
      const response = await axios.post("http://localhost:8080/api/chains", {
        companyName: newCompanyName,
        gstnNo: newGstnNo,
        group: selectedGroup
      });

      console.log("Chain Added:", response.data);
      setNewCompanyName("");
      setNewGstnNo("");
      setSelectedGroupId("");
      setError(null);
      setSuccess("Company added successfully!");
      setShowAddChain(false);
      fetchChains();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding chain:", err.response?.data);
      setError(err.response?.data || "GSTN already exists!");
    }
  };

  // Edit an Existing Chain
  const handleEditChain = async () => {
    if (!editCompanyName.trim()) {
      setError("Company name cannot be empty");
      return;
    }
    if (!editGstnNo.trim()) {
      setError("GSTN number cannot be empty");
      return;
    }

    try {
      const selectedGroup = groups.find(g => g.groupId.toString() === editGroupId);
      
      const response = await axios.put(`http://localhost:8080/api/chains/${editChainId}`, {
        companyName: editCompanyName,
        gstnNo: editGstnNo,
        group: selectedGroup,
        updatedAt: new Date()
      });
      
      console.log("Update response:", response.data);
      setEditChainId(null);
      setEditCompanyName("");
      setEditGstnNo("");
      setEditGroupId("");
      setError(null);
      setSuccess("Company updated successfully!");
      setShowEditChain(false);
      fetchChains();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating chain:", err);
      setError(err.response?.data || "Error updating company");
    }
  };

  const handleDeleteChain = async (chainId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    try {
      console.log("Attempting to delete chain with ID:", chainId);
      
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const response = await axios.delete(`http://localhost:8080/api/chains/${chainId}`, config);
      
      console.log("Delete response:", response.data);
      setSuccess("Company deleted successfully!");
      fetchChains();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting chain:", err);
      
      if (err.response && err.response.status === 403) {
        setError("Permission denied: You don't have authorization to delete this company.");
      } else {
        setError(`Error deleting company: ${err.response?.data || err.message}`);
      }
      
      setTimeout(() => setError(null), 5000);
    }
  };

  const initiateEditChain = (chain) => {
    setEditChainId(chain.chainId);
    setEditCompanyName(chain.companyName);
    setEditGstnNo(chain.gstnNo);
    setEditGroupId(chain.group.groupId.toString());
    setShowEditChain(true);
    setShowAddChain(false);
  };

  const handleCancel = () => {
    setShowAddChain(false);
    setShowEditChain(false);
    setError(null);
    setNewCompanyName("");
    setNewGstnNo("");
    setSelectedGroupId("");
    setEditCompanyName("");
    setEditGstnNo("");
    setEditGroupId("");
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        {/* Sidebar Component */}
        <Sidebar activePage="Manage Chain" />

        {/* Main Content Area */}
        <div className="content-area">
          <div className="content-header">
            <h2>Manage Chain Section</h2>
            <p>Create, edit, and manage your companies</p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="alert alert-danger">
              {error}
              <button className="close-btn" onClick={() => setError(null)}>×</button>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              {success}
              <button className="close-btn" onClick={() => setSuccess(null)}>×</button>
            </div>
          )}

          {!showAddChain && !showEditChain && (
            <>
              <div className="dashboard-stats">
                {/* Total Groups Card */}
                <div className="stats-card" style={{ backgroundColor: '#e74c3c', color: 'white' }}>
                  <div className="stats-details">
                    <div className="card-title" style={{ color: 'white' }}>Total Groups</div>
                    <div className="card-value">{totalGroups}</div>
                  </div>
                </div>

                {/* Total Chains Card */}
                <div className="stats-card" style={{ backgroundColor: '#f1c40f', color: 'white' }}>
                  <div className="stats-details">
                    <div className="card-title" style={{ color: 'white' }}>Total Chains</div>
                    <div className="card-value">{totalChains}</div>
                  </div>
                </div>
              </div>

              <div className="action-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Add Chain Button */}
                <button 
                  className="add-group-btn" 
                  onClick={() => setShowAddChain(true)}
                  disabled={loading}
                  style={{ backgroundColor: '#27ae60' }}
                >
                  Add Company
                </button>

                {/* Filter By Group */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ marginRight: '10px', fontWeight: '500' }}>Filter by Group</label>
                  <select 
                    value={filterGroupId} 
                    onChange={(e) => setFilterGroupId(e.target.value)}
                    style={{ 
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      minWidth: '200px'
                    }}
                  >
                    <option value="">All Groups</option>
                    {groups.map(group => (
                      <option key={group.groupId} value={group.groupId}>
                        {group.groupName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chains Table */}
              <div className="table-container">
                <table className="groups-table">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Group Name</th>
                      <th>Company</th>
                      <th>GSTN</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="loading-cell">
                          <div className="loading-spinner"></div>
                          <div>Loading companies...</div>
                        </td>
                      </tr>
                    ) : filteredChains.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="empty-cell">
                          No companies found. Add a new company to get started.
                        </td>
                      </tr>
                    ) : (
                      filteredChains.map((chain, index) => (
                        <tr key={chain.chainId}>
                          <td>{index + 1}</td>
                          <td>{chain.group.groupName}</td>
                          <td>{chain.companyName}</td>
                          <td>{chain.gstnNo}</td>
                          <td>
                            <button
                              className="edit-btn"
                              onClick={() => initiateEditChain(chain)}
                              style={{ 
                                backgroundColor: '#f39c12', 
                                color: 'white', 
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px'
                              }}
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button 
                              className="delete-btn" 
                              onClick={() => handleDeleteChain(chain.chainId)}
                              style={{ 
                                backgroundColor: '#e74c3c', 
                                color: 'white', 
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px'
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Add Chain Form */}
          {showAddChain && (
            <div className="card">
              <div className="card-header">
                <h3>Add New Company</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="companyName">Enter Company Name:</label>
                  <input
                    id="companyName"
                    type="text"
                    placeholder="Enter Company Name"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gstnNo">Enter GSTN:</label>
                  <input
                    id="gstnNo"
                    type="text"
                    placeholder="Enter GST Number"
                    value={newGstnNo}
                    onChange={(e) => setNewGstnNo(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="selectGroup">Select Group:</label>
                  <select
                    id="selectGroup"
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select a group</option>
                    {groups.map(group => (
                      <option key={group.groupId} value={group.groupId}>
                        {group.groupName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="button-group">
                  <button 
                    className="submit-btn"
                    onClick={handleAddChain}
                    style={{ backgroundColor: '#3498db' }}
                  >
                    Add Company
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Chain Form */}
          {showEditChain && (
            <div className="card">
              <div className="card-header">
                <h3>Edit Company</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="editCompanyName">Enter Company Name:</label>
                  <input
                    id="editCompanyName"
                    type="text"
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="editGstnNo">Enter GSTN:</label>
                  <input
                    id="editGstnNo"
                    type="text"
                    value={editGstnNo}
                    onChange={(e) => setEditGstnNo(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="editSelectGroup">Select Group:</label>
                  <select
                    id="editSelectGroup"
                    value={editGroupId}
                    onChange={(e) => setEditGroupId(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select a group</option>
                    {groups.map(group => (
                      <option key={group.groupId} value={group.groupId}>
                        {group.groupName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="button-group">
                  <button 
                    className="submit-btn"
                    onClick={handleEditChain}
                    style={{ backgroundColor: '#3498db' }}
                  >
                    Update
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageChain;