const AIRTABLE_BASE_ID = "appaIyvVMcEBkk3qr";
const AIRTABLE_TABLE_NAME = "Inventory Items";


async function loadInventory() {
    try {
        const response = await fetch (
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
            {
                
            }
        );
        const data = await response.json();

        window.cachedItems = data.records.map(record => ({
            color: record.fields.Color,
            finish: record.fields.Finish,
            description: record.fields.Description,
            image: record.fields.Image || "images/placeholder.jpg",
            inStock: record.fields.inStock || false
        }));

        renderInventory(window.cachedItems);
    } catch (err) {
        console.error("Error loading inventory:", err);
    }
}

function renderInventory(items) {
    const container = document.getElementById("inventory");
    container.innerHTML = "";

    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "inventory-item";
        div.innerHTML = `
            <img src="${item.image}" alt="${item.color}">
            <h3>${item.color || "Unknown Color"} ${item.inStock ? "" : "(Out of Stock)"}</h3>
            <p>Finish: ${item.finish || "Unknown Finish"}</p>
            <p>${item.description || ""}</p>
            `;
            container.appendChild(div);
    });
}


function showFinish(finishType) {
    const allItems = window.cachedItems || [];
    const filtered = 
        finishType === "All"
            ? allItems
            : allItems.filter(item => item.finish === finishType);
    renderInventory(filtered);
}

window.addEventListener("DOMContentLoaded", loadInventory);