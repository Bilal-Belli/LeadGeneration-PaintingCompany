require("dotenv").config();
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const express = require("express");
const path = require("path");

const leadsRoute = require("./routes/leads");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/api/leads", leadsRoute);


app.use(session({
    store: new SQLiteStore(),
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false
}));


const adminAuth = require("./routes/adminAuth");
const adminLeads = require("./routes/adminLeads");
const auth = require("./middleware/auth");

app.get("/admin/dashboard.html", auth, (req, res) => {
    res.sendFile(path.join(__dirname, "public/admin/dashboard.html"));
});

app.use("/api/admin", adminAuth);
app.use("/api/admin/leads", adminLeads);

const PORT = 3000;
app.listen(PORT, () =>
    console.log(`Server running http://localhost:${PORT}`)
);