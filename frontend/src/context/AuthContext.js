
// import React, { createContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState();
//   const [chats, setChats] = useState();
//   const [selectedChat, setSelectedChat] = useState();
 

//   useEffect(() => {
//     const loggedInUser = JSON.parse(localStorage.getItem("user"));
//     setUser(loggedInUser);
//   }, []);

//   return (
    
//       {children}
    
//   );
// };

// export { AuthContext, AuthProvider };


// src/context/context.js

import React, { createContext, useState, useEffect } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [notification, setNotification] = useState([]);

  // Check localStorage for user info on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

    