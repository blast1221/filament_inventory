function loadGlobalFooter() {
    const version = "v1.4.9";
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString(undefined, options);

    const footerHTML = `
        <footer style="text-align: center; padding: 30px; margin-top: 50px; border-top: 1px solid #eee; color: #777; font-size: 0.85em; font-family: 'Inter', sans-serif;">
            <p>© ${now.getFullYear()} C3DW | <span style="color: #bbb;">${version}</span> | Last Updated: ${dateString}</p>
        </footer>
        `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

window.addEventListener("DOMContentLoaded", loadGlobalFooter);