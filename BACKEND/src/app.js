const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const passport = require("passport");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");
const followRoutes = require("./routes/followRoutes");
const newsRoutes = require("./routes/newsRoutes");
const oauthRoutes = require("./routes/oauthRoutes");
const profileRoutes = require("./routes/profileRoutes");
const projectsRoutes = require("./routes/projectRoutes");
const twoFactorRoutes = require("./routes/twoFactorRoutes");
const teamRoutes = require("./routes/teamRoutes");

// Load environment variables
dotenv.config();

// Load passport configuration
require("./config/passportConfig");

// Initiliaze express app
const app = express();

// Parse JSON bodies
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Auth routes
app.use("/auth", oauthRoutes);
app.use("/auth", authRoutes);
app.use("/2fa", twoFactorRoutes);

// Routes for the user profile
app.use("/profile", profileRoutes);

// Routes for the projets
app.use("/projects", projectsRoutes);

// Routes for the follow
app.use("/follow", followRoutes);

// Routes For the news
app.use("/news", newsRoutes);

// Routes for the Teams
app.use("/teams", teamRoutes);

module.exports = app;
