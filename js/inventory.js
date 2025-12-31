async function loadInventory() {
    try {
        const response = await fetch ("https://filament-inventory.onrender.com/inventory");
        const data = await response.json();

        const allItems = data.map(record => ({
            id: record.id,
            color: record.color || "",
            finish: record.finish || "",
            description: record.description || "",
            colorHex1: record.colorHex1 || "",
            colorHex2: record.colorHex2 || "",
            colorHex3: record.colorHex3 || "",
            inStock: record.inStock === true
        }));
        
        const inStockItems = allItems.filter(item => item.inStock === true);

        inStockItems.sort((a, b) => a.color.localeCompare(b.color));
        
        window.cachedItems = inStockItems;

        renderInventory(inStockItems);
    } catch (err) {
        console.error("Error loading inventory:", err);
    }
}

function getSwatchStyle(item) {
    const c1 = item.colorHex1;
    const c2 = item.colorHex2;
    const c3 = item.colorHex3;

    if (c1 && !c2) {
        return `background-color: ${c1};`;
    }

    if (c1 && c2 && !c3) {
        return `
            background: linear-gradient(
            to right,
            ${c1} 50%,
            ${c2} 50%
            );
        `;
    }

    if (c1 && c2 && c3) {
        return `
            background: linear-gradient(
                to right,
                ${c1} 33%,
                ${c2} 33%,
                ${c2} 66%,
                ${c3} 66%
            );
        `;
    }

    return `background-color: #ccc;`;
}

function renderInventory(items) {
    const container = document.getElementById("inventory");
    if (!container) {
        console.error("No element with id 'inventory' found in the DOM.");
        return;
    }

    container.innerHTML = "";

    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "inventory-item";
        div.innerHTML = `
            <div class="swatch" style="${getSwatchStyle(item)}"></div>
            <h3>${item.color || "Unknown Color"}</h3>
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

document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const allItems = window.cachedItems || [];

    const filtered = allItems.filter(item => {
        return (
            item.color.toLowerCase().includes(term) ||
            item.finish.toLowerCase().includes(term) ||
            (item.description && item.description.toLowerCase().includes(term))
        );
    });

    renderInventory(filtered);
});

document.getElementById('refreshBtn').addEventListener('click', async () => {
    const btn = document.getElementById('refreshBtn');
    const originalText = btn.innerText;

    btn.innerText = "Syncing...";
    btn.disabled = true;

    await loadInventory();

    btn.innerText = originalText;
    btn.disabled = false;
    document.getElementById('searchInput').value = "";
});