// Constants
const STORAGE_KEY = 'photo_gallery_data';
const THEME_KEY = 'theme';

// DOM Elements
const gallery = document.getElementById('gallery');
const fileInput = document.getElementById('photo-upload');
const themeToggle = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadPhotos();
});

// --- Theme Logic ---
function loadTheme() {
    const currentTheme = localStorage.getItem(THEME_KEY);
    if (currentTheme === 'light') {
        rootElement.classList.add('light-mode');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
}

themeToggle.addEventListener('click', () => {
    rootElement.classList.toggle('light-mode');
    if (rootElement.classList.contains('light-mode')) {
        localStorage.setItem(THEME_KEY, 'light');
        themeToggle.textContent = '☀️';
    } else {
        localStorage.setItem(THEME_KEY, 'dark');
        themeToggle.textContent = '🌙';
    }
});

// --- Photo Gallery Logic ---

// Event Listener for File Upload
fileInput.addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
    }

    // Validate file size (e.g., max 2MB to respect LocalStorage limits)
    if (file.size > 2 * 1024 * 1024) {
        alert('File size is too large! Please upload an image smaller than 2MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result; // Base64 string
        savePhoto(imageData);
        renderPhoto(imageData);
    };
    reader.readAsDataURL(file);
    
    // Reset input so same file can be selected again if needed
    event.target.value = '';
}

function savePhoto(imageData) {
    let photos = getStoredPhotos();
    photos.unshift(imageData); // Add new photo to the beginning
    
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch (e) {
        alert('Storage full! Please delete some photos or clear your cache.');
        photos.shift(); // Remove the failed entry
    }
}

function getStoredPhotos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function loadPhotos() {
    const photos = getStoredPhotos();
    gallery.innerHTML = ''; // Clear placeholder

    if (photos.length === 0) {
        gallery.innerHTML = `
            <div class="gallery-item placeholder">
                <p>No photos yet. Add some!</p>
            </div>
        `;
        return;
    }

    photos.forEach(photo => {
        renderPhoto(photo, false); // false = append to end (since we loop through saved order)
    });
}

function renderPhoto(imageData, prepend = true) {
    // Remove placeholder if it exists
    const placeholder = gallery.querySelector('.placeholder');
    if (placeholder) {
        placeholder.remove();
    }

    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.src = imageData;
    img.alt = 'User uploaded photo';
    img.loading = 'lazy';

    item.appendChild(img);

    if (prepend) {
        gallery.prepend(item);
    } else {
        gallery.appendChild(item);
    }
}
