const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const Login = require("./config"); 

mongoose.connect("mongodb://127.0.0.1:27017/register")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get("/", (req, res) => {
    res.render("register"); 
});

app.post("/register", async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    };
    try {
        const existingUser = await Login.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).render("error", { message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const userdata = await Login.create({ email: data.email, password: hashedPassword });
        console.log("User registered successfully:", userdata);

        res.redirect("/success");
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).render("error", { message: "Error registering user" });
    }
});

app.get("/success", (req, res) => {
    res.render("success", { message: "User registered successfully" });
});



const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});
