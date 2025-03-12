// import React, { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const Navbar = () => {
//   const { currentUser, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//     setMenuOpen(false);
//   };

//   // Function to check if user has admin role
//   const isAdmin = () => {
//     if (!currentUser || !currentUser.role) return false;
//     return currentUser.role.includes("ADMIN");
//   };

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <Link to="/home" className="navbar-logo">
//           AuthDemo
//         </Link>
        
//         <div className="mobile-menu-button" onClick={toggleMenu}>
//           <div className={`menu-icon ${menuOpen ? 'open' : ''}`}>
//             <span></span>
//             <span></span>
//             <span></span>
//           </div>
//         </div>
        
//         <div className={`navbar-links ${menuOpen ? 'show' : ''}`}>
//           {currentUser ? (
//             <>
//               <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
//                 Dashboard
//               </Link>
//               {isAdmin() && (
//                 <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>
//                   Admin
//                 </Link>
//               )}
//               <button
//                 onClick={handleLogout}
//                 className="nav-link logout-button"
//               >
//                 Logout
//               </button>
//               <div className="user-profile">
//                 <div className="avatar-placeholder">
//                   {currentUser.email && currentUser.email.charAt(0).toUpperCase()}
//                 </div>
//               </div>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
//                 Login
//               </Link>
//               <Link to="/register" className="nav-link nav-button" onClick={() => setMenuOpen(false)}>
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  // Function to check if user has admin role
  const isAdmin = () => {
    if (!currentUser || !currentUser.role) return false;
    return currentUser.role.includes("ADMIN");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          AuthDemo
        </Link>
        
        <div className="mobile-menu-button" onClick={toggleMenu}>
          <div className={`menu-icon ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        <div className={`navbar-links ${menuOpen ? 'show' : ''}`}>
          {currentUser ? (
            <>
              {!isAdmin() && (
                <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
              {isAdmin() && (
                <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="nav-link logout-button"
              >
                Logout
              </button>
              <div className="user-profile">
                <div className="avatar-placeholder">
                  {currentUser.email && currentUser.email.charAt(0).toUpperCase()}
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-link nav-button" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;