const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes.js')
const postRoutes = require('./routes/postRoutes.js')
const authRoutes = require('./routes/authRoutes.js')
const {passport} = require('./auth/auth.js')
const { connectDB, query } = require('./db');
const cors = require("cors");


dotenv.config();

const app = express();
const port = process.env.PORT || 8080;


const corsOptions = {
  origin: "http://localhost:3000",

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Access-Control-Allow-Credentials",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Pre-flight requests
app.options('*', cors(corsOptions));

// Middlewares
app.use(express.json());

app.use(passport.initialize());

// Routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/auth', authRoutes );

// Test database connection
(async () => {
  try {
    await connectDB();
    const result = await query('SELECT NOW()');
    console.log('Database connected:', result.rows[0].now);
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
