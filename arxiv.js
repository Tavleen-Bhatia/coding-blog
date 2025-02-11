document.addEventListener("DOMContentLoaded", () => fetchPapers(false));

async function fetchPapers(isSearch) {
    const container = document.getElementById("papers-container");
    container.innerHTML = "<h2>Fetching papers...</h2>";
    
    let apiUrl = "papers.xml"; // Default: Use daily updated list

    if (isSearch) {
        // Fetch from arXiv API based on user input
        const keyword = document.getElementById("keywordInput").value.trim();
        if (!keyword) {
            container.innerHTML = "<p>Please enter a keyword.</p>";
            return;
        }
        apiUrl = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(keyword)}&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending`;
    }

    try {
        console.log(`Fetching from: ${apiUrl}`);
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const entries = xmlDoc.getElementsByTagName("entry");

        container.innerHTML = `<h2>${isSearch ? "Search Results" : "Latest Papers (Auto-updated daily)"}</h2>`;

        if (entries.length === 0) {
            container.innerHTML += "<p>No papers found.</p>";
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
        container.innerHTML = `<p>Error fetching papers: ${error.message}</p>`;
        console.error("Error fetching arXiv data:", error);
    }
}
