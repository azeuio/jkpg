let currentPage = 1;
function loadPage() {
    console.log("hello")
    const pageNumber = document.getElementById('page-number');
    if (pageNumber) {
        currentPage = Number.parseInt(pageNumber.innerText)
    } else {
        currentPage = 1
    }
    fetchVenues(currentPage)
}
loadPage()

async function fetchVenues(page = 1) {
    page = Math.max(1, page)
    const response = await fetch(`http://localhost:3001/api/v1/venue/get?page=${page}`);
    const data = await response.json();

    console.log("response ", response.ok, " ", response.status)
    if (response.ok) {
        const pageNumber = document.getElementById('page-number');
        if (pageNumber) {
            pageNumber.innerText = page
        }
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
    const pageNumber = document.getElementById('page-number');
    if (pageNumber) {
        currentPage = Number.parseInt(pageNumber.innerText)
    }
    fetchVenues(currentPage + 1);
}

function prevPage() {
    const pageNumber = document.getElementById('page-number');
    if (pageNumber) {
        currentPage = Number.parseInt(pageNumber.innerText)
    }
    fetchVenues(currentPage - 1);
}

async function addVenue() {
    const name = document.getElementById('name').value;
    const url = document.getElementById('url').value;
    const district = document.getElementById('district').value;
    await fetch('http://localhost:3001/api/v1/venue/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, district })
    });
    fetchVenues(currentPage);
}

async function deleteVenue(id) {
    await fetch(`http://localhost:3001/api/v1/venue/delete/${id}`, { method: 'DELETE' });
    fetchVenues(currentPage);
}

async function login(event) {
    const fd = new FormData(event.target)
    const username = fd.get("username")
    const password = fd.get("password")
    const response = await fetch("http://localhost:3001/api/v1/user/login",
        {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        }
    )
    if (response.ok) {
        const form = document.getElementById("form-add")
        if (form) {
            form.hidden = false
        }
    }
}

async function register(event) {
    const fd = new FormData(event.target)
    const username = fd.get("username")
    const password = fd.get("password")
    await fetch("http://localhost:3001/api/v1/user/create",
        {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        }
    )
}

async function editVenue(id) {
    const name = document.getElementById(`name-${id}`).value;
    const url = document.getElementById(`url-${id}`).value;
    const district = document.getElementById(`district-${id}`).value;

    if (!name || !url || !district) {
        alert('All fields are required for editing');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/api/v1/venue/update/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, url, district })
        });

        if (response.ok) {
            alert('Venue updated successfully');
            fetchVenues(currentPage);
        } else {
            alert('Error updating the venue');
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error while updating');
    }
}
