const session = require("express-session");
console.log("THIS IS MY SERVER FILE");

const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ SESSION SETUP
app.use(session({
    secret: "gym_secret_key",
    resave: false,
    saveUninitialized: true
}));

const PORT = 3005;

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


// Test Route
app.get("/test", (req, res) => {
    res.send("Test Route Working");
});

// DELETE MEMBER
app.get("/delete-member/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM members WHERE id = ?";

    db.query(sql, [id], (err) => {

        if (err) {
            console.log(err);
            return res.send("Delete Failed");
        }

        res.send("Member Deleted Successfully");

    });

});

// UPDATE MEMBER
app.post("/update-member/:id", (req, res) => {

    const id = req.params.id;
    const { full_name, age, gender, mobile, email } = req.body;

    const sql = `
        UPDATE members 
        SET full_name=?, age=?, gender=?, mobile=?, email=? 
        WHERE id=?
    `;

    db.query(sql, [full_name, age, gender, mobile, email, id], (err) => {

        if (err) {
            console.log(err);
            return res.send("Update Failed");
        }

        res.send("Member Updated Successfully");

    });

});

// REGISTER
app.post("/register", (req, res) => {

    const {
        full_name,
        age,
        gender,
        weight,
        height,
        mobile,
        email,
        password
    } = req.body;

    const sql = `
        INSERT INTO members
        (full_name, age, gender, weight, height, mobile, email, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql,
        [full_name, age, gender, weight, height, mobile, email, password],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Registration Failed");
            }

            res.send("Registration Successful");

        }
    );

});

// LOGIN (SESSION ADDED HERE)
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM members
        WHERE email = ? AND password = ?
    `;

    db.query(sql, [email, password], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Login Failed");
        }

        if (result.length > 0) {

            // ✅ SESSION CREATE
            req.session.user = result[0];

            res.redirect("/dashboard.html");

        } else {
            res.send("Invalid Email or Password");
        }

    });

});

// 🔐 PROTECTED DASHBOARD
app.get("/dashboard.html", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/");
    }

    res.sendFile(path.join(__dirname, "dashboard.html"));
});

// LOGOUT
app.get("/logout", (req, res) => {

    req.session.destroy();

    res.redirect("/");

});

// TOTAL MEMBERS
app.get("/total-members", (req, res) => {

    const sql = "SELECT COUNT(*) AS total FROM members";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.json({ total: 0 });
        }

        res.json(result[0]);

    });

});

// VIEW MEMBERS API
app.get("/api/members", (req, res) => {

    const sql = "SELECT * FROM members";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.json([]);
        }

        res.json(result);

    });

});

console.log("App loaded successfully");

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});