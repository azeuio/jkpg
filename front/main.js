let loggedIn = false
let currentPage = 1;
let sortType = "name"
let sortOrder = 1
function loadPage() {
    const storedLoggedIn = localStorage.getItem('loggedIn');
    if (storedLoggedIn === 'true') {
        loggedIn = true;
    } else {
        loggedIn = false;
    }
    const pageNumber = document.getElementById('page-number');
    if (pageNumber) {
        currentPage = Number.parseInt(pageNumber.innerText)
    } else {
        currentPage = 1
    }
    fetchVenues(currentPage)
}
loadPage()

async function updateSort(event) {
    if (event.target.name == "sort-name") {
        sortType = event.target.value
    } else if (event.target.name == "sort-order") {
        sortOrder = event.target.value
    }
    await fetchVenues(currentPage)
}

async function fetchVenues(page = 1) {
    page = Math.max(1, page);
    const elem = document.getElementById('sort');
    sortType = elem.value
    console.log({ sortType })
    const response = await fetch(`http://localhost:3001/api/v1/venue/get?` + new URLSearchParams({
        page: page,
        nom: sortType,
        value: sortOrder
    }));
    const data = await response.json();

    console.log("response ", response.ok, " ", response.status);
    if (response.ok) {
        const pageNumber = document.getElementById('page-number');
        if (pageNumber) {
            pageNumber.innerText = page;
        }
        const venues = data.venues;
        const venueContainer = document.getElementById('venues');
        venueContainer.innerHTML = venues.map(v => `
            <div id="venue-${v._id}" class="venue-item p-4 border rounded bg-gray-100 flex justify-between items-center">
                <div class="venue-info">
                    <h3 class="text-lg font-semibold">${v.name}</h3>
                    <p><a href="${v.url}" target="_blank" class="text-blue-500">${v.url}</a></p>
                    <p>District: ${v.district}</p>
                </div>
                <div class="venue-actions flex space-x-2"> <!-- Flex container for the buttons -->
                    <div>
                <button onclick="showEditForm('${v._id}', '${v.name}', '${v.url}', '${v.district}')" ${loggedIn ? "" : "hidden"} class="edit-button p-2 bg-blue-500 text-white p-2">Edit</button>
                    <button onclick="deleteVenue('${v._id}')" ${loggedIn ? "" : "hidden"} class="delete-button bg-red-500 text-white p-2">Delete</button>
                </div>
                </div>
                <!-- Form for editing a venue, hidden by default -->
                <form id="edit-form-${v._id}" class="edit-form" hidden>
                    <input type="text" id="edit-name-${v._id}" placeholder="Name" value="${v.name}" required>
                    <input type="text" id="edit-url-${v._id}" placeholder="URL" value="${v.url}" required>
                    <input type="text" id="edit-district-${v._id}" placeholder="District" value="${v.district}" required>
                    <button type="submit" class="bg-blue-500 text-white p-2">Save Changes</button>
                    <button type="button" onclick="hideEditForm('${v._id}')" class="bg-gray-500 text-white p-2">Cancel</button>
                </form>
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
        loggedIn = true
        localStorage.setItem('loggedIn', 'true');
        const form = document.getElementById("form-add")
        if (form) {
            form.hidden = false
            form.focus()
        }
        for (const deleteButton of document.getElementsByClassName("delete-button")) {
            deleteButton.hidden = false
        }
        for (const deleteButton of document.getElementsByClassName("edit-button")) {
            deleteButton.hidden = false
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

function showEditForm(id, name, url, district) {
    const editForm = document.getElementById(`edit-form-${id}`);
    const venueDiv = document.getElementById(`venue-${id}`);

    document.getElementById(`edit-name-${id}`).value = name;
    document.getElementById(`edit-url-${id}`).value = url;
    document.getElementById(`edit-district-${id}`).value = district;

    editForm.hidden = false;
    venueDiv.appendChild(editForm);
}

async function editVenue(id) {
    const name = document.getElementById(`edit-name-${id}`).value;
    const url = document.getElementById(`edit-url-${id}`).value;
    const district = document.getElementById(`edit-district-${id}`).value;

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
            hideEditForm(id);
        } else {
            alert('Error updating the venue');
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error while updating');
    }
}

function hideEditForm(id) {
    const editForm = document.getElementById(`edit-form-${id}`);
    editForm.hidden = true;
}
