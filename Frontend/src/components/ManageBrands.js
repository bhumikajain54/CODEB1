/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faCheckCircle,
  faPlusCircle,
  faEdit,
  faTrashAlt,
  faSave,
  faTimes,
  faSyncAlt,
  faFolderOpen,
  faCopyright
} from "@fortawesome/free-solid-svg-icons";

const ManageBrands = () => {
  const [brands, setBrands] = useState([]);
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [selectedChainId, setSelectedChainId] = useState("");
  const [editBrandId, setEditBrandId] = useState(null);
  const [editBrandName, setEditBrandName] = useState("");
  const [editChainId, setEditChainId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [totalBrands, setTotalBrands] = useState(0);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [showEditBrand, setShowEditBrand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterCompany, setFilterCompany] = useState("");
  const [filterGroup, setFilterGroup] = useState("");

  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    fetchBrands();
    fetchChains();
    fetchGroups();
  }, []);

  // Fetch All Brands
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/brands`);
      setBrands(response.data);
      setTotalBrands(response.data.length);
      setError(null);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError("Failed to load brands. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch All Chains
  const fetchChains = async () => {
    try {
      const response = await axios.get(`${API_URL}/chains`);
      setChains(response.data);
    } catch (err) {
      console.error("Error fetching chains:", err);
    }
  };

  // Fetch All Groups
  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups`);
      setGroups(response.data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  // Add a New Brand
  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      setError("Brand name cannot be empty.");
      return;
    }

    if (!selectedChainId) {
      setError("Please select a company.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/brands`, {
        brandName: newBrandName,
        chainId: selectedChainId
      });

      setBrands([...brands, response.data]);
      setNewBrandName("");
      setSelectedChainId("");
      setError(null);
      setSuccess("Brand added successfully!");
      setShowAddBrand(false);
      fetchBrands(); // Refresh the list to get accurate count
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error adding brand:", error);
      setError(error.response?.data?.error || "Brand already exists for this company!");
    } finally {
      setLoading(false);
    }
  };
  
  // Edit an Existing Brand
  const handleEditBrand = async () => {
    if (!editBrandName.trim()) {
      setError("Brand name cannot be empty");
      return;
    }
    
    if (!editChainId) {
      setError("Please select a company");
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/brands/${editBrandId}?chainId=${editChainId}`, {
        brandName: editBrandName
      });
      
      setEditBrandId(null);
      setEditBrandName("");
      setEditChainId("");
      setError(null);
      setSuccess("Brand updated successfully!");
      setShowEditBrand(false);
      fetchBrands(); // Refresh list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating brand:", err);
      setError(err.response?.data?.error || "Error updating brand");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Brand
  const handleDeleteBrand = async (brandId) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
  
    try {
      setLoading(true);
      
      // First check if the brand can be deleted
      const canDeleteResponse = await axios.get(`${API_URL}/brands/can-delete/${brandId}`);
      
      if (!canDeleteResponse.data) {
        setError("Cannot delete brand as it is associated with zones");
        setLoading(false);
        return;
      }
      
      const response = await axios.delete(`${API_URL}/brands/${brandId}`);
      
      setSuccess("Brand deleted successfully!");
      fetchBrands(); // Refresh list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting brand:", err);
      setError(err.response?.data?.error || "Error deleting brand");
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const initiateEditBrand = (brand) => {
    setEditBrandId(brand.brandId);
    setEditBrandName(brand.brandName);
    setEditChainId(brand.chain.chainId);
    setShowEditBrand(true);
    setShowAddBrand(false);
    setError(null);
    setSuccess(null);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Filter brands by company and group
  const filteredBrands = brands.filter(brand => {
    let matchesCompany = true;
    let matchesGroup = true;
    
    if (filterCompany) {
      matchesCompany = brand.chain && brand.chain.chainId.toString() === filterCompany;
    }
    
    if (filterGroup) {
      matchesGroup = brand.chain && brand.chain.group && brand.chain.group.groupId.toString() === filterGroup;
    }
    
    return matchesCompany && matchesGroup;
  });

  // Get chain name by chainId
  const getChainName = (chainId) => {
    const chain = chains.find(chain => chain.chainId.toString() === chainId.toString());
    return chain ? chain.companyName || chain.chainName : "";
  };
  
  return (
    <div className="dashboard-container">
      <div className="main-content">
        {/* Sidebar Component */}
        <Sidebar activePage="Manage Brands" />

        <div className="content-area">
          <div className="page-header">
            <h1>Brand Management</h1>
            <p>Create, edit, and manage your brands</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="alert alert-danger">
              <FontAwesomeIcon icon={faExclamationCircle} className="alert-icon" />
              {error}
              <button className="close-btn" onClick={() => setError(null)}>×</button>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              <FontAwesomeIcon icon={faCheckCircle} className="alert-icon" />
              <span className="alert-message">{success}</span>
              <button className="close-btn" onClick={() => setSuccess(null)}>×</button>
            </div>
          )}

          {!showAddBrand && !showEditBrand && (
            <div className="dashboard-content">
              <div className="dashboard-header">
                {/* Total Groups Card */}
                <div className="stats-card groups-card">
                  <div className="stats-card-content">
                    <div className="card-title">Total Groups</div>
                    <div className="card-value">{groups.length}</div>
                  </div>
                  <div className="stats-card-icon">
                    <FontAwesomeIcon icon={faFolderOpen} />
                  </div>
                </div>
                
                {/* Total Chains Card */}
                <div className="stats-card chains-card">
                  <div className="stats-card-content">
                    <div className="card-title">Total Chains</div>
                    <div className="card-value">{chains.length}</div>
                  </div>
                  <div className="stats-card-icon">
                    <FontAwesomeIcon icon={faFolderOpen} />
                  </div>
                </div>

                {/* Total Brands Card */}
                <div className="stats-card brands-card">
                  <div className="stats-card-content">
                    <div className="card-title">Total Brands</div>
                    <div className="card-value">{totalBrands}</div>
                  </div>
                  <div className="stats-card-icon">
                    <FontAwesomeIcon icon={faCopyright} />
                  </div>
                </div>

                {/* Filter options */}
                <div className="filter-section">
                  <div className="filter-row">
                    <div className="filter-item">
                      <label htmlFor="companyFilter">Filter by Company:</label>
                      <select
                        id="companyFilter"
                        value={filterCompany}
                        onChange={(e) => setFilterCompany(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">All</option>
                        {chains.map(chain => (
                          <option key={chain.chainId} value={chain.chainId}>
                            {chain.companyName || chain.chainName}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="filter-item">
                      <label htmlFor="groupFilter">Filter by Group:</label>
                      <select
                        id="groupFilter"
                        value={filterGroup}
                        onChange={(e) => setFilterGroup(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">All</option>
                        {groups.map(group => (
                          <option key={group.groupId} value={group.groupId}>
                            {group.groupName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Add Brand Button */}
                <button 
                  className="add-brand-btn" 
                  onClick={() => {
                    setShowAddBrand(true);
                    clearMessages();
                  }}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                  {loading ? "Loading..." : "Add Brand"}
                </button>
              </div>

              {/* Brands Table */}
              <div className="table-container">
                <table className="brands-table">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Group</th>
                      <th>Company</th>
                      <th>Brand</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="loading-cell">
                          <div className="loading-spinner"></div>
                          <span>Loading brands...</span>
                        </td>
                      </tr>
                    ) : filteredBrands.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="empty-cell">
                          <div className="empty-state">
                            <FontAwesomeIcon icon={faFolderOpen} className="empty-icon" />
                            <p>No brands found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredBrands.map((brand, index) => (
                        <tr key={brand.brandId}>
                          <td>{index + 1}</td>
                          <td>{brand.chain && brand.chain.group ? brand.chain.group.groupName : "N/A"}</td>
                          <td>{brand.chain ? (brand.chain.companyName || brand.chain.chainName) : "N/A"}</td>
                          <td>{brand.brandName}</td>
                          <td>
                            <button
                              className="edit-btn"
                              onClick={() => initiateEditBrand(brand)}
                              disabled={loading}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                              Edit
                            </button>
                          </td>
                          <td>
                            <button 
                              className="delete-btn" 
                              onClick={() => handleDeleteBrand(brand.brandId)}
                              disabled={loading}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Brand Form */}
          {showAddBrand && (
            <div className="brand-form">
              <h3>Add New Brand</h3>
              <div className="form-group">
                <label htmlFor="brandName">Enter Brand Name:</label>
                <input
                  id="brandName"
                  type="text"
                  placeholder="Enter Brand Name"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="form-input"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="companySelect">Select Company:</label>
                <select
                  id="companySelect"
                  value={selectedChainId}
                  onChange={(e) => setSelectedChainId(e.target.value)}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="">Select Company</option>
                  {chains.map(chain => (
                    <option key={chain.chainId} value={chain.chainId}>
                      {chain.companyName || chain.chainName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="button-group">
                <button 
                  className="submit-btn"
                  onClick={handleAddBrand}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} />
                      Add Brand
                    </>
                  )}
                </button>
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddBrand(false);
                    setNewBrandName("");
                    setSelectedChainId("");
                    clearMessages();
                  }}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Edit Brand Form */}
          {showEditBrand && (
            <div className="brand-form">
              <h3>Edit Brand</h3>
              <div className="form-group">
                <label htmlFor="editBrandName">Enter Brand Name:</label>
                <input
                  id="editBrandName"
                  type="text"
                  value={editBrandName}
                  onChange={(e) => setEditBrandName(e.target.value)}
                  className="form-input"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editCompanySelect">Select Company:</label>
                <select
                  id="editCompanySelect"
                  value={editChainId}
                  onChange={(e) => setEditChainId(e.target.value)}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="">Select Company</option>
                  {chains.map(chain => (
                    <option key={chain.chainId} value={chain.chainId}>
                      {chain.companyName || chain.chainName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="button-group">
                <button 
                  className="submit-btn"
                  onClick={handleEditBrand}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSyncAlt} />
                      Update
                    </>
                  )}
                </button>
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setShowEditBrand(false);
                    setEditBrandName("");
                    setEditChainId("");
                    clearMessages();
                  }}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBrands;