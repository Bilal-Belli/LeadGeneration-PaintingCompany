const express = require("express");
const router = express.Router();

const db = require("../db");
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
    const { name, email, phone, address, message } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ error: "Missing fields" });
    }

    // Save to DB
    const stmt = db.prepare(`
        INSERT INTO leads (name, email, phone, address, message)
        VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(name, email, phone, address, message);

    // Send email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"Lead System" <${process.env.EMAIL_USER}>`,
        to: process.env.NOTIFY_EMAIL,
        subject: "🎨 New Painting Lead",
        html: `
        <h3>New Lead</h3>
        <p>Name: ${name}</p>
        <p>Phone: ${phone}</p>
        <p>Email: ${email}</p>
        <p>Address: ${address}</p>
        <p>Message: ${message}</p>
        `
    });

    res.json({ success: true });
});

module.exports = router;