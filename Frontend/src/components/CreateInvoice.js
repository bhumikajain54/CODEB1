/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "./sidebar";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faExclamationCircle,
//   faCheckCircle,
//   faSave,
//   faTimes,
//   faFileInvoice,
//   faAngleLeft,
// } from "@fortawesome/free-solid-svg-icons";

// const CreateInvoice = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const estimateData = location.state || {};

//   // State for invoice form
//   const [invoice, setInvoice] = useState({
//     invoiceNumber: "",
//     estimateId: estimateData.estimateId || "",
//     chainId: estimateData.chainId || "",
//     service: estimateData.service || "",
//     quantity: estimateData.quantity || "",
//     costPerUnit: estimateData.costPerUnit || "",
//     amountPayable: estimateData.amountPayable || "",
//     deliveryDate: estimateData.deliveryDate || "",
//     deliveryDetails: estimateData.deliveryDetails || "",
//     emailId: "",
//     gstData: {
//       gstNumber: estimateData.gstNumber || "",
//       companyName: estimateData.companyName || "",
//       companyAddress: estimateData.companyAddress || "",
//       brandName: estimateData.brandName || "",
//       zoneName: estimateData.zoneName || ""
//     }
//   });

//   // State for UI control
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [fetchFailed, setFetchFailed] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     console.log("Auth token available:", !!token);

//     const generateInvoiceNumber = () => {
//       const today = new Date();
//       const year = today.getFullYear().toString().substr(-2);
//       const month = (today.getMonth() + 1).toString().padStart(2, "0");
//       const day = today.getDate().toString().padStart(2, "0");
//       const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");

//       return `INV-${year}${month}${day}-${random}`;
//     };

//     setInvoice((prev) => ({
//       ...prev,
//       invoiceNumber: generateInvoiceNumber(),
//     }));

//     if (estimateData.chainId) {
//       fetchDirectData(estimateData.chainId, estimateData.estimateId);
//     } else {
//       setInitialLoading(false);
//       setFetchFailed(true);
//     }
//   }, [estimateData.chainId, estimateData.estimateId]);

//   const fetchDirectData = async (chainId, estimateId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const headers = {
//         Authorization: token ? `Bearer ${token}` : "",
//         "Content-Type": "application/json",
//       };

//       if (estimateData.companyName) {
//         setInvoice((prev) => ({
//           ...prev,
//           gstData: {
//             gstNumber: estimateData.gstNumber || "Not Available",
//             companyName: estimateData.companyName || "Not Available",
//             companyAddress: estimateData.companyAddress || "Address not available",
//             brandName: estimateData.brandName || "Not Available",
//             zoneName: estimateData.zoneName || "Not Available",
//           },
//         }));
//         setFetchFailed(false);
//       } else {
//         const response = await axios.get(
//           `http://localhost:8080/api/invoices/estimate-data/${estimateId}`,
//           { headers }
//         );

//         if (response.data) {
//           setInvoice((prev) => ({
//             ...prev,
//             gstData: {
//               gstNumber: response.data.gstNumber || "Not Available",
//               companyName: response.data.companyName || "Not Available",
//               companyAddress: response.data.companyAddress || "Address not available",
//               brandName: response.data.brandName || "Not Available",
//               zoneName: response.data.zoneName || "Not Available",
//             },
//           }));
//           setFetchFailed(false);
//         } else {
//           throw new Error("No data received from estimate data endpoint");
//         }
//       }
//     } catch (err) {
//       console.warn("Couldn't fetch from invoice endpoint, falling back to manual entry:", err);
//       setFetchFailed(true);

