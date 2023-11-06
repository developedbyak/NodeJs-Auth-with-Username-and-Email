const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passport = require("passport");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
    },
    username: {
        type: String,
        required: true,
        unique: true, // Ensure username is unique
    },
    profileImage: {
        type: String,
    },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

const authenticateUser = async (email, password, done) => {
    console.log("authenticator: ", email, password);
    if (!email && !password) {
        return done(null, false, {
            message: "Email and password are required",
        });
    }

    if (!email) {
        return done(null, false, { message: "Email is required" });
    }

    if (!password) {
        return done(null, false, { message: "Password is required" });
    }

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, {
                message: "No user with that email",
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
        } else {
            return done(null, false, { message: "Password incorrect" });
        }
    } catch (error) {
        return done(error);
    }
};
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        authenticateUser
    )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = User;
