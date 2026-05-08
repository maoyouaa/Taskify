const { urlencoded } = require("express");
const express = require("express");
const path = require("path");
require("dotenv").config();
require("../src/db/conn");
const views_path = path.join(__dirname, "../views");
const static_path = path.join(__dirname, "../static");
const app = express();
const port = process.env.PORT || 80;

function isNonEmpty(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value) {
    return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function collectMissingFields(body, fields) {
    return fields.filter((field) => !isNonEmpty(body[field]));
}

app.use("/static", express.static(static_path));
app.use(express.json());
app.use(urlencoded({ extended: false }));


app.set("view engine", "ejs");
app.set("views", views_path);

app.get("/", (req, res) => {
    res.status(200).render("index.ejs");
});

app.get("/signup", (req, res) => {
    res.status(200).render("signup.ejs");
});

app.post("/signup", (req, res) => {
    const missingFields = collectMissingFields(req.body, [
        "SignUpUsername",
        "SignUpEmail",
        "SignUpPassword",
    ]);

    if (missingFields.length > 0 || !isValidEmail(req.body.SignUpEmail)) {
        return res.status(400).json({
            success: false,
            errors: {
                missingFields,
                email: isValidEmail(req.body.SignUpEmail) ? undefined : "Enter a valid email address.",
            },
        });
    }

    return res.redirect(303, "/dashboard");
});

app.post("/login", (req, res) => {
    const missingFields = collectMissingFields(req.body, [
        "LoginEmail",
        "LoginPassword",
    ]);

    if (missingFields.length > 0 || !isValidEmail(req.body.LoginEmail)) {
        return res.status(400).json({
            success: false,
            errors: {
                missingFields,
                email: isValidEmail(req.body.LoginEmail) ? undefined : "Enter a valid email address.",
            },
        });
    }

    return res.redirect(303, "/dashboard");
});

// In Future this dashboard will be rendered after authentication of users 
app.get("/dashboard", (req, res) => {
    res.status(200).render("dashboard/dashboard.ejs");
});



if (require.main === module) {
    //* listen
    app.listen(port, () => {
        console.log(`The application started successfully on port ${port}`);
    });
}

module.exports = app;