//       setInvoice((prev) => ({
//         ...prev,
//         gstData: {
//           gstNumber: "Please enter manually",
//           companyName: "Please enter manually",
//           companyAddress: "Please enter manually",
//           brandName: "Please enter manually",
//           zoneName: "Please enter manually",
//         },
//       }));
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "emailId") {
//       setInvoice({
//         ...invoice,
//         [name]: value,
//       });
//     }
//   };

//   // Create Invoice and generate PDF
//   const handleCreateInvoice = async () => {
//     if (!validateEmail(invoice.emailId)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");

//       const response = await axios.post(
//         "http://localhost:8080/api/invoices/generate", 
//         {
//           invoiceNumber: invoice.invoiceNumber,
//           estimateId: invoice.estimateId,
//           chainId: invoice.chainId,
//           service: invoice.service,
//           quantity: invoice.quantity,
//           costPerUnit: invoice.costPerUnit,
//           amountPayable: invoice.amountPayable,
//           emailId: invoice.emailId,
//           gstNumber: invoice.gstData.gstNumber,
//           companyName: invoice.gstData.companyName,
//           brandName: invoice.gstData.brandName,
//           zoneName: invoice.gstData.zoneName,
//           amountPaid: 0
//         },
//         {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : "",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setSuccess("Invoice created successfully!");

//       try {
//         const pdfResponse = await axios.get(
//           `http://localhost:8080/api/invoices/${response.data.invoiceId}/pdf`, 
//           { 
//             responseType: "blob",
//             headers: {
//               Authorization: token ? `Bearer ${token}` : "",
//             } 
//           }
//         );

//         const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
//         setPdfUrl(url);
//       } catch (pdfErr) {
//         console.error("Error getting PDF:", pdfErr);
//         setError("Invoice created but PDF generation failed.");
//       }
//     } catch (err) {
//       console.error("Error creating invoice:", err);
//       setError(err.response?.data?.error || "Failed to create invoice.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Download the generated PDF
//   const handleDownloadPdf = () => {
//     if (!pdfUrl) return;

//     const link = document.createElement("a");
//     link.href = pdfUrl;
//     link.setAttribute("download", `Invoice-${invoice.invoiceNumber}.pdf`);
//     document.body.appendChild(link);
//     link.click();

//     link.parentNode.removeChild(link);
//   };

//   // Navigate back to estimates
//   const handleGoBack = () => {
//     navigate('/dashboard/estimate-management');
//   };

//   // Validate email format
//   const validateEmail = (email) => {
//     if (!email || email.trim() === "") return false;

//     const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     if (!amount) return "₹0.00";

//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 2,
//     }).format(amount);
//   };

//   if (initialLoading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner large"></div>
//         <p>Loading estimate details...</p>
//       </div>
//     );
//   }

//   if (!estimateData.estimateId) {
//     return (
//       <div className="error-container">
//         <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
//         <h2>Missing Estimate Data</h2>
//         <p>No estimate data was provided. Please select an estimate first.</p>
//         <button className="back-btn" onClick={handleGoBack}>
//           <FontAwesomeIcon icon={faAngleLeft} /> Back to Estimates
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       <div className="main-content">
//         <Sidebar activePage="Create Invoice" />
//         <div className="content-area">
//           <div className="page-header">
//             <h1>Create Invoice</h1>
//             <p>Generate an invoice based on the selected estimate</p>
//           </div>

//           {/* Messages */}
//           {error && (
//             <div className="alert alert-danger">
//               <FontAwesomeIcon icon={faExclamationCircle} className="alert-icon" />
//               {error}
//               <button className="close-btn" onClick={() => setError(null)}>×</button>
//             </div>
//           )}
          
//           {success && (
//             <div className="alert alert-success">
//               <FontAwesomeIcon icon={faCheckCircle} className="alert-icon" />
//               <span className="alert-message">{success}</span>
//               <button className="close-btn" onClick={() => setSuccess(null)}>×</button>
//             </div>
//           )}

//           {/* Invoice PDF Preview */}
//           {pdfUrl && (
//             <div className="pdf-preview-container">
//               <h3>Invoice Preview</h3>
//               <div className="pdf-frame-container">
//                 <iframe 
//                   src={pdfUrl} 
//                   className="pdf-preview-frame" 
//                   title="Invoice Preview"
//                 ></iframe>
//               </div>
//               <div className="pdf-actions">
//                 <button className="download-btn" onClick={handleDownloadPdf}>
//                   <FontAwesomeIcon icon={faFileInvoice} /> Download Invoice PDF
//                 </button>
//                 <button className="back-btn" onClick={handleGoBack}>
//                   <FontAwesomeIcon icon={faAngleLeft} /> Back to Estimates
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Invoice Form */}
//           {!pdfUrl && (
//             <div className="invoice-form">
//               <div className="form-container">
//                 <div className="form-section">
//                   <h3>Invoice Details</h3>
                  
