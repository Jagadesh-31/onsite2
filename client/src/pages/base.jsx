import { useState,useEffect,useContext } from "react";
import {useNavigate,Navigate} from 'react-router-dom'
import axios from "axios"
import { FaGoogle } from "react-icons/fa";
import { SiDash } from "react-icons/si";
import { MdOutlineEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { authContext } from '../contexts/authContext'

let icons = {
      'google' : <FaGoogle/>,
      'dauth' : <SiDash/>,
      'github' : <FaGithub/>,
      'email' : <MdOutlineEmail/>,
    }


const Base = () => {
  const { user, setUser,logout} = useContext(authContext);

 const params = new URLSearchParams(window.location.search);
 const token = params.get('OauthToken');
 const redirect = params.get('redirect');

useEffect(()=>{
if(token){
  localStorage.setItem('OauthToken',token);
  window.location.href = 'http://localhost:5173'
}
},[])


    const [isOpen, setIsOpen] = useState(false);
    const [currentDialog,setCurrentDialog] = useState('DefaultDialog');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [username,setUsername] = useState('');

    const sendLink =(purpose)=>{
      axios.get(`http://localhost:5000/user/createLink?email=${email}&purpose=${purpose}`)
       .then((res)=>{
        console.log(res.data)
         if(res.data.message === 'Send Successfully'){
          toast.success(res.data.message)
          setCurrentDialog('LinkSent');
         } else{
          toast.warn(res.data.message);
         }
       })
       .catch((err)=>{
        console.log(err)
        toast.error(err.response.data.message)
       })
    }


        let dialog ={
      'DefaultDialog' : <DefaultDialog setCurrentDialog={setCurrentDialog} />,
      'Signin' : <Signin setCurrentDialog={setCurrentDialog}/>,
      'SignupWithEmail' : <SignupWithEmail ssetCurrentDialog={setCurrentDialog} setEmail={setEmail} email={email} password={password} setPassword= {setPassword} sendLink={sendLink}  setUser={setUser} redirect={redirect} username={username} setUsername={setUsername}/>,
      'LinkSent':<LinkSent email={email}/>,
      'SigninWithEmail' : <SigninWithEmail setCurrentDialog={setCurrentDialog} setEmail={setEmail} email={email} password={password} setPassword= {setPassword} sendLink={sendLink}  setUser={setUser} redirect={redirect}/>,
    };

        if(user) {
    return <Navigate to ='/home' replace/>}
    

  return (
    <>
      <ToastContainer/>
      <Header setIsOpen={setIsOpen} isOpen={isOpen}/>
    <div className={`body flex justify-center items-center w-screen h-screen bg-[#F7F4ED]`}>
      <div className="mainContent text-black flex flex-col justify-center gap-7 w-[90%] max-w-[1200px] min-w-[400px] items-start">
              {isOpen &&

          <div
            className="fixed inset-0 z-50 rounded-lg shadow-xl w-screen h-screen bg-transparent flex justify-center items-center"
          >
            <div className="container bg-white shadow-xl h-[100%] w-[100%] md:h-auto md:min-h-[350px] max-w-[500px] md:w-[450px] text-black flex p-2">
             {dialog[currentDialog]}
            <button onClick={() => {setCurrentDialog('DefaultDialog');setIsOpen(false);setEmail('');setPassword('')}} className='self-start min-w-6'>X</button>
            </div>
          </div>
        }
        <div className="heading text-[70px] md:[80px] font-bold">Lorem, ipsum dolor sit amet consectetur.</div>
        <div className="subheading text-[24px] md:text-[26px]">Lorem, ipsum dolor sit amet consectetur.</div>
        <div className="wrapper">
        <span className="startReading inline-block text-[#F7F4ED] bg-black text-[18px] md:text-[20px] rounded-xl py-2 px-5 cursor-pointer" onClick={() => setIsOpen(true)}>Get Started</span>
        </div>
      </div>
    </div>
    <Footer isOpen={isOpen}/>  
    </>
  );
};


const Header = ({setIsOpen}) => {
  return (
    <div className={`header footer bg-[#F7F4ED] text-black h-[70px] flex items-center justify-center w-screen border-black border-b-2 fixed top-0 left-0 shadow-black shadow-md`}>
    <div className="container w-[90%] max-w-[1200px] min-w-[400px] flex justify-between items-center">
      <div className="left text-[26px] md:text-[28px] cursor-pointer font-extrabold">Oauth</div>
      <div className="right text-black text-[18px] md:text-[20px] list-none flex gap-8 items-center">
        <li className='cursor-pointer'>Sign in</li>
        <li className='text-[#F7F4ED] bg-black py-1 px-2 rounded-xl cursor-pointer'  onClick={() => setIsOpen(true)}>Get Started</li>
      </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className={`footer bg-black text-[#F7F4ED] h-[65px] flex justify-center items-center w-screen fixed bottom-0 left-0`}>
    <div className="container w-[90%] max-w-[1200px] min-w-[400px] flex items-center justify-between">
      <div className='left self-start text-[18px] md:text-[20px] list-none gap-6 flex items-center'>
        <li className='cursor-pointer'>About</li>
        <li className='cursor-pointer'>Help</li>
        <li className='cursor-pointer'>Terms</li>
        <li className='cursor-pointer'>privacy</li>
        </div>
      </div>
    </div>
  );
};

function DefaultDialog({setCurrentDialog}){
  return(
          <div className="left flex flex-col justify-center items-center m-4 gap-4">
            <div className="content pl-10 text-black flex flex-col gap-5 list-none">
              <li className='text-[20px] md:text-[22px] font-bold text-center'>Join Medium.</li>
              <li className='border-black border-2 rounded-xl px-4 py-2 flex items-center justify-center gap-4'>
                <span className="logo text-[16px] place-content-start">{icons.email}</span>
                <span className="title self-start cursor-pointer" onClick={()=>{setCurrentDialog('SignupWithEmail')}}>Sign up with Email</span>
              </li>
              
              <li className='text-center cursor-pointer'>Already have an account? <a  className='text-red-600' onClick={()=>{setCurrentDialog('Signin')}}>Sign in</a></li>
            </div>
          <p className='text-[12px] md:text-[14px] text-center text-[#919191]'>Click “Sign up” to agree to Medium's Terms of Service and acknowledge that Medium's Privacy Policy applies to you.</p>
            </div>
  )
}

function SignupWithEmail({navigate,setCurrentDialog,setEmail,email,sendLink,password,setPassword,username,setUsername,setUser,setIsOpen,redirect}){

  function signupHandler(){
   axios.post(`http://localhost:5000/user/register`,{
    email:email,
    password:password,
    username:username
   })
    .then((res)=>{
      console.log(res.data)
          setUser(res.data.user)
          localStorage.setItem('OauthToken', res.data.accessToken);
          if(redirect){
            window.opener.postMessage('oauth-complete', 'http://localhost:5173');
            window.close();
          }
          navigate('/home',{replace:true})
          return;
        }).
        catch((err)=>{
      toast.error(err.response);
    })
  }



  return (
            <div className="left flex flex-col justify-center items-center m-4 gap-3">
            <div className="content pl-10 text-black flex flex-col gap-5 list-none">
              <li className='text-[26px] md:text-[30px] text-center flex justify-center items-center'>{icons.email}</li>
              <li className='text-[20px] md:text-[22px] font-bold text-center'>Sign up with email</li>
                <li className='text-[16px] md:text-[18px] text-center'>Enter your email address to create an account.
             Your email</li>
              <li className='flex flex-col gap-1'>
                <label htmlFor="username">username</label>
                <input type="text" name="email" id="username" placeholder='Enter your email address' value={username}  className='bg-[#f2f2f2] px-3 py-2 focus:border-gray-500 border-1 border-transparent focus:border-1 focus:outline-none rounded-md' onChange={(e)=>setUsername(e.target.value)}/>
              </li>
              <li className='flex flex-col gap-3'>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder='Enter your email address' value={email}  className='bg-[#f2f2f2] px-3 py-2 focus:border-gray-500 border-1 border-transparent focus:border-1 focus:outline-none rounded-md' onChange={(e)=>setEmail(e.target.value)}/>
              </li>
               <li className='flex flex-col gap-2 py-1'>
                <label htmlFor="email">Create Password</label>
                <input type="password" name="password" id="password" placeholder='Enter your password' className='bg-[#f2f2f2] px-3 py-2 rounded-md focus:border-gray-200' value={password} onChange={(e)=>setPassword(e.target.value)}/>
              </li>
              <span className="text-[#F7F4ED] bg-black text-[16px] md:text-[18px] rounded-xl py-2 px-5 cursor-pointer self-center" onClick={() => {if(email!=''){signupHandler()}else{toast.warn('Enter valid email')}}}>Create account</span>
              <a className='text-center cursor-pointer' onClick={()=>{setCurrentDialog('DefaultDialog');setIsOpen(false);setEmail('');setPassword('')}}>Back to Sign up options</a>
              <li className='text-center '>Already have an account? <a  className='text-red-600 cursor-pointer' onClick={()=>{setCurrentDialog('Signin')}}>Sign in</a></li>
            </div>
          <p className='text-[12px] md:text-[14px] text-center text-[#919191]'>This site is protected by reCAPTCHA Enterprise and the
Google Privacy Policy and Terms of Service apply.</p>
            </div>
  )
}

function SigninWithEmail({setCurrentDialog,setEmail,email,password,setPassword,setUser,setI~sOpen,redirect}){
  let navigate = useNavigate();

  function signinHandler(){
   axios.post(`http://localhost:5000/user/login`,{
    email:email,
    password:password
   })
    .then((res)=>{
      console.log(res.data)
          setUser(res.data.user)
          localStorage.setItem('OauthToken', res.data.accessToken);
          if(redirect){
            window.opener.postMessage('oauth-complete', 'http://localhost:5173');
            window.close();
          }
          navigate('/home',{replace:true})
          return;
        }).
        catch((err)=>{
      toast.error(err.response);
    })
  }

  return (
           <div className="left flex flex-col justify-center items-center m-4 gap-4">
            <div className="content pl-10 text-black flex flex-col gap-5 list-none">
              <li className='text-[26px] md:text-[30px] text-center flex justify-center items-center'>{icons.email}</li>
              <li className='text-[20px] md:text-[22px] font-bold text-center'>Sign in with email</li>
                <li className='text-[16px] md:text-[18px]  text-center'>Enter the email address associated with your account, and we'll send a magic link to your inbox.</li>
              <li className='flex flex-col gap-2 py-1'>
                <label htmlFor="email">Your email</label>
                <input type="email" name="email" id="email" placeholder='Enter your email address' className='bg-[#f2f2f2] px-3 py-2 rounded-md focus:border-gray-200' value={email} onChange={(e)=>setEmail(e.target.value)}/>
              </li>
              <li className='flex flex-col gap-2 py-1'>
                <label htmlFor="email">Your Password</label>
                <input type="password" name="password" id="password" placeholder='Enter your password' className='bg-[#f2f2f2] px-3 py-2 rounded-md focus:border-gray-200' value={password} onChange={(e)=>setPassword(e.target.value)}/>
              </li>
              <span className="text-[#F7F4ED] bg-black text-[16px] md:text-[18px] rounded-xl py-2 px-5 cursor-pointer self-center" onClick={() => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(emailRegex.test(email)){signinHandler()}else{toast.warn('Enter valid email')}}}>Continue</span>
              <a className='text-center cursor-pointer' onClick={()=>{setCurrentDialog('DefaultDialog');setIsOpen(false);setEmail('');setPassword('')}}>Back to Sign up options</a>
            </div>
          <p className='text-[12px] md:text-[14px] text-center text-[#919191]'>This site is protected by reCAPTCHA Enterprise and the
Google Privacy Policy and Terms of Service apply.</p>
            </div>
  )
}

