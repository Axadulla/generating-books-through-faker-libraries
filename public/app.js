let page = 0;
let loading = false;
let batchSize = 50;
let totalLoaded = 0;
const bookBody = document.getElementById("bookBody");
const loadingIndicator = document.getElementById("loading");

function getParams() {
    return {
        language: document.getElementById("language").value,
        seed: document.getElementById("seed").value || "default",
        likes: parseFloat(document.getElementById("likes").value || 0),
        reviews: parseFloat(document.getElementById("reviews").value || 0),
    };
}

async function loadBooks() {
    if (loading) return;
    loading = true;
    loadingIndicator.classList.remove("hidden");

    const {language, seed, likes, reviews} = getParams();

    const res = await fetch(`/api/books.php?page=${page}&batchSize=${batchSize}&seed=${seed}&lang=${language}&likes=${likes}&reviews=${reviews}`);
    const books = await res.json();

    books.forEach((book, index) => {
        const row = document.createElement("tr");
        const bookNumber = totalLoaded + index + 1;

        row.classList.add("book-row");

        row.innerHTML = `
        <td class="p-2 relative">
            ${bookNumber}
            <button class="text-blue-500 ml-2 toggle-details">▼</button>
        </td>
        <td class="p-2">${book.isbn}</td>
        <td class="p-2">${book.title}</td>
        <td class="p-2">${book.authors.join(", ")}</td>
        <td class="p-2">${book.publisher}</td>
    `;

        bookBody.appendChild(row);

        const toggleBtn = row.querySelector('.toggle-details');

        toggleBtn.addEventListener('click', () => {
            const alreadyExpanded = row.classList.contains('expanded');


            const existingDetailRow = row.nextElementSibling;
            if (existingDetailRow && existingDetailRow.classList.contains('detail-row')) {
                existingDetailRow.remove();
            }


            document.querySelectorAll('.book-row').forEach(r => {
                r.classList.remove('bg-blue-100', 'expanded');
                const btn = r.querySelector('.toggle-details');
                if (btn) btn.textContent = '▼';
            });

            if (!alreadyExpanded) {

                const detailRow = document.createElement('tr');

                detailRow.classList.add('detail-row');
                detailRow.innerHTML = `
                <td colspan="5" class="bg-gray-100 p-4">
                    <div class="flex gap-6">
                        <img src="${book.cover}" alt="Cover" class="w-24 h-32 object-cover rounded shadow" />
                        <div>
                            <h2 class="text-lg font-semibold">${book.title}</h2>
                            <p><strong>ISBN:</strong> ${book.isbn}</p>
                            <p><strong>Authors:</strong> ${book.authors.join(", ")}</p>
                            <p><strong>Publisher:</strong> ${book.publisher}</p>
                            <p><strong>Likes:</strong> ${book.likes}</p>
                            <p class="mt-2"><strong>Reviews (${book.reviews.length}):</strong></p>
                            <ul class="list-disc list-inside max-h-40 overflow-auto text-sm">
                                ${book.reviews.map(r => `<li>💬 ${r.text} — <em>${r.author} (${r.company})</em></li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </td>
            `;
                row.after(detailRow);

                row.classList.add('bg-blue-100', 'expanded');
                toggleBtn.textContent = '▲';
            }
        });
    });

    totalLoaded += books.length;
    loadingIndicator.classList.add("hidden");
    loading = false;
    page++;

    if (page === 1) {
        batchSize = 10;
    }
}

document.getElementById("randomSeed").addEventListener("click", () => {
    document.getElementById("seed").value = Math.floor(Math.random() * 1e9).toString();
    resetAndReload();
});

["language", "seed", "likes", "reviews"].forEach(id => {
    document.getElementById(id).addEventListener("change", resetAndReload);
});

function resetAndReload() {
    bookBody.innerHTML = "";
    page = 0;
    totalLoaded = 0;
    batchSize = 50;
    loadBooks();
}


window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadBooks();
    }
});

loadBooks();
