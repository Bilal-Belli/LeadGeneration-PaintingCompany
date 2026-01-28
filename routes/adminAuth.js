const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const admin = db
        .prepare("SELECT * FROM admins WHERE email = ?")
        .get(email);

    if (!admin) return res.redirect("/admin/login.html?err=1");

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.redirect("/admin/login.html?err=1");

    req.session.adminId = admin.id;
    res.redirect("/admin/dashboard.html");
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/admin/login.html"));
});

module.exports = router;