import express from "express";
const router = express.Router();
import passport from "passport";

//Version para passport
router.post("/", passport.authenticate("register", {
    failureRedirect: "/api/sessions/failedregister"}), async (req, res) => {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        };
        req.session.login = true;
        res.redirect("/profile");
    })

router.get("/failedregister", (req, res) => {
    res.send("Registro fallido");
})

//Login. 

router.post("/login", passport.authenticate("login", { failureRedirect:"/api/sessions/faillogin"}), async (req, res) => {
    if(!req.user) return res.status(400).send("Credenciales invalidas");
    
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true; 

    res.redirect("/profile");

})

router.get("/faillogin", async (req, res) => {
    res.send("Fallo login");
})

//Logout
router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
        res.redirect("/login")
    }
})

//acceso con github
router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {})
//github callback
router.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
})


export default router;