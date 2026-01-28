const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, (req, res) => {
    const leads = db
        .prepare("SELECT * FROM leads ORDER BY created_at DESC")
        .all();

    res.json(leads);
});

router.post("/:id/status", auth, (req, res) => {
    db.prepare(
        "UPDATE leads SET status=? WHERE id=?"
    ).run(req.body.status, req.params.id);

    res.json({ ok: true });
});

module.exports = router;