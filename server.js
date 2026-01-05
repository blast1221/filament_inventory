import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from 'helmet';

dotenv.config();

// Define paths for finding your files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(express.json());
app.use(express.static(__dirname));

const adminAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const secretKey = process.env.ADMIN_SECRET_KEY;

    if (apiKey && apiKey === secretKey) {
        next();
    } else {
        res.status(403).json({ error: "Unauthorized: Incorrect or missing Secret Key"});
    }
};

const port = process.env.PORT || 10000;

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// -- ROUTES -- //

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

app.post("/inventory", adminAuth, async (req, res) => {
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

app.patch('/inventory/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    console.log(`Applying updates to ID ${id}:`, updates);

    const { data, error } = await supabase
        .from('colors')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error("Update error:", error);
        return res.status(400).json(error);
    }

    console.log("Database result:", data);
    res.json({ message: "Update successful", data });
});

app.delete('/inventory/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('colors')
        .delete()
        .eq('id', id);

    if (error) return res.status(400).json(error);
    res.json({ message: "Deleted successfully" });
});

// Make sure the home page loads index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});