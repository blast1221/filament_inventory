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

const port = process.env.PORT || 10000;

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
            .insert([{ 
                "color": color,
                "finish": finish,
                "description": description,
                "inStock": inStock,
                "colorHex1": colorHex1,
                "colorHex2": colorHex2, 
                "colorHex3": colorHex3
            }])
            .select();

        if (error) return res.status(400).json(error);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.patch('/inventory/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
        .from('colors')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error("Update error:", error);
        return res.status(400).json(error);
    }

    res.json({ message: "Update successful", data });
});

app.delete('/inventory/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('colors')
        .delete()
        .eq('id', id);

    if (error) return res.status(400).json(error);
    res.json({ message: "Deleted successfully" });
});

//Tell Express to serve any file in the main folder (like admin.html)
app.use(express.static(__dirname));

// Make sure the home page loads index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});