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
    
    const formatted = data.records.map(record => ({
        id: record.id,
        color: record.fields.Color,
        finish: record.fields.Finish,
        description: record.fields.Description,
        inStock: record.fields.inStock,
        colorHex: record.fields.ColorHex,
        colorHex2: record.fields.colorHex2,
        colorHex3: record.fields.ColorHex3
    }));
    res.json(formatted);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});