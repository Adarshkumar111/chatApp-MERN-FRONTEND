import React, { useEffect, useState, useContext } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
  const { axios, onlineUsers, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/messages/users");
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [axios]);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full rounded-r-xl  overflow-y-scroll text-white ${
        selectedUser ? "hidden md:block" : ""
      } `}
    >
      {/* top section */}
      <div className="p-5">
        {/*  logo and menu icon */}
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border-gray-600 text-gray-100 hidden group-hover:block ">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={logout} className="cursor-pointer text-sm">LogOut</p>
            </div>
          </div>
        </div>

        {/* search box */}

        <div className="bg-[#282142] rounded-full  flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder:[#c8c8c8] flex-1"
            placeholder="search user..."
          />
        </div>
      </div>

      {/* middle section */}
      {/* all user profile */}

      <div className="flex flex-col">
        {users.map((user, index)=>(
          <div onClick={()=>{setSelectedUser(user)}}
           key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id ===user._id && 'bg-[#282142]/50'} `}>
            <img src={user?.profilePic || assets.avatar_icon} alt="" className="w-[35px] aspect-[1/1]  rounded-full object-cover" />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {
                onlineUsers.includes(user._id) 
                ? <span className="text-green-400 text-xs">Online</span> 
                : <span className="text-neutral-400 text-xs">Offline</span>
              }
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Sidebar;

