import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

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
    const { name, finish, description, inStock, colorHex1 } = req.body;

    const { data, error } = await supabase
        .from('colors')
        .insert([{ name, finish, description, inStock, colorHex1 }])
        .select();

    if (error) return res.status(500).json(error);
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});