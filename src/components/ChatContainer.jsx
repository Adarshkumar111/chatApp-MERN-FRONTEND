import React, { useEffect, useRef, useState, useContext } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = ({selectedUser, setSelectedUser}) => {

  const scrollEnd=useRef()
  const { authUser, axios, socket, onlineUsers } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  useEffect(()=>{
    if(scrollEnd.current){
      scrollEnd.current.scrollIntoView({behavior:'smooth'})
    }
  },[messages])

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const { data } = await axios.get(`/api/messages/${selectedUser._id}`);
          if (data.success) {
            setMessages(data.messages);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchMessages();
    }
  }, [selectedUser, axios]);

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      // Check if message belongs to current chat
      if (newMessage.senderId === selectedUser?._id || newMessage.receiverId === selectedUser?._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => socket.off("newMessage");
  }, [socket, selectedUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!text.trim() && !image) return;
    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, { text, image });
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
        setText("");
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>

      {/* Header */}

     <div className='flex items-center gap-3 py-3 mx-4 border-stone-500 '>
      <img src={selectedUser.profilePic || assets.avatar_icon} alt=""  className='w-8 rounded-full object-cover aspect-square'/>
      <p className='flex-1 text-lg text-white flex items-center gap-2'> 
        {selectedUser.fullName}
        {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'> </span>}
      </p>
      <img onClick={()=>  setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7 cursor-pointer' />

      <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5 ' />

     </div>

      {/* ⁡⁢⁣⁢Chat Body⁡ */}

      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg, index)=>(
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser?._id && 'flex-row-reverse'}`}>
            <div className={`flex flex-col ${msg.senderId !== authUser?._id ? 'items-start' : 'items-end'}`}>
              {msg.image && (
                <img src={msg.image} alt="" className='max-w-[200px] rounded-lg mb-1' />
              )}
              {msg.text && (
                <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser?._id ?'rounded-br-none' :'rounded-bl-none' }`}>{msg.text}</p>
              )}
            </div>

            <div className='text-center text-xs' >
              <img src={msg.senderId === authUser?._id ? (authUser?.profilePic || assets.avatar_icon) : (selectedUser?.profilePic || assets.avatar_icon)} alt="" className='w-7 rounded-full object-cover aspect-square' />
              <p className='text-gray-500 ' >{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}

        <div ref={scrollEnd}></div>
      </div>

      {/*----------bottom area--------- */}

      <div className='absolute bottom-0 left-0 right-0 flex flex-col p-3'>
        {image && (
          <div className="relative mb-2 w-20">
            <img src={image} alt="preview" className="w-20 rounded-lg object-cover aspect-square" />
            <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">x</button>
          </div>
        )}
        <div className='flex items-center gap-3'>
          <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full '>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder='Send a message' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white bg-transparent placeholder-gray-400' />
            <input type="file" id="image" accept='image/png, image/jpeg' onChange={handleImageChange} hidden />
            <label htmlFor="image">
              <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
            </label>
          </div>
          <img src={assets.send_button} onClick={handleSendMessage} alt="" className='w-7 cursor-pointer ' />
        </div>
      </div>

    </div>
  ) :(
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} className='max-w-16' alt="" />
      <p className='text-lg font-medium text-white' >Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
