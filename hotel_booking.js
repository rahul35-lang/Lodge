const ROOMS_DATA = [
    {
        id: 1,
        name: "Executive Royal Suite",
        price: 4500,
        floor: 2,
        image: "assets/room1.jpeg",
        description: "Experience premium royalty with expansive space, handcrafted teak furniture, and a private balcony.",
        specs: "King Bed • Balcony • AC"
    },
    {
        id: 2,
        name: "Deluxe Serenity Room",
        price: 2500,
        floor: 1,
        image: "assets/room2.jpeg",
        description: "A tranquil escape featuring ambient lighting and ergonomic design for deep relaxation.",
        specs: "Queen Bed • Work Desk • AC"
    },
    {
        id: 3,
        name: "Panoramic Skyline Suite",
        price: 6000,
        floor: 3,
        image: "assets/room3.jpeg",
        description: "The peak of luxury. Floor-to-ceiling windows offering a 360-degree view of the horizon.",
        specs: "King Bed • Skyline View • Mini Bar"
    },
    {
        id: 4,
        name: "Garden View Classic",
        price: 1800,
        floor: 1,
        image: "assets/room4.jpeg",
        description: "Cozy and convenient. Opens directly to our curated botanical garden. Perfect for fresh air lovers.",
        specs: "Twin Beds • Garden Access"
    },
    {
        id: 5,
        name: "Business Studio",
        price: 2200,
        floor: 2,
        image: "assets/room2.jpeg",
        description: "Designed for the modern professional. High-speed connectivity and a spacious workspace.",
        specs: "Queen Bed • High-Speed WiFi"
    }
];

let selectedRoom = null;

// Selectors
const grid = document.getElementById('roomsGrid');
const selectionBar = document.getElementById('selectionBar');
const selectedDisplay = document.getElementById('selectedRoomDisplay');
const countText = document.getElementById('roomCountText');

// Filters
const desktopSearch = document.getElementById('desktopSearch');
const floorSelect = document.getElementById('floorFilter');
const priceSelect = document.getElementById('priceFilter');
const mFloorSelect = document.getElementById('mobileFloorFilter');
const mPriceSelect = document.getElementById('mobilePriceFilter');

function init() {
    render(ROOMS_DATA);
}

function render(data) {
    grid.innerHTML = '';
    countText.textContent = `Found ${data.length} rooms matching your search`;

    data.forEach(room => {
        const card = document.createElement('div');
        card.className = 'room-card';
        card.innerHTML = `
            <div class="image-container">
                <img src="${room.image}" alt="${room.name}" onerror="this.src='https://via.placeholder.com/400x250?text=Pariwarik+Hotel'">
                <div class="badge">${room.specs}</div>
            </div>
            <div class="room-info">
                <h3>${room.name}</h3>
                <span class="room-location">Floor ${room.floor} • Pariwarik Property</span>
                <div class="room-price">Rs ${room.price.toLocaleString()}</div>
                <p class="room-desc">${room.description}</p>
                <button class="book-btn ${selectedRoom?.id === room.id ? 'selected' : ''}" 
                        onclick="handleBook(${room.id})">
                    ${selectedRoom?.id === room.id ? 'SELECTED ✓' : 'BOOK NOW'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function applyFilters() {
    const search = (window.innerWidth > 1024) ? desktopSearch.value.toLowerCase() : document.getElementById('roomSearch').value.toLowerCase();
    
    // Sync mobile and desktop values
    const floor = (window.innerWidth > 1024) ? floorSelect.value : mFloorSelect.value;
    const priceRange = (window.innerWidth > 1024) ? priceSelect.value : mPriceSelect.value;

    const filtered = ROOMS_DATA.filter(room => {
        const matchesSearch = room.name.toLowerCase().includes(search) || room.description.toLowerCase().includes(search);
        const matchesFloor = floor === 'all' || room.floor.toString() === floor;
        
        let matchesPrice = true;
        if (priceRange === '0-2000') matchesPrice = room.price <= 2000;
        else if (priceRange === '2000-4000') matchesPrice = room.price > 2000 && room.price <= 4000;
        else if (priceRange === '4000+') matchesPrice = room.price > 4000;

        return matchesSearch && matchesFloor && matchesPrice;
    });

    render(filtered);
}

window.handleBook = (id) => {
    const room = ROOMS_DATA.find(r => r.id === id);
    selectedRoom = room;
    
    selectedDisplay.textContent = `${room.name} (Floor ${room.floor})`;
    selectionBar.classList.remove('hidden');
    
    render(ROOMS_DATA); // Refresh to show checkmark
    applyFilters(); // Re-apply filters to keep current view
};

// Listeners
const roomSearch = document.getElementById('roomSearch');
[desktopSearch, roomSearch, floorSelect, priceSelect, mFloorSelect, mPriceSelect].forEach(el => {
    if (!el) return;
    el.addEventListener('change', applyFilters);
    el.addEventListener('input', applyFilters);
});

// Modal Logic
document.getElementById('proceedBtn').addEventListener('click', () => {
    document.getElementById('modalRoomName').value = `${selectedRoom.name} - Floor ${selectedRoom.floor}`;
    document.getElementById('bookingModal').classList.remove('hidden');
});

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('bookingModal').classList.add('hidden');
});

document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
        room: selectedRoom.name,
        customer: fd.get('name'),
        contact: fd.get('primary'),
        address: fd.get('address'),
        id: Date.now()
    };
    
    const existing = JSON.parse(localStorage.getItem('pariwarik_bookings') || 'new Array()');
    existing.push(data);
    localStorage.setItem('pariwarik_bookings', JSON.stringify(existing));

    document.getElementById('bookingModal').classList.add('hidden');
    document.getElementById('successOverlay').classList.remove('hidden');
});

document.getElementById('resetApp').addEventListener('click', () => {
    selectedRoom = null;
    selectionBar.classList.add('hidden');
    document.getElementById('successOverlay').classList.add('hidden');
    document.getElementById('bookingForm').reset();
    render(ROOMS_DATA);
});

init();