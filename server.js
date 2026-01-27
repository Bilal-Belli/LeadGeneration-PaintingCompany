require("dotenv").config();
const express = require("express");
const path = require("path");

const leadsRoute = require("./routes/leads");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/api/leads", leadsRoute);

const PORT = 3000;
app.listen(PORT, () =>
    console.log(`Server running http://localhost:${PORT}`)
);