//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>Invoice Number:</label>
//                       <input
//                         type="text"
//                         value={invoice.invoiceNumber}
//                         className="form-input"
//                         disabled={true}
//                       />
//                       <small className="form-text">Auto-generated unique invoice number</small>
//                     </div>
                    
//                     <div className="form-group">
//                       <label>Estimate ID:</label>
//                       <input
//                         type="text"
//                         value={invoice.estimateId}
//                         className="form-input"
//                         disabled={true}
//                       />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="form-section">
//                   <h3>Client Information</h3>
                  
//                   {fetchFailed && (
//                     <div className="alert alert-warning">
//                       <FontAwesomeIcon icon={faExclamationCircle} className="alert-icon" />
//                       <span>Could not automatically fetch company details. Please enter them manually.</span>
//                     </div>
//                   )}
                  
//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>Company Name:</label>
//                       <input
//                         type="text"
//                         value={invoice.gstData.companyName}
//                         className="form-input"
//                         disabled={true}
//                       />
//                     </div>
                    
//                     <div className="form-group">
//                       <label>GST Number:</label>
//                       <input
//                         type="text"
//                         value={invoice.gstData.gstNumber}
//                         className="form-input"
//                         disabled={true}
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>Brand Name:</label>
//                       <input
//                         type="text"
//                         value={invoice.gstData.brandName}
//                         className="form-input"
//                         disabled={true}
//                       />
//                     </div>
                    
//                     <div className="form-group">
//                       <label>Zone Name:</label>
//                       <input
//                         type="text"
//                         value={invoice.gstData.zoneName}
//                         className="form-input"
//                         disabled={true}
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="form-row">
//                     <div className="form-group full-width">
//                       <label>Email Address:</label>
//                       <input
//                         type="email"
//                         name="emailId"
//                         placeholder="Enter Email Address"
//                         value={invoice.emailId}
//                         onChange={handleInputChange}
//                         className="form-input"
//                         required
//                       />
//                       <small className="form-text">This email will receive the invoice</small>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="form-section">
//                   <h3>Invoice Service Details</h3>
                  
//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>Service:</label>
//                       <input
//                         type="text"
//                         value={invoice.service}
//                         className="form-input"
//                         disabled={true}
//                       />
//                     </div>
                    
//                     <div className="form-group">
//                       <label>Quantity:</label>
//                       <input
//                         type="text"
//                         value={invoice.quantity}
//                         className="form-input"
//                         disabled={true}
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>Cost Per Unit:</label>
//                       <input
//                         type="text"
//                         value={formatCurrency(invoice.costPerUnit)}
//                         className="form-input"
//                         disabled={true}
//                       />
//                     </div>
                    
//                     <div className="form-group">
//                       <label>Amount Payable:</label>
//                       <input
//                         type="text"
//                         value={formatCurrency(invoice.amountPayable)}
//                         className="form-input"
//                         disabled={true}
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>Delivery Date:</label>
//                       <input
//                         type="text"
//                         value={invoice.deliveryDate || "Not specified"}
//                         className="form-input"
//                         disabled={true}
//                       />
//                     </div>
                    
