document.addEventListener("DOMContentLoaded", fetchPapers);

async function fetchPapers() {
    const container = document.getElementById("papers-container");
    container.innerHTML = "<h2>Fetching papers...</h2>";

    const keywords = "machine+learning"; // Change this to your preferred topic
    const apiUrl = `http://export.arxiv.org/api/query?search_query=all:${keywords}&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending`;

    try {
        console.log("Fetching papers.xml...")
        const response = await fetch(apiUrl);
        const text = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const entries = xmlDoc.getElementsByTagName("entry");

        container.innerHTML = "<h2>Latest Papers</h2>";

        for (let entry of entries) {
            const title = entry.getElementsByTagName("title")[0].textContent;
            const authors = [...entry.getElementsByTagName("author")].map(a => a.textContent).join(", ");
            const summary = entry.getElementsByTagName("summary")[0].textContent;
            const pdfLink = entry.getElementsByTagName("id")[0].textContent;

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
    } catch (error) {
        container.innerHTML = "<p>Error fetching papers. Try again later.</p>";
        console.error("Error fetching arXiv data:", error);
    }
}
