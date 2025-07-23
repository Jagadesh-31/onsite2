import {useContext} from 'react';
import { IoNotificationsOutline } from "react-icons/io5";
import { authContext } from './../contexts/authContext';


const Header = () => {
    const {logout} = useContext(authContext);

  return (
    <div className='header footer bg-black text-[#F7F4ED] h-[70px] flex items-center justify-center w-screen border-[#F7F4ED] border-b-2 shadow-white shadow-sm fixed top-0 left-0'>
    <div className="container w-[90%] max-w-[1200px] min-w-[400px] flex justify-between items-center">
      <div className="left text-[24px] md:text-[26px] cursor-pointer font-extrabold">Oauth</div>
      <div className="right text-[#F7F4ED]  text-[16px] md:text-[18px] cursor-pointer list-none flex gap-15 items-center">
        <li>
        <IoNotificationsOutline className='text-[#F7F4ED] font-bold text-[20px] md:text-[24px]'></IoNotificationsOutline>
        </li>
        <li className='rounded-full aspect-square bg-white'><img src='#' alt="profile" className=''/></li>
        <span className="startReading inline-block text-black bg-[#F7F4ED] text-[18px] md:text-[20px] rounded-xl py-1 px-4 cursor-pointer" onClick={()=>{logout()}}>Logout</span>
      </div>
      </div>
    </div>
  );
};

export default Header;