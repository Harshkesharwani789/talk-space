import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import styles from "./SideBar.module.css";

export default function SideBar() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please enter a search term");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_URL}/auth/users?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to load search results");
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_URL}/chat`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
    } catch (error) {
      toast.error("Error fetching the chat");
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Chat App</h2>
        <button onClick={logoutHandler} className={styles.logoutButton}>
          Logout
        </button>
      </div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
      </div>
      {loading ? (
        <div className={styles.loading}>Searching...</div>
      ) : (
        <div className={styles.searchResults}>
          {searchResult.map((user) => (
            <div
              key={user._id}
              className={styles.userItem}
              onClick={() => accessChat(user._id)}
            >
              {user.name}
            </div>
          ))}
        </div>
      )}
      {loadingChat && <div className={styles.loading}>Loading chat...</div>}
    </div>
  );
}