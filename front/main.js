let currentPage = 1;

async function fetchVenues(page = 1) {
    const response = await fetch(`http://localhost:3001/api/v1/venue/get?page=${page}`);
    const data = await response.json();

    if (response.ok) {
        const venues = data.venues;
        const venueContainer = document.getElementById('venues');
        venueContainer.innerHTML = venues.map(v => `
            <div class="p-4 border rounded bg-gray-100 flex justify-between items-center">
                <div>
                    <h3 class="text-lg font-semibold">${v.name}</h3>
                    <p><a href="${v.url}" target="_blank" class="text-blue-500">${v.url}</a></p>
                    <p>District: ${v.district}</p>
                </div>
                <button onclick="deleteVenue('${v._id}')" class="bg-red-500 text-white p-2">Delete</button>
            </div>
        `).join('');

        updatePagination(page);
    } else {
        alert('Error fetching venues');
    }
}

function updatePagination(page) {
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    
    prevButton.disabled = page <= 1;
    nextButton.disabled = page >= totalPages;

    currentPage = page;
}

function nextPage() {
    fetchVenues(currentPage + 1);
}

function prevPage() {
    fetchVenues(currentPage - 1);
}

async function addVenue() {
    const name = document.getElementById('name').value;
    const url = document.getElementById('url').value;
    const district = document.getElementById('district').value;
    await fetch('/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, district })
    });
    fetchVenues(currentPage);
}

async function deleteVenue(id) {
    await fetch(`/venues/${id}`, { method: 'DELETE' });
    fetchVenues(currentPage); 
}

fetchVenues(currentPage);
