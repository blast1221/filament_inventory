Crafted 3D Printing – Filament Inventory Site
A web-based inventory and gallery for managing 3D printing filament and showcasing printed projects. Built with HTML, CSS, and modular JavaScript, with Airtable integration for live inventory data.

📂 Project Structure
index.html – Home/About Me page

inventory.html – Inventory display with Airtable fetch + filter buttons

gallery.html – Gallery of printed objects

contact.html – Contact form/info

style.css – Global styles

/js – Page-specific scripts

home.js – Enhancements for index.html

inventory.js – Airtable fetch, render, filter logic

gallery.js – Gallery display logic

contact.js – Form validation/submission

/images – Filament images + placeholder

/gallery – Printed object photos

favicon.ico – Browser tab icon

🚀 Getting Started
Clone or download this repository.

Open the project in VS Code (or your editor of choice).

Run with Live Server or open index.html directly in a browser.

For inventory data, configure Airtable:

Create a base with fields: Color, Finish, Description, Image, inStock.

Update YOUR_BASE_ID and YOUR_API_KEY in js/inventory.js.

🛠 Features
Top navigation bar for clean site-wide navigation.

Inventory page connected to Airtable with filtering by finish type.

Gallery page for showcasing printed projects.

Contact page for inquiries.

Responsive design with modular CSS and JS.

📌 Notes
Legacy files (inventory.csv, inventory.json, json-to-csv.js) are archived and not required if Airtable is live.

Ensure favicon.ico is in the root folder for proper browser tab display.

Use .gitignore to exclude node_modules and other non-essential files from version control.