let express = require('express');

let {verifyAccessToken} = require('../middleware/jwtToken.js')

let {verifyLink,createLink,registerUser,loginUser,refreshToken,userInfo,getApps,createCredentials,getToken,getUserInfo,getCode,getUser} = require('../controllers/user.js');

let userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/getInfo',userInfo);
userRouter.get('/createLink',createLink);
userRouter.get('/refreshToken',refreshToken);
userRouter.get('/verifyLink/callback',verifyLink);
// userRouter.get('/oauth/token',getToken);
// userRouter.get('/authorize',getUserInfo);
userRouter.get('/getApps',getApps);
userRouter.post('/getToken',getToken);
userRouter.get('/getCode',getCode);
userRouter.get('/getUser',getUser);
userRouter.post('/credentials/create',createCredentials);

module.exports = userRouter;
