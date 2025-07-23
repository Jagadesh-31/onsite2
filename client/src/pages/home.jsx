import { useState,useEffect,useContext } from "react";
import {useNavigate,Navigate} from 'react-router-dom'
import axios from "axios"
import { authContext } from './../contexts/authContext';
import AppTemplate from './../components/appsTemplate';
import Loader from './../components/loader'
import { IoNotificationsOutline } from "react-icons/io5";


function Home() {
    const { user,logout} = useContext(authContext);
      const [isOpen, setIsOpen] = useState(false);
      const [myApps,setMyApps] = useState([]);
      let [loading,setLoading] = useState(true);

      console.log(myApps)

      function getData(){
     axios.get(`http://localhost:5000/user/getApps?userId=${user._id}`)
      .then((res)=>{
        console.log(res.data);
        if(res.status===203){
          setLoading(false);
        } else{
         setMyApps(res.data);
         setLoading(false);
        }
        }).
        catch((err)=>{
          console.log(err)})
      }

    useEffect(()=>{
      getData();
      },[])

  return (
    <>
        <div className='header footer bg-black text-[#F7F4ED] h-[70px] flex items-center justify-center w-screen border-[#F7F4ED] border-b-2 shadow-white shadow-sm fixed top-0 left-0'>
        <div className="container w-[90%] max-w-[1200px] min-w-[400px] flex justify-between items-center">
          <div className="left text-[24px] md:text-[26px] cursor-pointer font-extrabold">Oauth</div>
          <div className="right text-[#F7F4ED]  text-[16px] md:text-[18px] cursor-pointer list-none flex gap-15 items-center">
            <span className="startReading inline-block text-black bg-[#F7F4ED] text-[18px] md:text-[20px] rounded-xl py-1 px-4 cursor-pointer" onClick={() => setIsOpen(true)}>create app</span>
            <span className="startReading inline-block text-black bg-[#F7F4ED] text-[18px] md:text-[20px] rounded-xl py-1 px-4 cursor-pointer" onClick={()=>{logout()}}>Logout</span>
          </div>
          </div>
        </div>
    {loading?<Loader/>:(<div className={`body flex justify-center items-center w-screen h-screen bg-[#F7F4ED]`}>
      <div className="mainContent text-black flex flex-col justify-center gap-7 w-[90%] max-w-[1200px] min-w-[400px] items-start">
        {myApps?.length>0 && myApps.map((app)=>{
          return (<AppTemplate app={app}/>)
        })}
        {isOpen &&
          <div
            className="fixed inset-0 z-50 rounded-lg shadow-xl w-screen h-screen bg-transparent flex justify-center items-center"
          >
            <div className="container bg-white shadow-xl h-[100%] w-[100%] md:h-auto md:min-h-[350px] max-w-[500px] md:w-[450px] text-black flex p-2">
             <DefaultDialog setIsOpen={setIsOpen} user={user} getData={getData}/>
            <button onClick={() => {setIsOpen(false);}} className='self-start min-w-6'>X</button>
            </div>
          </div>
        }
      </div>
    </div>)}
    </>
  )}


  function DefaultDialog({setIsOpen,user,getData}){
   let [form,setForm] = useState({name:'',home:'',callback:'',userId:user._id,scope:'all-credentails'});

function submitHandler() {
  axios.post('http://localhost:5000/user/credentials/create', form)
    .then((res) => {
      console.log(res.data);
      setIsOpen(false);
      getData();
    })
    .catch((err) => {
      console.log(err);
    });
}

  return (
           <div className="left flex flex-col justify-center items-center m-4 gap-4">
            <div className="content pl-10 text-black flex flex-col gap-5 list-none">
              <li className='text-[20px] md:text-[22px] font-bold text-center'>create App</li>
              <li className='flex flex-col gap-2 py-1'>
                <label htmlFor="name">Name Of your Application</label>
                <input type="text" name="name" id="name" placeholder='Enter your application name' className='bg-[#f2f2f2] px-3 py-2 rounded-md focus:border-gray-200' value={form.name} onChange={(e)=>setForm(pre=>({...pre,name:e.target.value}))}/>
              </li>
              <li className='flex flex-col gap-2 py-1'>
                <label htmlFor="">HomePage url</label>
                <input type="text" name="home" id="home" placeholder='Enter your home' className='bg-[#f2f2f2] px-3 py-2 rounded-md focus:border-gray-200' value={form.home} onChange={(e)=>setForm(pre=>({...pre,home:e.target.value}))}/>
              </li>
               <li className='flex flex-col gap-2 py-1'>
                <label htmlFor="">callbackPage url</label>
                <input type="text" name="callback" id="callback" placeholder='Enter your home' className='bg-[#f2f2f2] px-3 py-2 rounded-md focus:border-gray-200' value={form.callback} onChange={(e)=>setForm(pre=>({...pre,callback:e.target.value}))}/>
              </li>
            <span className="text-[#F7F4ED] bg-black text-[16px] md:text-[18px] rounded-xl py-2 px-5 cursor-pointer self-center" onClick={() => {submitHandler()}}>Create</span>
            </div>
            </div>
  )
}


export default Home