//                     <div className="form-group">
//                       <label>Delivery Details:</label>
//                       <input
//                         type="text"
//                         value={invoice.deliveryDetails || "Not specified"}
//                         className="form-input"
//                         disabled={true}
//                       />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="form-actions">
//                   <button 
//                     className="cancel-btn"
//                     onClick={handleGoBack}
//                     disabled={loading}
//                   >
//                     <FontAwesomeIcon icon={faTimes} /> Cancel
//                   </button>
                  
//                   <button 
//                     className="submit-btn"
//                     onClick={handleCreateInvoice}
//                     disabled={loading || !invoice.emailId}
//                   >
//                     {loading ? (
//                       <>
//                         <div className="btn-spinner"></div>
//                         Processing...
//                       </>
//                     ) : (
//                       <>
//                         <FontAwesomeIcon icon={faSave} /> Generate Invoice
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateInvoice;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faCheckCircle,
  faSave,
  faTimes,
  faFileInvoice,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";

const CreateInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const estimateData = location.state || {};

  // State for invoice form
  const [invoice, setInvoice] = useState({
    invoiceNumber: "",
    estimateId: estimateData.estimateId || "",
    chainId: estimateData.chainId || "",
    service: estimateData.service || "",
    quantity: estimateData.quantity || "",
    costPerUnit: estimateData.costPerUnit || "",
    amountPayable: estimateData.amountPayable || "",
    amountPaid: estimateData.amountPayable || "", // Initialize with full amount
    balance: "0", // Initialize with zero
    deliveryDate: estimateData.deliveryDate || "",
    deliveryDetails: estimateData.deliveryDetails || "",
    emailId: "",
  });

  // State for UI control
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [invoiceCreated, setInvoiceCreated] = useState(false);
  const [createdInvoiceId, setCreatedInvoiceId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    const generateInvoiceNumber = () => {
      const today = new Date();
      const year = today.getFullYear().toString().substr(-2);
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");

      return `${random}`;
    };

    setInvoice((prev) => ({
      ...prev,
      invoiceNumber: generateInvoiceNumber(),
    }));

    setInitialLoading(false);
  }, []);

  // Clear success message after timeout
  useEffect(() => {
    let successTimer;
    if (success) {
      setShowSuccessMessage(true);
      // Set a 12 second timer before hiding the success message
      successTimer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 12000); // 12 seconds
    }
    
    // Clean up timer when component unmounts or success changes
    return () => {
      if (successTimer) clearTimeout(successTimer);
    };
  }, [success]);

  const fetchInvoicePdf = async (invoiceId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/invoice/${invoiceId}/pdf`, {
            responseType: 'blob', // Ensures response is treated as a binary blob
        });

        // Create a Blob URL for preview
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl);
    } catch (error) {
        console.error("Error fetching PDF:", error);
    }
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "emailId") {
      setInvoice({
        ...invoice,
        [name]: value,
      });
    } else if (name === "amountPaid") {
      const amountPaid = parseFloat(value) || 0;
      const amountPayable = parseFloat(invoice.amountPayable) || 0;
      const balance = Math.max(0, amountPayable - amountPaid).toFixed(2);
      
      setInvoice({
        ...invoice,
        amountPaid: value,
        balance: balance
      });
    }
  };

  // Try to fetch PDF again
  const handleRetryPdf = async () => {
    if (!createdInvoiceId || isNaN(createdInvoiceId)) {
      setPdfError("Cannot retry: Invalid invoice ID");
      return;
    }
    
    try {
      setLoading(true);
      setPdfError(null);
      
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/invoices/${createdInvoiceId}/pdf`, 
        { 
          responseType: "blob",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          } 
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setPdfUrl(url);
    } catch (pdfErr) {
      setPdfError("PDF generation failed. Please try again or contact support.");
    } finally {
      setLoading(false);
    }
  };

  // Create Invoice and generate PDF
  const handleCreateInvoice = async () => {
    if (!validateEmail(invoice.emailId)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setPdfError(null);
      setShowSuccessMessage(false);
  
      const token = localStorage.getItem("token");
  
      // Create a simplified request object matching what the backend expects
      const requestData = {
        estimateId: invoice.estimateId,
        emailId: invoice.emailId,
        amountPaid: parseFloat(invoice.amountPaid) || 0
      };
  
      const response = await axios.post(
        "http://localhost:8080/api/invoices/generate", 
        requestData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      
      // Try multiple possible field names for the ID
      const invoiceId = response.data?.id || response.data?.invoiceId || response.data?.invoice_id;
      
      if (invoiceId && !isNaN(invoiceId)) {
        setCreatedInvoiceId(invoiceId);
        setInvoiceCreated(true);
        setSuccess("Invoice created successfully!");
  
        // Slight delay before attempting to fetch PDF to allow success message to display
        setTimeout(async () => {
          try {
            const response = await axios.get(
              `http://localhost:8080/api/invoices/${invoiceId}/pdf`, 
              { 
                responseType: "blob",
                headers: {
                  Authorization: token ? `Bearer ${token}` : "",
                } 
              }
            );
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            setPdfUrl(url);
          } catch (pdfErr) {
            setPdfError("Invoice created but PDF generation failed. You can try again or proceed without it.");
          }
        }, 3000); // Wait 3 seconds before fetching PDF to ensure success message is visible
      } else {
        setInvoiceCreated(true);
        setSuccess("Invoice created successfully!");
        setPdfError("Invoice created but cannot generate PDF - invalid invoice ID received.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create invoice.");
      setInvoiceCreated(false);
    } finally {
      setLoading(false);
    }
  };

  // Download the generated PDF
  const handleDownloadPdf = () => {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", `Invoice-${invoice.invoiceNumber}.pdf`);
    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
  };

  // Navigate back to estimates
  const handleGoBack = () => {
    navigate('/dashboard/estimate');
  };

  const handleInvoice = () => {
    navigate('/invoice');
  };

  // Validate email format
  const validateEmail = (email) => {
    if (!email || email.trim() === "") return false;

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (initialLoading) {
    return (
      <div className="dashboard-container">
        <Sidebar activePage="Manage Estimate" />
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner large"></div>
            <p>Loading estimate details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!estimateData.estimateId) {
    return (
      <div className="dashboard-container">
        <Sidebar activePage="Manage Estimate" />
        <div className="main-content">
          <div className="error-container">
            <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
            <h2>Missing Estimate Data</h2>
            <p>No estimate data was provided. Please select an estimate first.</p>
            <button className="back-btn" onClick={handleGoBack}>
              <FontAwesomeIcon icon={faAngleLeft} /> Back to Estimates
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar activePage="Manage Estimate" />
      <div className="main-content">
        <div className="invoice-section">
          <div className="page-header">
            <h1>Create Invoice</h1>
          </div>

          {/* Messages */}
          {error && (
            <div className="alert alert-danger">
              <FontAwesomeIcon icon={faExclamationCircle} className="alert-icon" />
              {error}
              <button className="close-btn" onClick={() => setError(null)}>×</button>
            </div>
          )}
          
          {showSuccessMessage && success && !pdfUrl && (
            <div className="alert alert-success">
              <FontAwesomeIcon icon={faCheckCircle} className="alert-icon" />
              <span className="alert-message">{success}</span>
              <button className="close-btn" onClick={() => setShowSuccessMessage(false)}>×</button>
            </div>
          )}
          
          {pdfError && (
            <div className="alert alert-warning">
              <FontAwesomeIcon icon={faExclamationCircle} className="alert-icon" />
              {pdfError}
              <button className="close-btn" onClick={() => setPdfError(null)}>×</button>
              {createdInvoiceId && (
                <button className="retry-btn" onClick={handleRetryPdf} disabled={loading}>
                  {loading ? 'Retrying...' : 'Retry PDF Generation'}
                </button>
              )}
            </div>
          )}

          {/* Invoice PDF Preview */}
          {pdfUrl && (
            <div className="pdf-preview-container">
              <h3>Invoice Generated Successfully and Email has been Sent !!</h3>
              <div className="pdf-actions">
                <button className="download-btn" onClick={handleDownloadPdf}>
                  <FontAwesomeIcon icon={faFileInvoice} /> Download Invoice PDF
                </button>
                <button className="back-btn" onClick={handleGoBack}>
                  <FontAwesomeIcon icon={faAngleLeft} /> Back to Estimates
                </button>
                <button className="back-btn" onClick={handleInvoice}>
                  <FontAwesomeIcon icon={faAngleLeft} /> Invoice Management
                </button>
              </div>
            </div>
          )}

          {/* Invoice Created but No PDF */}
          {invoiceCreated && !pdfUrl && (
            <div className="invoice-created-container">
              <div className="success-message">
                <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                <h3>Invoice Created Successfully</h3>
                <p>The invoice has been saved to the system and will be accessible via the dashboard.</p>
              </div>
              <div className="action-buttons">
                {/* <button className="retry-btn" onClick={handleRetryPdf} disabled={loading}>
                  {loading ? 'Retrying...' : 'Retry PDF Generation'}
                </button> */}
                <button className="back-btn" onClick={handleGoBack}>
                  <FontAwesomeIcon icon={faAngleLeft} /> Back to Estimates
                </button>
              </div>
            </div>
          )}

          {/* Simple Invoice Form - Based on the image */}
          {!invoiceCreated && (
            <div className="invoice-form-simple">
              <div className="form-row">
                <div className="form-group">
                  <label>Invoice No:</label>
                  <input
                    type="text"
                    value={invoice.invoiceNumber}
                    className="form-input"
                    disabled={true}
                  />
                </div>
                
                <div className="form-group">
                  <label>Estimate ID:</label>
                  <input
                    type="text"
                    value={invoice.estimateId}
                    className="form-input"
                    disabled={true}
                  />
                </div>
                
                <div className="form-group">
                  <label>Chain ID:</label>
                  <input
                    type="text"
                    value={invoice.chainId}
                    className="form-input"
                    disabled={true}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Service Provided:</label>
                  <input
                    type="text"
                    value={invoice.service}
                    className="form-input"
                    disabled={true}
                  />
                </div>
                
                <div className="form-group">
                  <label>Quantity:</label>
                  <input
                    type="text"
                    value={invoice.quantity}
                    className="form-input"
                    disabled={true}
                  />
                </div>
                
                <div className="form-group">
                  <label>Cost per Quantity:</label>
                  <input
                    type="text"
                    value={invoice.costPerUnit}
                    className="form-input"
                    disabled={true}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Amount Payable in Rs:</label>
                  <input
                    type="text"
                    value={invoice.amountPayable}
                    className="form-input"
                    disabled={true}
                  />
                </div>
                
                <div className="form-group">
                  <label>Amount Paid in Rs:</label>
                  <input
                    type="number"
                    name="amountPaid"
                    value={invoice.amountPaid}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Balance in Rs:</label>
                  <input
                    type="text"
                    value={invoice.balance}
                    className="form-input"
                    disabled={true}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Delivery Date:</label>
                  <input
                    type="text"
                    value={invoice.deliveryDate}
                    className="form-input"
                    disabled={true}
                  />
                </div>
                
                <div className="form-group">
                  <label>Other Delivery Details:</label>
                  <textarea
                    value={invoice.deliveryDetails}
                    className="form-textarea"
                    disabled={true}
                    rows={3}
                  />
                </div>
                
                <div className="form-group">
                  <label>Enter Email ID:</label>
                  <input
                    type="email"
                    name="emailId"
                    value={invoice.emailId}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Email address"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  className="generate-invoice-btn"
                  onClick={handleCreateInvoice}
                  disabled={loading || !invoice.emailId}
                >
                  {loading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Generate Invoice
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;