// Import necessary modules and dependencies
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./DB/db.js");
const User = require("./models/userSchema");
const cors = require("cors");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
dotenv.config();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set up middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use("/uploads", express.static("public/uploads"));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// session-setup
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

//Multer middleware for uploading images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

//----------------------------get---------------------

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/home", (req, res) => {
    if (req.isAuthenticated()) {
        const userData = req.user;
        // console.log("/home userdata: ", userData);
        res.render("home.ejs", { user: userData });
    } else {
        console.log("no user");
    }
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/features", (req, res) => {
    res.render("coin_tracker.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/logout", (req, res) => {
    res.render("logout");
});

app.get("/logout", (req, res) => {
    // Destroy the user's session to log them out
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        } else {
            console.log("User has been logged out.");
        }
        res.redirect("/login"); // Redirect to the login page or any other desired page
    });
});

//------------------post----------

// register
app.post("/register", upload.single("profileImage"), async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        const isUser = await User.findOne({ email: email });

        if (isUser) {
            console.error("User already exists!"); // make your flash message here
            return;
        }

        const profileImage = req.file; // Extract the uploaded image
        const imageFilePath = profileImage
            ? profileImage.path
            : "public\\uploads\\1699208569681-313501.jpg";

        const imageUrl = `/uploads/${path.basename(imageFilePath)}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            name,
            email,
            password: hashedPassword,
            profileImage: imageUrl,
        });

        await user
            .save()
            .then((data) => {
                res.redirect("/login");
                console.log("new user created: ", data);
            })
            .catch((err) => {
                console.log("Error while saving user data: ", err);
            });
    } catch (error) {
        console.error("Registration failed:", error);
        res.redirect("/register");
    }
});

// Login - Post
app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        // console.log("err: ", err);
        // console.log("user: ", user);
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash(
                "error",
                "Authentication failed. Please check your email and password."
            );
            console.log("Login failed:", info);
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            console.log("User logged in:", user.username); // Add this for debugging
            res.cookie("authCookie", "cookieValue", { sameSite: "Lax" });
            return res.redirect("/home");
        });
    })(req, res, next);
});

// --------------app.listen -------------

const PORT = 3000;
connectDB().then(() => {
    app.listen(PORT, console.log(`Server is up on port ${PORT}`));
});
