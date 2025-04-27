import { LuSearch } from "react-icons/lu";
import { IoArrowBackSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userConversation from '../../Zustands/useConversation.js';
import { useSocketContext } from "../../context/SocketContext.jsx";


const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchuser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageUsers,setNewMessagesUsers]=useState('');
  const {messages , setMessage, selectedConversation ,  setSelectedConversation} = userConversation();
  const {onlineUser,socket}=useSocketContext();

  const nowOnline=chatUser.map((user)=>(user._id));
const isOnline= nowOnline.map(userId=> onlineUser.includes(userId));

useEffect(()=>{
    socket?.on("newMessage",(newMessage)=>{
      setNewMessagesUsers(newMessage);
    })
    return ()=> socket?.off("newMessage");
  },[socket,setMessage,messages])

  //show user with chatter
  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chatters = await axios.get(`/api/user/currentchatters`);
        const data = chatters.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setChatUser(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    chatUserHandler();
  }, []);
 
//show user from the search
  const handelSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      setLoading(false);
      if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchuser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //show which user is selected
  const handelUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessagesUsers('');
  };

  //back from search result
  const handSearchback = () => {
    setSearchuser([]);
    setSearchInput("");
  };

  //Logout
  const handelLogOut=async()=>{
    const confirmlogout=window.prompt("type 'Username' To Logout");
    if(confirmlogout===authUser.username){
      setLoading(true);
      try{
        const logout= await axios.post('/api/auth/logout');
        const data=logout.data;
        if(data.success===false){
           setLoading(false);
           console.log(data.message);
        }
        toast.info(data.message);
        localStorage.removeItem('chat-app');
        setAuthUser([]);
        setLoading(false);
        navigate('/login');
      }catch(error){
        setLoading(false);
        console.log(error);
      }
    }else{
      toast.info("Logout Cancelled");
    }
    
  }
  console.log(searchUser);
  return (
    <div className=" h-full w-auto px-1">
      <div className="flex justify-between gap-2">
        <form
          onSubmit={handelSearchSubmit}
          className="flex w-auto  item-center   justify-between bg-white text-gray-950 rounded-full"
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="search user"
            className="px-4 w-auto  bg-transparent outline-none rounded-full"
          />
          <button className="btn btn-circle   rounded-full bg-sky-700 hover:bg-gray-400">
            <LuSearch className="m-3" />
          </button>
        </form>
        <img
          onClick={() => navigate(`/profile/${authUser?._id}`)}
          src={authUser?.profilepic}
          className=" self-center h-10 w-10 hover:scale-110 cursor-pointer"
        />
      </div>
      <div className="divider divide-solid  my-2 px-3 h-[1px]"></div>
      {searchUser?.length > 0 ? (
        <>
          <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
            <div className="w-auto">
              {searchUser.map((user, index) => (
                <div key={user._id}>
                  <div
                    onClick={() => handelUserClick(user)}
                    className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer
                              ${
                                selectedUserId === user?._id ? "bg-sky-500" : ""
                              }`}
                  >
                    {/*Socket is Online*/}
                    <div className={`avatar ${isOnline[index] ? 'online':''}`}>
                      <div className="w-12 rounded-full">
                        <img src={user.profilepic} alt="user.img" />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1">
                      <p className="font-bold text-gray-950">{user.username}</p>
                    </div>
                  </div>
                  <div className="divider divide-solid  px-3 "></div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto px-1 py-1 flex">
            <button
              onClick={handSearchback}
              className="bg-white text-gray-950 rounded-full px-2 py-1 self-center"
            >
              <IoArrowBackSharp size={25} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[70%] max-h-[80%] m overscroll-y-auto scrollbar">
            <div className="w-auto">
              {chatUser.length === 0 ? (
                <>
                  <div className="font-bold items-center flex flex-col text-xl text-yellow-500">
                    <h1>Why are you Alone!!🤔</h1>
                    <h1>Search username to chat</h1>
                  </div>
                </>
              ) : (
                <>
                  {chatUser.map((user, index) => (
                    <div key={user._id}>
                      <div
                        onClick={() => handelUserClick(user)}
                        className={`flex   gap-3 
                    items-center rounded 
                    p-2 py-1 cursor-pointer 
                    ${selectedUserId === user?._id ? "bg-sky-500" : ""} `}
                      >
                        <div className={`avatar ${isOnline[index] ? 'online':''}`}  >
                          <div className="w-12 rounded-full">
                            <img src={user.profilepic} alt="user.img" />
                          </div>
                        </div>
                        <div className="flex  flex-col flex-1">
                          <p className="font-bold text-gray-950">
                            {user.username}
                          </p>
                        </div>
                        <div >
                          { newMessageUsers.reciverId === authUser._id && newMessageUsers.senderId ===user._id ?
                          <div className='rounded-full bg-green-700 text-white px-[4px]'>+1</div>:<></>
                        }
                        </div>
                      </div>
                      <div className="divider divide-solid  px-3 h-[1px]"></div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="mt-20 px-1 py-1 flex">
            <button
              onClick={handelLogOut}
              className="hover:bg-red-600  w-10 cursor-pointer hover:text-white rounded-lg"
            >
              <BiLogOut size={25} />
            </button>
            <p className="text-sm py-1">Logout</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