function Signin({setCurrentDialog}){
  return(
          <div className="left flex flex-col justify-center items-center m-4 gap-4">
            <div className="content pl-10 text-black flex flex-col gap-5 list-none">
              <li className='text-[20px] md:text-[22px] font-bold text-center'>Welcome back.</li>
              <li className='border-black border-2 rounded-xl px-4 py-2 flex items-center justify-between'>
                <span className="logo text-[16px]">{icons.email}</span>
                <span className="title cursor-pointer self-start w-2/3" onClick={()=>{setCurrentDialog('SigninWithEmail')}}>Sign in with Email</span>
              </li>
              <li className='text-center'>No account? <a  className='text-red-600 cursor-pointer' onClick={()=>{setCurrentDialog('DefaultDialog')}}>Create one</a></li>
              <li className='text-center'>Forgot email or trouble signing in? <a  className='text-red-600 cursor-pointer'>Get help</a></li>
            </div>
          <p className='text-[12px] md:text-[14px] text-center text-[#919191]'>Click “Sign in” to agree to Medium’s Terms of Service and acknowledge that Medium's Privacy Policy applies to you.</p>
            </div>
  )
}


const LinkSent = ({email}) => {
  return (
           <div className="left flex flex-col justify-center items-center m-4 gap-4">
            <div className="content pl-10 text-black flex flex-col gap-5 list-none">
              <li className='text-[26px] md:text-[30px] text-center flex justify-center items-center'>{icons.email}</li>
              <li className='text-[20px] md:text-[22px] font-bold text-center'>Check your email inbox</li>
                <li className='text-[16px] md:text-[18px]  text-center'>Click the link we sent to {email} to complete your account set-up.</li>
            </div>
            </div>
  );
};


export default Base;