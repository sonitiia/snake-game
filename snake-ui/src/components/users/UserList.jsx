import React, { useEffect, useState } from "react";
import User from "./User";
import "../users/UserList.css";
import userService from "../../services/UserService";

export const UserList = ({ gameOver }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await userService.getUsers();
        setUsers(response);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };

    loadUsers();
    if (gameOver) loadUsers();
    
    }, [gameOver]);

  return (
    <div className="user-list-wrapper">
      <div className="user-list-box">
        <h1>Record holders list</h1>
        {users.map((user) => (
          <User key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};
