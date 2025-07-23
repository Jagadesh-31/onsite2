const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars').default;
const path = require('path');
const bcrypt = require('bcrypt');
const axios = require('axios')


require('dotenv').config()

let userModel = require('../models/user.js');
let verificationLinkModel = require('../models/verificationLink.js');
const credentialsModel = require('../models/credentials.js')
const authorizationCodeModel = require('../models/authorizationCode.js')

const randomCode = ()=>{
  return crypto.randomBytes(16).toString('hex');
}

const generateAccessToken = (payload)=>{
  let options = {
    expiresIn : '15m'
  }

  let token = jwt.sign(payload,process.env.ACCESS_SECRET_CODE,options);

  return token;
}

const generateRefreshToken = (payload)=>{
  let options = {
    expiresIn : '7d'
  }

  let token = jwt.sign(payload,process.env.REFRESH_SECRET_CODE,options);

  return token;
}

const refreshToken = () =>{
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.REFRESH_SECRET_CODE, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = generateAccessToken({ userId : user.userId});
    res.json({ accessToken: newAccessToken });
  });
}


const createLink = async (req,res)=>{
  let {email,purpose} = req.query;
  let code = randomCode();
  try{
  let user = await userModel.findOne({email:email})
    if(user){
      return res.status(400).json({message:'Email Already Registered'})
    }

  let result = await verificationLinkModel.insertOne({email:email,purpose:purpose,code:code,expiresAt:new Date(Date.now()+120*60*1000)});
  if(!result){
    return res.status(500).json({message:'Server Error'})
  }
  sendMail(email,code);
  return res.status(200).json({message:'Send Successfully'})
  }catch(err){
    console.log('error :',err)
  }
}

const verifyLink = async (req,res)=>{
  let {code} = req.query;
  console.log(code)
  try{
  let result = await verificationLinkModel.findOne({code:code});

  if(result.expiresAt < new Date()){
    return res.status(404).json({message:'Link got Expired'});
  }
    console.log(result)
   if(result.purpose==='register'){
    res.redirect(`http://localhost:5173/redirect?token=${code}&purpose=${result.purpose}&email=${result.email}`);
  }
  }catch(err){
    console.log('error :',err)
  }
}

const loginUser = async (req,res)=>{
  try{
  let result = await userModel.findOne({email:req.body.email});
  if(!result){
    return res.status(404).json({message:'user not found'});
  }
  let enteredPass = req.body.password;
  let isSame = await bcrypt.compare(enteredPass,result.password);

  if(!isSame){
   return res.status(401).json({message:'Incorrect Password'});
  }

  let accessToken = generateAccessToken({userId:result._id});

  res.status(200).json({message:'successfully logged in',user:result,accessToken});
    console.log('success')
  }catch(err){
    console.log('error :',err)
  }
}

const userInfo = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_CODE);

    const userInfo = await userModel.find({_id:decoded.userId});

    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(userInfo);

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    console.error('Error fetching user info:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const registerUser = async (req,res)=>{
  console.log(req.body);
  try{
  req.body.password = await bcrypt.hash(req.body.password,10);
  let result = await userModel.insertOne(req.body);
    let accessToken = generateAccessToken({userId:result._id});
    res.status(200).json({message:'successfully created',user:result,accessToken});
    console.log('success')
  }catch(err){
    console.log('error :',err)
  }
}

const transporter = nodemailer.createTransport({
service:'gmail',
auth:{
  user:'gamerdevil033@gmail.com',
  pass:'acuq kycu iyhe xiyc'
}
})

const sendMail = (email,code) =>{
transporter.use('compile', hbs({
  viewEngine: {
    extname: '.hbs',
    partialsDir: path.resolve(__dirname, '../templates'),
    defaultLayout: false
  },
  viewPath: path.resolve(__dirname, '../templates'),
  extName: '.hbs'
}));


let options = {
  from:'gamerdevil033@gmail.com',
  to:email,
  subject:'Verification Link',
  template:'verificationLink',
  context:{
    link : `http://localhost:5000/user/verifyLink/callback?code=${code}`
  }}

  transporter.sendMail(options,(err,info)=>{
    console.log('transporting')
    if(err){ return console.log(err)}
    console.log(info)
  })
}

const getApps = async (req,res)=>{
let {userId} = req.query
console.log(userId);
try{
 let result = await credentialsModel.find({userId:userId});
 if(!res){
    res.status(200).json(result)
 }
    res.status(200).json(result)
} catch(err){
  console.log(err)
}
}

const createCredentials = async (req,res)=>{
let client_id = randomCode();
let client_secret = randomCode();
console.log('hello')

try{
 let result = await credentialsModel.insertOne({...req.body,clientId:client_id,clientSecret:client_secret});
 console.log(result)
  res.status(200).json(result)
  console.lo(result);
} catch(err){
}
}

const getCode = async (req,res)=>{
let {userId} = req.query;
let code =randomCode()

try{
 let result = await authorizationCodeModel.insertOne({userId:userId,code});
   if(!res){
    return res.status(403).json('unauthorized')
   }
   res.status(200).json(result.code);
} catch(err){
    console.log('err in code generation',err)
}
}


const getToken = async (req, res) => {
  const { code, client_id, client_secret, redirect_uri } = req.query;

  try {
    const result = await authorizationCodeModel.findOne({ code });
    console.log(result);

    if (!result.userId) {
      return res.status(403).json('unauthorized');
    }

    const access_token = generateAccessToken({ userId: result.userId });

    console.log(access_token);
    return res.status(200).json({ access_token });
  } catch (err) {
    console.error(err);
    return res.status(500).json('server error');
  }
};

const getUser =async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_CODE);

    const userInfo = await userModel.find({_id:decoded.userId});

    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(userInfo);

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    console.error('Error fetching user info:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {createLink,verifyLink,registerUser,loginUser,userInfo,refreshToken,getApps,createCredentials,getToken,getCode,getUser}


