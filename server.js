import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // New

dotenv.config();

// Define paths for finding your files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

//Tell Express to serve any file in the main folder (like admin.html)
app.use(express.static(__dirname));

const port = process.env.PORT || 3000;

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

app.get("/inventory", async (req, res) => {
    const { data, error } = await supabase
        .from('colors')
        .select('*');

        if (error) {
            return res.status(500).json({ error: error.message});
        }
    
    const formatted = data.map(item => ({
        id: item.id,
        color: item.color,
        finish: item.finish,
        description: item.description,
        inStock: item.inStock,
        colorHex1: item.colorHex1,
        colorHex2: item.colorHex2,
        colorHex3: item.colorHex3
    }));

    res.json(formatted);
});

app.post("/inventory", async (req, res) => {
    try {
        const { color, finish, description, inStock, colorHex1, colorHex2, colorHex3 } = req.body;

        const { data, error } = await supabase
            .from('colors')
            .insert([{ color, finish, description, inStock, colorHex1, colorHex2, colorHex3 }])
            .select();

        if (error) {
            console.error("Supabase error:", error);
            return res.status(400).json(error);
        }

        res.json(data);
    }  catch (err) {
        console.error("Server crash:", err);
        res.status(500).json({error: "Internal Server Error" });
    }
});

// Make sure the home page loads index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});