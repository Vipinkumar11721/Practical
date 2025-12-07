
const User = require("../models/user");
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.signup = async (req, res, next) => {
        try {
            let { username, email, password } = req.body;
            const newUser = new User({ email, username });
            const registeredUser = await User.register(newUser, password);
            console.log(registeredUser);
            req.login(registeredUser, (err) => {
                if (err) return next(err);
                req.flash("success", "Welcome to Wanderlust");
                const redirectUrl = req.session && req.session.redirectUrl ? req.session.redirectUrl : "/listings";
                if (req.session && req.session.redirectUrl) delete req.session.redirectUrl;
                res.redirect(redirectUrl);
            });
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    };

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


module.exports.login = async (req, res) => {
        req.flash("success", "Welcome to Wanderlust! You are logged in!");
        const redirectUrl = req.session && req.session.redirectUrl ? req.session.redirectUrl : "/listings";
        if (req.session && req.session.redirectUrl) delete req.session.redirectUrl;
        res.redirect(redirectUrl);
};


module.exports.logout = (req, res) => { 
    req.logout((err) => {
        if(err){
            req.flash("error", "Something went wrong!");
            return res.redirect("/listings");
        }
        req.flash("success", "Goodbye!");
        res.redirect("/login");
    })
};