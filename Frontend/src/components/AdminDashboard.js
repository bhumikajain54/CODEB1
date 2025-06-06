import React, { useState, useEffect } from "react";
import { authHeader } from "../services/authService";
import  "../AdminDashboard.css";
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/users`, {
          headers: {
            ...authHeader(),
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p className="dashboard-subtitle">Manage your users and their permissions</p>
      </div>
      
      {error && (
        <div className="alert alert-warning">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">{error}</div>
        </div>
      )}
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Verified</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <span className="role-badge">
                    {user.role?.replace("ROLE_", "")}
                  </span>
                </td>
                <td>{user.status}</td>
                <td>
                  <span className={`status-badge ${user.enabled ? "verified" : "pending"}`}>
                    {user.enabled ? "Verified" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

// import React, { useState, useEffect } from "react";
// import { authHeader, API_URL } from "../services/authService";

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     activeUsers: 0,
//     pendingUsers: 0,
//     adminUsers: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentFilter, setCurrentFilter] = useState("all");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/users`, {
//           headers: {
//             ...authHeader(),
//             "Content-Type": "application/json",
//           },
//         });
        
//         if (!response.ok) {
//           throw new Error("Failed to fetch users");
//         }
        
//         const data = await response.json();
//         setUsers(data);
        
//         // Calculate stats
//         setStats({
//           totalUsers: data.length,
//           activeUsers: data.filter(user => user.status === "ACTIVE").length,
//           pendingUsers: data.filter(user => !user.enabled).length,
//           adminUsers: data.filter(user => user.role?.includes("ADMIN")).length
//         });
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchUsers();
//   }, []);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleFilterChange = (filter) => {
//     setCurrentFilter(filter);
//   };

//   const filteredUsers = users.filter(user => {
//     const matchesSearch = 
//       user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.id?.toString().includes(searchTerm);
    
//     if (!matchesSearch) return false;
    
//     switch (currentFilter) {
//       case "active":
//         return user.status === "ACTIVE";
//       case "pending":
//         return !user.enabled;
//       case "admin":
//         return user.role?.includes("ADMIN");
//       default:
//         return true;
//     }
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
//         <p className="text-gray-600">Manage your organization's users and permissions</p>
//       </div>
      
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-500 text-sm">Total Users</p>
//               <h3 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h3>
//             </div>
//             <div className="p-3 bg-blue-100 rounded-full">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-500 text-sm">Active Users</p>
//               <h3 className="text-3xl font-bold text-green-600">{stats.activeUsers}</h3>
//             </div>
//             <div className="p-3 bg-green-100 rounded-full">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-500 text-sm">Pending Verification</p>
//               <h3 className="text-3xl font-bold text-yellow-600">{stats.pendingUsers}</h3>
//             </div>
//             <div className="p-3 bg-yellow-100 rounded-full">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-500 text-sm">Admin Users</p>
//               <h3 className="text-3xl font-bold text-purple-600">{stats.adminUsers}</h3>
//             </div>
//             <div className="p-3 bg-purple-100 rounded-full">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Error Alert */}
//       {error && (
//         <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <span>{error}</span>
//         </div>
//       )}
      
//       {/* Search and Filter Controls */}
//       <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
//         <div className="flex-1 w-full">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search users by name, email or ID..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//             <div className="absolute left-3 top-2.5">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex space-x-2 w-full md:w-auto">
//           <button 
//             className={`px-4 py-2 rounded-lg ${currentFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
//             onClick={() => handleFilterChange('all')}
//           >
//             All
//           </button>
//           <button 
//             className={`px-4 py-2 rounded-lg ${currentFilter === 'active' ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
//             onClick={() => handleFilterChange('active')}
//           >
//             Active
//           </button>
//           <button 
//             className={`px-4 py-2 rounded-lg ${currentFilter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
//             onClick={() => handleFilterChange('pending')}
//           >
//             Pending
//           </button>
//           <button 
//             className={`px-4 py-2 rounded-lg ${currentFilter === 'admin' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
//             onClick={() => handleFilterChange('admin')}
//           >
//             Admin
//           </button>
//         </div>
//       </div>
      
//       {/* Users Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredUsers.length > 0 ? (
//                 filteredUsers.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.fullName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         user.role?.includes("ADMIN") 
//                           ? "bg-purple-100 text-purple-800" 
//                           : user.role?.includes("MANAGER") 
//                             ? "bg-blue-100 text-blue-800" 
//                             : "bg-green-100 text-green-800"
//                       }`}>
//                         {user.role?.replace("ROLE_", "")}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         user.status === "ACTIVE" 
//                           ? "bg-green-100 text-green-800" 
//                           : user.status === "SUSPENDED" 
//                             ? "bg-red-100 text-red-800" 
//                             : "bg-yellow-100 text-yellow-800"
//                       }`}>
//                         {user.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {user.enabled ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                           Verified
//                         </span>
//                       ) : (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                           Pending
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-2">
//                         <button className="text-blue-600 hover:text-blue-900">
//                           Edit
//                         </button>
//                         <button className={`${user.enabled ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}`}>
//                           {user.enabled ? "Suspend" : "Activate"}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
//                     No users found matching your search criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
      
//       {/* Pagination - Basic example */}
//       <div className="mt-6 flex justify-between items-center">
//         <div className="text-sm text-gray-700">
//           Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
//           <span className="font-medium">{users.length}</span> users
//         </div>
//         <div className="flex space-x-2">
//           <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
//             Previous
//           </button>
//           <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;