/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar";
import { useNavigate } from "react-router-dom";
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
  faCalculator,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";

const ManageEstimates = () => {
  // State for estimates and related data
  const [estimates, setEstimates] = useState([]);
  const [chains, setChains] = useState([]);
  const [brands, setBrands] = useState([]);
  const [zones, setZones] = useState([]);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  // State for form inputs
  const [newEstimate, setNewEstimate] = useState({
    groupName: "",
    brandName: "",
    zoneName: "",
    service: "",
    quantity: "",
    costPerUnit: "",
    totalCost: "",
    deliveryDate: "",
    deliveryDetails: "",
  });

  // State for edit form
  const [editEstimateId, setEditEstimateId] = useState(null);
  const [editEstimate, setEditEstimate] = useState({
    groupName: "",
    brandName: "",
    zoneName: "",
    service: "",
    quantity: "",
    costPerUnit: "",
    totalCost: "",
    deliveryDate: "",
    deliveryDetails: "",
  });

  // State for UI control
  const [selectedChainId, setSelectedChainId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [totalEstimates, setTotalEstimates] = useState(0);
  const [showAddEstimate, setShowAddEstimate] = useState(false);
  const [showEditEstimate, setShowEditEstimate] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for filters
  const [filterGroup, setFilterGroup] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterZone, setFilterZone] = useState("");

  // Derived state for filtered brands and zones based on selections
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);

  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    fetchEstimates();
    fetchChains();
    fetchGroups();
    fetchBrands();
    fetchZones();
  }, []);

  // Update filtered brands when selected chain changes
  useEffect(() => {
    if (selectedChainId) {
      const chainBrands = brands.filter(
        (brand) =>
          brand.chain && brand.chain.chainId.toString() === selectedChainId.toString()
      );
      setFilteredBrands(chainBrands);

      // Reset brand and zone selections when changing chain
      setNewEstimate((prev) => ({
        ...prev,
        brandName: "",
        zoneName: "",
      }));
      setFilteredZones([]);
    } else {
      setFilteredBrands([]);
    }
  }, [selectedChainId, brands]);

  // Update filtered zones when selected brand changes
  useEffect(() => {
    if (newEstimate.brandName) {
      const brandZones = zones.filter(
        (zone) => zone.brand && zone.brand.brandName === newEstimate.brandName
      );
      setFilteredZones(brandZones);

      // Reset zone selection when changing brand
      setNewEstimate((prev) => ({
        ...prev,
        zoneName: "",
      }));
    } else {
      setFilteredZones([]);
    }
  }, [newEstimate.brandName, zones]);

  // Fetch All Estimates
  const fetchEstimates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/estimates`);
      setEstimates(response.data);
      setTotalEstimates(response.data.length);
      setError(null);
    } catch (err) {
      console.error("Error fetching estimates:", err);
      setError("Failed to load estimates. Please try again.");
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

  // Fetch All Brands
  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/brands`);
      setBrands(response.data);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  // Fetch All Zones
  const fetchZones = async () => {
    try {
      const response = await axios.get(`${API_URL}/zones`);
      setZones(response.data);
    } catch (err) {
      console.error("Error fetching zones:", err);
    }
  };

  // Handle form input changes for new estimate
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewEstimate({
      ...newEstimate,
      [name]: value,
    });

    // If changing the chain, update the filtered brands
    if (name === "chainId") {
      setSelectedChainId(value);
    }
  };

  // Handle group selection
  const handleGroupChange = (e) => {
    const groupId = e.target.value;
    const selectedGroup = groups.find(
      (group) => group.groupId.toString() === groupId
    );

    setSelectedGroupId(groupId);
    setNewEstimate({
      ...newEstimate,
      groupName: selectedGroup ? selectedGroup.groupName : "",
    });
  };

  // Handle edit group selection
  const handleEditGroupChange = (e) => {
    const groupId = e.target.value;
    const selectedGroup = groups.find(
      (group) => group.groupId.toString() === groupId
    );

    setEditEstimate({
      ...editEstimate,
      groupName: selectedGroup ? selectedGroup.groupName : "",
    });
  };

  // Calculate total cost when quantity or cost per unit changes
  useEffect(() => {
    if (newEstimate.quantity && newEstimate.costPerUnit) {
      const total = parseFloat(newEstimate.quantity) * parseFloat(newEstimate.costPerUnit);
      setNewEstimate((prev) => ({
        ...prev,
        totalCost: total.toFixed(2),
      }));
    }
  }, [newEstimate.quantity, newEstimate.costPerUnit]);

  // Calculate total cost for edit form
  useEffect(() => {
    if (editEstimate.quantity && editEstimate.costPerUnit) {
      const total = parseFloat(editEstimate.quantity) * parseFloat(editEstimate.costPerUnit);
      setEditEstimate((prev) => ({
        ...prev,
        totalCost: total.toFixed(2),
      }));
    }
  }, [editEstimate.quantity, editEstimate.costPerUnit]);

  // Add a New Estimate
  const handleAddEstimate = async () => {
    if (!validateEstimateForm(newEstimate)) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/estimates`,
        {
          ...newEstimate,
          totalCost: newEstimate.totalCost || parseFloat(newEstimate.quantity) * parseFloat(newEstimate.costPerUnit),
        },
        {
          params: {
            chainId: selectedChainId,
          },
        }
      );

      setEstimates([...estimates, response.data]);
      resetForm();
      setError(null);
      setSuccess("Estimate added successfully!");
      setShowAddEstimate(false);
      fetchEstimates(); // Refresh the list to get accurate count
    } catch (error) {
      console.error("Error adding estimate:", error);
      setError(error.response?.data?.error || "Failed to add estimate.");
    } finally {
      setLoading(false);
    }
  };

  // Edit an Existing Estimate
  const handleEditEstimate = async () => {
    if (!validateEstimateForm(editEstimate)) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `${API_URL}/estimates/${editEstimateId}`,
        {
          ...editEstimate,
          totalCost: editEstimate.totalCost || parseFloat(editEstimate.quantity) * parseFloat(editEstimate.costPerUnit),
        },
        {
          params: {
            chainId: editEstimate.chain?.chainId,
          },
        }
      );

      setEditEstimateId(null);
      setEditEstimate({
        groupName: "",
        brandName: "",
        zoneName: "",
        service: "",
        quantity: "",
        costPerUnit: "",
        totalCost: "",
        deliveryDate: "",
        deliveryDetails: "",
      });
      setError(null);
      setSuccess("Estimate updated successfully!");
      setShowEditEstimate(false);
      fetchEstimates(); // Refresh list
    } catch (err) {
      console.error("Error updating estimate:", err);
      setError(err.response?.data?.error || "Error updating estimate");
    } finally {
      setLoading(false);
    }
  };

  // Delete an Estimate
  const handleDeleteEstimate = async (estimateId) => {
    if (!window.confirm("Are you sure you want to delete this estimate?")) return;

    try {
      setLoading(true);

      await axios.delete(`${API_URL}/estimates/${estimateId}`);

      setSuccess("Estimate deleted successfully!");
      fetchEstimates(); // Refresh list
    } catch (err) {
      console.error("Error deleting estimate:", err);
      setError(err.response?.data?.error || "Error deleting estimate");
    } finally {
      setLoading(false);
    }
  };

  // Validate the estimate form
  const validateEstimateForm = (estimateData) => {
    if (!estimateData.groupName) {
      setError("Group name is required.");
      return false;
    }

    if (!selectedChainId && !estimateData.chain) {
      setError("Company name is required.");
      return false;
    }

    if (!estimateData.brandName) {
      setError("Brand name is required.");
      return false;
    }

    if (!estimateData.zoneName) {
      setError("Zone name is required.");
      return false;
    }

    if (!estimateData.service || estimateData.service.trim() === "") {
      setError("Service provided is required.");
      return false;
    }

    if (!estimateData.quantity) {
      setError("Total quantity is required.");
      return false;
    }

    if (!estimateData.costPerUnit) {
      setError("Cost per quantity is required.");
      return false;
    }

    if (!estimateData.deliveryDate) {
      setError("Expected delivery date is required.");
      return false;
    }

    return true;
  };

  // Initialize edit form with existing estimate data
  const initiateEditEstimate = (estimate) => {
    setEditEstimateId(estimate.estimateId);
    setEditEstimate({
      groupName: estimate.groupName,
      brandName: estimate.brandName,
      zoneName: estimate.zoneName,
      service: estimate.service,
      quantity: estimate.quantity,
      costPerUnit: estimate.costPerUnit,
      totalCost: estimate.totalCost,
      deliveryDate: estimate.deliveryDate ? estimate.deliveryDate.substring(0, 10) : "",
      deliveryDetails: estimate.deliveryDetails || "",
      chain: estimate.chain,
    });

    // Set selected group ID
    const selectedGroup = groups.find((g) => g.groupName === estimate.groupName);
    if (selectedGroup) {
      setSelectedGroupId(selectedGroup.groupId.toString());
    }

    // Filter brands for the selected chain
    if (estimate.chain) {
      const chainBrands = brands.filter(
        (b) => b.chain && b.chain.chainId === estimate.chain.chainId
      );
      setFilteredBrands(chainBrands);

      // Filter zones for the selected brand
      const brandZones = zones.filter(
        (z) => z.brand && z.brand.brandName === estimate.brandName
      );
      setFilteredZones(brandZones);
    }

    setShowEditEstimate(true);
    setShowAddEstimate(false);
    clearMessages();
  };

  // Handle edit brand selection changes
  const handleEditBrandChange = (e) => {
    const brandName = e.target.value;

    setEditEstimate((prev) => ({
      ...prev,
      brandName,
      zoneName: "", // Reset zone when brand changes
    }));

    // Update filtered zones for the selected brand
    const brandZones = zones.filter(
      (zone) => zone.brand && zone.brand.brandName === brandName
    );
    setFilteredZones(brandZones);
  };

  // Add this to the handleEditInputChange function
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

    setEditEstimate({
      ...editEstimate,
      [name]: value,
    });

    // If changing the brand, update filtered zones
    if (name === "brandName") {
      handleEditBrandChange(e);
    }
  };

  // Reset form and clear messages
  const resetForm = () => {
    setNewEstimate({
      groupName: "",
      brandName: "",
      zoneName: "",
      service: "",
      quantity: "",
      costPerUnit: "",
      totalCost: "",
      deliveryDate: "",
      deliveryDetails: "",
    });
    setSelectedChainId("");
    setSelectedGroupId("");
    setFilteredBrands([]);
    setFilteredZones([]);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Filter estimates based on selected filters
  const getFilteredEstimates = () => {
    return estimates.filter((estimate) => {
      let matchesGroup = true;
      let matchesCompany = true;
      let matchesBrand = true;
      let matchesZone = true;

      if (filterGroup) {
        matchesGroup = estimate.groupName === filterGroup;
      }

      if (filterCompany) {
        matchesCompany =
          estimate.chain && estimate.chain.chainId.toString() === filterCompany;
      }

      if (filterBrand) {
        matchesBrand = estimate.brandName === filterBrand;
      }

      if (filterZone) {
        matchesZone = estimate.zoneName === filterZone;
      }

      return matchesGroup && matchesCompany && matchesBrand && matchesZone;
    });
  };
  const handleGenerateInvoice = (estimate) => {
    // Navigate to invoice creation page with estimate data
    navigate('/invoices', { 
      state: { 
        ...estimate,
        estimateId: estimate.estimateId,
        chainId: estimate.chain?.chainId,
        service: estimate.service,
        quantity: estimate.quantity,
        costPerUnit: estimate.costPerUnit,
        amountPayable: estimate.totalCost,
        deliveryDate: estimate.deliveryDate,
        deliveryDetails: estimate.deliveryDetails,
        companyName: estimate.chain?.companyName || estimate.chain?.chainName,
        gstNumber: estimate.chain?.gstNumber || "Not Available",
        companyAddress: estimate.chain?.companyAddress || "Address not available",
        brandName: estimate.brandName,
        zoneName: estimate.zoneName
      } 
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (err) {
      return dateString;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        {/* Sidebar Component */}
        <Sidebar activePage="Manage Estimates" />

        <div className="content-area">
          <div className="page-header">
            <h1>Estimate Management</h1>
            <p>Create, edit, and manage your estimates</p>
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

          {!showAddEstimate && !showEditEstimate && (
            <div className="dashboard-content">
              <div className="dashboard-header">
                {/* Stats Cards */}
                <div className="stats-card">
                  <div className="stats-card-content">
                    <div className="card-title">Total Estimates</div>
                    <div className="card-value">{totalEstimates}</div>
                  </div>
                  <div className="stats-card-icon">
                    <FontAwesomeIcon icon={faCalculator} />
                  </div>
                </div>

                {/* Filter options */}
                <div className="filter-section">
                  <div className="filter-row">
                    <div className="filter-item">
                      <label htmlFor="groupFilter">Filter by Group:</label>
                      <select
                        id="groupFilter"
                        value={filterGroup}
                        onChange={(e) => setFilterGroup(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">All</option>
                        {groups.map((group) => (
                          <option key={group.groupId} value={group.groupName}>
                            {group.groupName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-item">
                      <label htmlFor="companyFilter">Filter by Company:</label>
                      <select
                        id="companyFilter"
                        value={filterCompany}
                        onChange={(e) => setFilterCompany(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">All</option>
                        {chains.map((chain) => (
                          <option key={chain.chainId} value={chain.chainId}>
                            {chain.companyName || chain.chainName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-item">
                      <label htmlFor="brandFilter">Filter by Brand:</label>
                      <select
                        id="brandFilter"
                        value={filterBrand}
                        onChange={(e) => setFilterBrand(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">All</option>
                        {brands.map((brand) => (
                          <option key={brand.brandId} value={brand.brandName}>
                            {brand.brandName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-item">
                      <label htmlFor="zoneFilter">Filter by Zone:</label>
                      <select
                        id="zoneFilter"
                        value={filterZone}
                        onChange={(e) => setFilterZone(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">All</option>
                        {zones.map((zone) => (
                          <option key={zone.zoneId} value={zone.zoneName}>
                            {zone.zoneName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Add Estimate Button */}
                <button
                  className="add-brand-btn"
                  onClick={() => {
                    setShowAddEstimate(true);
                    clearMessages();
                  }}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                  {loading ? "Loading..." : "Create Estimate"}
                </button>
              </div>

              {/* Estimates Table */}
              <div className="table-container">
                <table className="brands-table">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Group</th>
                      <th>Company</th>
                      <th>Brand</th>
                      <th>Zone</th>
                      <th>Service</th>
                      <th>Quantity</th>
                      <th>Cost/Unit</th>
                      <th>Total Cost</th>
                      <th>Delivery Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="11" className="loading-cell">
                          <div className="loading-spinner"></div>
                          <span>Loading estimates...</span>
                        </td>
                      </tr>
                    ) : getFilteredEstimates().length === 0 ? (
                      <tr>
                        <td colSpan="11" className="empty-cell">
                          <div className="empty-state">
                            <FontAwesomeIcon icon={faFolderOpen} className="empty-icon" />
                            <p>No estimates found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      getFilteredEstimates().map((estimate, index) => (
                        <tr key={estimate.estimateId}>
                          <td>{index + 1}</td>
                          <td>{estimate.groupName}</td>
                          <td>
                            {estimate.chain
                              ? estimate.chain.companyName || estimate.chain.chainName
                              : "N/A"}
                          </td>
                          <td>{estimate.brandName}</td>
                          <td>{estimate.zoneName}</td>
                          <td>{estimate.service}</td>
                          <td>{estimate.quantity}</td>
                          <td>{estimate.costPerUnit}</td>
                          <td>{estimate.totalCost}</td>
                          <td>{formatDate(estimate.deliveryDate)}</td>
<td className="action-buttons">
  <button
    className="edit-btn"
    onClick={() => initiateEditEstimate(estimate)}
    disabled={loading}
  >
    <FontAwesomeIcon icon={faEdit} />
  </button>
  <button
    className="delete-btn"
    onClick={() => handleDeleteEstimate(estimate.estimateId)}
    disabled={loading}
  >
    <FontAwesomeIcon icon={faTrashAlt} />
  </button>
  <button 
    className="generate-btn"
    onClick={() => handleGenerateInvoice(estimate)}
    disabled={loading}
  >
    Generate
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

          {/* Add Estimate Form */}
          {showAddEstimate && (
            <div className="estimate-form">
              <h3>Manage Estimate Section</h3>

              <div className="form-container">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="groupSelect">Select Group:</label>
                    <select
                      id="groupSelect"
                      value={selectedGroupId}
                      onChange={handleGroupChange}
                      className="form-select"
                      disabled={loading}
                    >
                      <option value="">Select Group</option>
                      {groups.map((group) => (
                        <option key={group.groupId} value={group.groupId}>
                          {group.groupName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="totalQuantity">Total Quantity:</label>
                    <input
                      id="totalQuantity"
                      type="text"
                      name="quantity"
                      placeholder="Enter Total Qty"
                      value={newEstimate.quantity}
                      onChange={handleInputChange}
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="chainSelect">Select Chain ID or Company Name:</label>
                    <select
                      id="chainSelect"
                      name="chainId"
                      value={selectedChainId}
                      onChange={handleInputChange}
                      className="form-select"
                      disabled={loading}
                    >
                      <option value="">Select Company</option>
                      {chains.map((chain) => (
                        <option key={chain.chainId} value={chain.chainId}>
                          {chain.companyName || chain.chainName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="costPerUnit">Cost Per Quantity:</label>
                    <input
                      id="costPerUnit"
                      type="text"
                      name="costPerUnit"
                      placeholder="Enter Cost Per Qty"
                      value={newEstimate.costPerUnit}
                      onChange={handleInputChange}
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="brandSelect">Select Brand:</label>
                    <select
                      id="brandSelect"
                      name="brandName"
                      value={newEstimate.brandName}
                      onChange={handleInputChange}
                      className="form-select"
                      disabled={loading || !selectedChainId}
                    >
                      <option value="">Select Brand</option>
                      {filteredBrands.map((brand) => (
                        <option key={brand.brandId} value={brand.brandName}>
                          {brand.brandName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="totalCost">Estimated Amount in Rs:</label>
                    <input
                      id="totalCost"
                      type="text"
                      name="totalCost"
                      placeholder="Enter Amount"
                      value={newEstimate.totalCost}
                      onChange={handleInputChange}
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zoneSelect">Select Zone:</label>
                    <select
                      id="zoneSelect"
                      name="zoneName"
                      value={newEstimate.zoneName}
                      onChange={handleInputChange}
                      className="form-select"
                      disabled={loading || !newEstimate.brandName}
                    >
                      <option value="">Select Zone</option>
                      {filteredZones.map((zone) => (
                        <option key={zone.zoneId} value={zone.zoneName}>
                          {zone.zoneName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="deliveryDate">Expected Delivery Date:</label>
                    <input
                      id="deliveryDate"
                      type="date"
                      name="deliveryDate"
                      value={newEstimate.deliveryDate}
                      onChange={handleInputChange}
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="service">Service Provided:</label>
                    <input
                      id="service"
                      type="text"
                      name="service"
                      placeholder="Enter Service"
                      value={newEstimate.service}
                      onChange={handleInputChange}
                      className="form-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="deliveryDetails">Other Delivery Details:</label>
                    <textarea
                      id="deliveryDetails"
                      name="deliveryDetails"
                      placeholder="Enter Delivery Details"
                      value={newEstimate.deliveryDetails}
                      onChange={handleInputChange}
                      className="form-textarea"
                      disabled={loading}
                    ></textarea>
                  </div>
                </div>

                <div className="button-group">
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setShowAddEstimate(false);
                      resetForm();
                      clearMessages();
                    }}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                  <button
                    className="submit-btn"
                    onClick={handleAddEstimate}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="btn-spinner"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} /> Create and Save Estimate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Estimate Form */}
          {showEditEstimate && (
            <div className="estimate-form">
              <h3>Manage Estimate Section</h3>

              <div className="form-container">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editGroupSelect">Select Group:</label>
                    <select
                      id="editGroupSelect"
                      value={
                        selectedGroupId ||
                        groups.find((g) => g.groupName === editEstimate.groupName)?.groupId
                      }
                      onChange={handleEditGroupChange}
                      className="form-select"
                      disabled={loading}
                    >
                      <option value="">Select Group</option>
                      {groups.map((group) => (
                        <option key={group.groupId} value={group.groupId}>
                          {group.groupName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="editTotalQuantity">Total Quantity:</label>
                    <input
                      id="editTotalQuantity"
                      type="text"
                      name="quantity"
                      placeholder="Enter Total Qty"
                      value={editEstimate.quantity}
                      onChange={handleEditInputChange}
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editChainSelect">Select Chain ID or Company Name:</label>
                    <select
                      id="editChainSelect"
                      name="chainId"
                      value={editEstimate.chain ? editEstimate.chain.chainId : ""}
                      onChange={(e) => {
                        const chainId = e.target.value;
                        // Find the selected chain
                        const selectedChain = chains.find(
                          (chain) => chain.chainId.toString() === chainId
                        );

                        // Update the editEstimate state with the new chain
                        setEditEstimate({
                          ...editEstimate,
                          chain: selectedChain,
                          brandName: "", // Reset brand when chain changes
                          zoneName: "", // Reset zone when chain changes
                        });

                        // Update filtered brands for the selected chain
                        if (chainId) {
                          const chainBrands = brands.filter(
                            (brand) =>
                              brand.chain && brand.chain.chainId.toString() === chainId
                          );
                          setFilteredBrands(chainBrands);
                          setFilteredZones([]); // Clear filtered zones
                        } else {
                          setFilteredBrands([]);
                          setFilteredZones([]);
                        }
                      }}
                      className="form-select"
                      disabled={loading}
                    >
                      <option value="">Select Company</option>
                      {chains.map((chain) => (
                        <option key={chain.chainId} value={chain.chainId}>
                          {chain.companyName || chain.chainName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="editCostPerUnit">Cost Per Quantity:</label>
                    <input
                      id="editCostPerUnit"
                      type="text"
                      name="costPerUnit"
                      placeholder="Enter Cost Per Qty"
                      value={editEstimate.costPerUnit}
                      onChange={handleEditInputChange}
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editBrandSelect">Select Brand:</label>
                    <select
                      id="editBrandSelect"
                      name="brandName"
                      value={editEstimate.brandName}
                      onChange={handleEditInputChange}
                      className="form-select"
                      disabled={loading}
                    >
                      <option value="">Select Brand</option>
                      {filteredBrands.map((brand) => (
                        <option key={brand.brandId} value={brand.brandName}>
                          {brand.brandName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="editTotalCost">Estimated Amount in Rs:</label>
                    <input
                      id="editTotalCost"
                      type="text"
                      name="totalCost"
                      placeholder="Enter Amount"
                      value={editEstimate.totalCost}
                      onChange={handleEditInputChange}
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editZoneSelect">Select Zone:</label>
                    <select
                      id="editZoneSelect"
                      name="zoneName"
                      value={editEstimate.zoneName}
                      onChange={handleEditInputChange}
                      className="form-select"
                      disabled={loading || !editEstimate.brandName}
                    >
                      <option value="">Select Zone</option>
                      {filteredZones.map((zone) => (
                        <option key={zone.zoneId} value={zone.zoneName}>
                          {zone.zoneName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="editDeliveryDate">Expected Delivery Date:</label>
                    <input
                      id="editDeliveryDate"
                      type="date"
                      name="deliveryDate"
                      value={editEstimate.deliveryDate}
                      onChange={handleEditInputChange}
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editService">Service Provided:</label>
                    <input
                      id="editService"
                      type="text"
                      name="service"
                      placeholder="Enter Service"
                      value={editEstimate.service}
                      onChange={handleEditInputChange}
                      className="form-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="editDeliveryDetails">Other Delivery Details:</label>
                    <textarea
                      id="editDeliveryDetails"
                      name="deliveryDetails"
                      placeholder="Enter Delivery Details"
                      value={editEstimate.deliveryDetails}
                      onChange={handleEditInputChange}
                      className="form-textarea"
                      disabled={loading}
                    ></textarea>
                  </div>
                </div>

                <div className="button-group">
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setShowEditEstimate(false);
                      setEditEstimateId(null);
                      setEditEstimate({
                        groupName: "",
                        brandName: "",
                        zoneName: "",
                        service: "",
                        quantity: "",
                        costPerUnit: "",
                        totalCost: "",
                        deliveryDate: "",
                        deliveryDetails: "",
                      });
                      clearMessages();
                    }}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                  <button
                    className="submit-btn"
                    onClick={handleEditEstimate}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="btn-spinner"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} /> Update Estimate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons for main view */}
          {!showAddEstimate && !showEditEstimate && (
            <div className="action-buttons-container">
              <button
                className="refresh-btn"
                onClick={fetchEstimates}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faSyncAlt} spin={loading} /> Refresh Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageEstimates;