// export const API_URL = "http://localhost:8080/api";

// export const register = async (userData) => {
//   const response = await fetch(`${API_URL}/auth/register`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(userData),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || "Registration failed");
//   }

//   return response.json();
// };

// export const verifyEmail = async (token) => {
//   const response = await fetch(`${API_URL}/auth/verify?token=${token}`, {
//     method: "GET",
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || "Email verification failed");
//   }

//   return response.json();
// };

// export const login = async (credentials) => {
//   const response = await fetch(`${API_URL}/auth/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(credentials),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || "Login failed");
//   }

//   const data = await response.json();
//   if (data.token) {
//     localStorage.setItem("token", data.token);
//     localStorage.setItem("userRole", data.role);
//     localStorage.setItem("userEmail", data.email);
//   }

//   return data;
// };

// export const forgotPassword = async (email) => {
//   const response = await fetch(`${API_URL}/auth/forgot-password`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || "Failed to send reset email");
//   }

//   return response.json();
// };

// export const resetPassword = async (token, newPassword) => {
//   const response = await fetch(`${API_URL}/auth/reset-password`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ token, newPassword }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || "Failed to reset password");
//   }

//   return response.json();
// };

// export const logout = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("userRole");
//   localStorage.removeItem("userEmail");
// };

// export const getCurrentUser = () => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     return {
//       token,
//       role: localStorage.getItem("userRole") || "",
//       email: localStorage.getItem("userEmail") || "",
//     };
//   }
//   return null;
// };

// export const authHeader = () => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     return { Authorization: `Bearer ${token}` };
//   }
//   return {};
// };

export const register = async (userData) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Registration failed");
  }

  return response.json();
};

export const verifyEmail = async (token) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/verify?token=${token}`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Email verification failed");
  }

  return response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Login failed");
  }

  const data = await response.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("userEmail", data.email);
  }

  return data;
};

export const forgotPassword = async (email) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to send reset email");
  }

  return response.json();
};

export const validateResetToken = async (token) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/validate-reset-token?token=${token}`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Invalid or expired token");
  }

  return response.json();
};

export const resetPassword = async (token, newPassword) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to reset password");
  }

  return response.json();
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return {
      token,
      role: localStorage.getItem("userRole") || "",
      email: localStorage.getItem("userEmail") || "",
    };
  }
  return null;
};

export const authHeader = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};