async function fetchVenues() {
    const response = await fetch('/venues');
    const venues = await response.json();
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
    fetchVenues();
}

async function deleteVenue(id) {
    await fetch(`/venues/${id}`, { method: 'DELETE' });
    fetchVenues();
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (response.ok) {
        alert('Logged in successfully');
    } else {
        alert('Invalid credentials');
    }
}

async function logout() {
    await fetch('/auth/logout', { method: 'POST' });
    alert('Logged out');
}

fetchVenues();