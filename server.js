import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const port = 3000;

app.get("/inventory", async (req, res) => {
    const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_NAME)}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`
        }
    });

    const data = await response.json();
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});