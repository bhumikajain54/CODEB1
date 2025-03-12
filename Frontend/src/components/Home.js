import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 fade-in">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome to Auth Demo
      </h1>
      <p className="text-lg mb-6 text-center">
        This is a demo application showcasing authentication with Spring Boot
        and React.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">For Users</h3>
          <p className="mb-4">Create an account or sign in to access your personal dashboard with secure authentication.</p>
          <div className="flex justify-center mt-6">
            <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md mr-4">
              Register
            </Link>
            <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md">
              Login
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">For Admins</h3>
          <p className="mb-4">Administrative users have access to user management and additional features.</p>
          <ul className="mb-4 list-disc ml-5">
            <li>User management</li>
            <li>Role-based permissions</li>
            <li>System monitoring</li>
          </ul>
          <div className="flex justify-center mt-6">
          <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 rounded-md mr-4">
              Admin Register
            </Link>
            <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;