let express = require('express');
let cors = require('cors');
let mongoose = require('mongoose');
let http = require('http');
let fs = require('fs')
let path = require('path')
const { Server } = require("socket.io");


let app = express();
let server = http.createServer(app);
let io = new Server(server,{cors:{origin:'*'}});

let multer = require('multer')

require('dotenv').config();


let userRouter = require('./routes/user.js')


io.on("connection", (socket) => {
  console.log('client connected',socket.id)


  socket.on('joinRoom',(roomId)=>{
    console.log(roomId);
    socket.join(roomId);
  });

  socket.on('draw',(props)=>{
    console.log(props)
  socket.broadcast.to(props.roomId).emit('drawShape',props.shape);
  })

  socket.on('disconnect',()=>{
    console.log('client disconnected')
  })
});

app.use(cors());
app.use(express.json());
app.use('/user',userRouter);

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), (req, res) => {
  fs.writeFileSync(path.join('uploads', req.file.originalname), req.file.buffer);
  const videoBuffer = fs.readFileSync(path.join('uploads', req.file.originalname));
  res.set('Content-Type', req.file.mimetype); 
  res.set('Content-Length', videoBuffer.length);
  res.send(videoBuffer);
});

let port = process.env.PORT || 5001

console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL)
  .then(()=>{
    console.log('mongodb Connected successfully');
    server.listen(port,()=>{
      console.log(`listening to : http://localhost:${port}`)
    })
  }).catch((err) => {
  console.log('error connecting to mongodb:' + err);
});



