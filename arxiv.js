document.addEventListener("DOMContentLoaded", fetchPapers);

async function fetchPapers() {
    const container = document.getElementById("papers-container");
    container.innerHTML = "<h2>Fetching papers...</h2>";

    try {
        console.log("Fetching papers.xml...");
        const response = await fetch("papers.xml"); // Load from stored XML instead of API

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const entries = xmlDoc.getElementsByTagName("entry");

        container.innerHTML = "<h2>Latest Papers</h2>";

        if (entries.length === 0) {
            container.innerHTML += "<p>No new papers found.</p>";
            return;
        }

        for (let entry of entries) {
            const title = entry.getElementsByTagName("title")[0]?.textContent || "No title";
            const authors = [...entry.getElementsByTagName("author")].map(a => a.textContent).join(", ");
            const summary = entry.getElementsByTagName("summary")[0]?.textContent || "No summary available";
            const pdfLink = entry.getElementsByTagName("id")[0]?.textContent || "#";

            const paperHTML = `
                <div class="paper">
                    <h3><a href="${pdfLink}" target="_blank">${title}</a></h3>
                    <p><strong>Authors:</strong> ${authors}</p>
                    <p>${summary}</p>
                </div>
                <hr>
            `;

            container.innerHTML += paperHTML;
        }

        console.log("Papers successfully loaded.");

    } catch (error) {
        container.innerHTML = "<p>Error fetching papers. Try again later.</p>";
        console.error("Error fetching arXiv data:", error);
    }
}
