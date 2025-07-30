const express=require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)
const rootDir = require('./utils/pathUtil');
const path = require('path');
const userRouter = require('./routes/user');
const openApiRouter = require('./routes/openApi');
const app=express();
require('dotenv').config();


const port = process.env.PORT || 3001;
app.use(cors({
    origin: 'https://chatgptultra.netlify.app', // Adjust this to your frontend URL
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
    collection: 'myLoginSessions',
});
app.use(session({
  secret: 'secretKey', // Replace with your secret key
  resave: false,
  saveUninitialized: false,
    store: store, // Use MongoDBStore for session storage
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'lax', // or 'none' with https
    secure: false // true only if using HTTPS
  }
}));
app.use('/upload/',express.static(path.join(rootDir, 'upload'))); // Serve static files from 'upload' directory
const filefilter = (req, file, cb) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
    }



app.use(multer({ storage,filefilter }).single('photo')); 


const dbUrl=process.env.MONGODB_URI;
if (!dbUrl) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}
app.use(userRouter)
app.use(openApiRouter);
app.get('/', (req, res) => {
  res.send('Todo backend is live!');
});

mongoose.connect(dbUrl)
.then(()=>{
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
})
.catch((err)=>{ 
    console.error("Error connecting to MongoDB:", err);
});
