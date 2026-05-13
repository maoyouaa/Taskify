const { urlencoded } = require("express");
const express = require("express");
const path = require("path");
require("dotenv").config();
require("../src/db/conn");
const {
    createUser,
    getUserById,
    verifyCredentials,
} = require("./services/auth-store");
const {
    clearSessionCookie,
    createSessionCookie,
    getSession,
} = require("./middleware/session");
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

function asyncRoute(handler) {
    return (req, res, next) => {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
}

function isStrongEnoughPassword(value) {
    return typeof value === "string" && value.length >= 8;
}

function getAuthenticatedUser(req) {
    const session = getSession(req);
    return session ? getUserById(session.userId) : null;
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

app.get("/favicon.ico", (req, res) => {
    res.status(204).end();
});

app.get("/privacy", (req, res) => {
    res.status(200).render("privacy.ejs");
});

app.post("/signup", asyncRoute(async (req, res) => {
    const missingFields = collectMissingFields(req.body, [
        "SignUpUsername",
        "SignUpEmail",
        "SignUpPassword",
    ]);
    const passwordIsStrongEnough = isStrongEnoughPassword(req.body.SignUpPassword);

    if (missingFields.length > 0 || !isValidEmail(req.body.SignUpEmail) || !passwordIsStrongEnough) {
        return res.status(400).json({
            success: false,
            errors: {
                missingFields,
                email: isValidEmail(req.body.SignUpEmail) ? undefined : "Enter a valid email address.",
                password: passwordIsStrongEnough ? undefined : "Password must be at least 8 characters.",
            },
        });
    }

    const result = await createUser({
        username: req.body.SignUpUsername,
        email: req.body.SignUpEmail,
        password: req.body.SignUpPassword,
    });

    if (!result.ok) {
        return res.status(409).json({
            success: false,
            errors: {
                email: "An account already exists for this email address.",
            },
        });
    }

    res.setHeader("Set-Cookie", createSessionCookie(result.user));
    return res.redirect(303, "/dashboard");
}));

app.post("/login", asyncRoute(async (req, res) => {
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

    const user = await verifyCredentials(req.body.LoginEmail, req.body.LoginPassword);

    if (!user) {
        return res.status(401).json({
            success: false,
            errors: {
                credentials: "Email or password is incorrect.",
            },
        });
    }

    res.setHeader("Set-Cookie", createSessionCookie(user));
    return res.redirect(303, "/dashboard");
}));

app.post("/logout", (req, res) => {
    res.setHeader("Set-Cookie", clearSessionCookie());
    return res.redirect(303, "/signup");
});

// In Future this dashboard will be rendered after authentication of users 
app.get("/dashboard", (req, res) => {
    const user = getAuthenticatedUser(req);

    if (!user) {
        return res.redirect(303, "/signup");
    }

    res.locals.currentUser = user;
    res.status(200).render("dashboard/dashboard.ejs");
});

app.use((err, req, res, next) => {
    console.error(err);
    return res.status(500).json({
        success: false,
        error: "Internal server error.",
    });
});



if (require.main === module) {
    //* listen
    app.listen(port, () => {
        console.log(`The application started successfully on port ${port}`);
    });
}

module.exports = app;
