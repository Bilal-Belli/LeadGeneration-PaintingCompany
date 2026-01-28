const bcrypt = require("bcrypt");
const db = require("./db");

(async () => {
    const email = "admin_email_here"; // Replace with desired admin email !!
    const password = "admin_password_here"; // Replace with desired admin password !!

    const hash = await bcrypt.hash(password, 10);

    db.prepare(`
        INSERT INTO admins (email, password)
        VALUES (?, ?)
    `).run(email, hash);

    console.log("Admin created");
})();