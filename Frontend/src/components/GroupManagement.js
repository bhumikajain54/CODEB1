import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar";

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [editGroupId, setEditGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [totalGroups, setTotalGroups] = useState(0);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  // Fetch All Groups
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/groups");
      const activeGroups = response.data.filter(group => group.active !== false);
      setGroups(activeGroups);
      setTotalGroups(activeGroups.length);
      console.log("Fetched groups:", response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError("Failed to load groups. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a New Group
  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      setError("Group name cannot be empty");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/api/groups", {
        groupName: newGroupName,
      });

      console.log("Group Added:", response.data);
      setNewGroupName("");
      setError(null);
      setSuccess("Group added successfully!");
      setShowAddGroup(false);
      fetchGroups();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding group:", err.response?.data);
      setError(err.response?.data || "Group Already Exists!!!");
    }
  };

  // Edit an Existing Group
  const handleEditGroup = async () => {
    if (!editGroupName.trim()) {
      setError("Group name cannot be empty");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/api/groups/${editGroupId}`, {
        groupName: editGroupName
      });
      console.log("Update response:", response.data);
      setEditGroupId(null);
      setEditGroupName("");
      setError(null);
      setSuccess("Group updated successfully!");
      setShowEditGroup(false);
      fetchGroups();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating group:", err);
      setError(err.response?.data || "Error updating group");
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      console.log("Attempting to delete group with ID:", groupId);
      
      // Get the authentication token from wherever you store it
      const token = localStorage.getItem("token"); // or sessionStorage, or from a context
      
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const response = await axios.delete(`http://localhost:8080/api/groups/${groupId}`, config);
      
      console.log("Delete response:", response.data);
      setSuccess("Group deleted successfully!");
      fetchGroups(); // Refresh list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting group:", err);
      
      if (err.response && err.response.status === 403) {
        setError("Permission denied: You don't have authorization to delete this group.");
      } else {
        setError(`Error deleting group: ${err.response?.data || err.message}`);
      }
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  const initiateEditGroup = (group) => {
    setEditGroupId(group.groupId);
    setEditGroupName(group.groupName);
    setShowEditGroup(true);
    setShowAddGroup(false);
  };

  const handleCancel = () => {
    setShowAddGroup(false);
    setShowEditGroup(false);
    setError(null);
    setNewGroupName("");
    setEditGroupName("");
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        {/* Sidebar Component */}
        <Sidebar activePage="Manage Groups" />
       
        {/* Main Content Area */}
        <div className="content-area">
          <div className="content-header">
            <h2>Group Management</h2>
            <p>Create, edit, and manage your groups</p>
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

          {!showAddGroup && !showEditGroup && (
            <>
              <div className="dashboard-stats">
                {/* Total Groups Card */}
                <div className="stats-card">
                  <div className="stats-details">
                    <div className="card-title">Total Groups</div>
                    <div className="card-value">{totalGroups}</div>
                  </div>
                </div>
              </div>

              {/* Add Group Button */}
              <div className="action-bar">
                <button 
                  className="add-group-btn" 
                  onClick={() => setShowAddGroup(true)}
                  disabled={loading}
                >
                  + Add New Group
                </button>
              </div>

              {/* Groups Table */}
              <div className="table-container">
                <table className="groups-table">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Group Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="loading-cell">
                          <div className="loading-spinner"></div>
                          <div>Loading groups...</div>
                        </td>
                      </tr>
                    ) : groups.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="empty-cell">
                          No groups found. Add a new group to get started.
                        </td>
                      </tr>
                    ) : (
                      groups.map((group, index) => (
                        <tr key={group.groupId}>
                          <td>{index + 1}</td>
                          <td>{group.groupName}</td>
                          <td className="action-cell">
                            <button
                              className="edit-btn"
                              onClick={() => initiateEditGroup(group)}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn" 
                              onClick={() => handleDeleteGroup(group.groupId)}
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

          {/* Add Group Form */}
          {showAddGroup && (
            <div className="card">
              <div className="card-header">
                <h3>Add New Group</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="groupName">Group Name</label>
                  <input
                    id="groupName"
                    type="text"
                    placeholder="Enter Unique Group Name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="button-group">
                  <button 
                    className="submit-btn"
                    onClick={handleAddGroup}
                  >
                    Add Group
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

          {/* Edit Group Form */}
          {showEditGroup && (
            <div className="card">
              <div className="card-header">
                <h3>Edit Group</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="editGroupName">Group Name</label>
                  <input
                    id="editGroupName"
                    type="text"
                    value={editGroupName}
                    onChange={(e) => setEditGroupName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="button-group">
                  <button 
                    className="submit-btn"
                    onClick={handleEditGroup}
                  >
                    Update Group
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

export default GroupManagement;