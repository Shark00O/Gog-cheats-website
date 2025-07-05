// Global variables
let allGames = [];
let currentGames = [];

// DOM elements
const gamesGrid = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const genreFilter = document.getElementById('genreFilter');
const platformFilter = document.getElementById('platformFilter');
const uploadForm = document.getElementById('uploadForm');
const gameModal = document.getElementById('gameModal');
const noGamesDiv = document.getElementById('noGames');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadGames();
    initializeSearch();
    initializeUploadForm();
    initializeModal();
    initializeFileInputs();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Update active navigation on scroll
    window.addEventListener('scroll', updateActiveNavigation);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function updateActiveNavigation() {
    const sections = ['home', 'games', 'upload', 'about'];
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (section && navLink) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => 
                    link.classList.remove('active')
                );
                navLink.classList.add('active');
            }
        }
    });
}

// Games loading and display
async function loadGames() {
    try {
        showLoading();
        const response = await fetch('/api/games');
        allGames = await response.json();
        currentGames = [...allGames];
        displayGames(currentGames);
        hideLoading();
    } catch (error) {
        console.error('Error loading games:', error);
        hideLoading();
        showNoGames();
    }
}

function displayGames(games) {
    if (games.length === 0) {
        showNoGames();
        return;
    }
    
    hideNoGames();
    
    gamesGrid.innerHTML = games.map(game => createGameCard(game)).join('');
    
    // Add click handlers to game cards
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach((card, index) => {
        card.addEventListener('click', () => openGameModal(games[index]));
        card.classList.add('fade-in');
    });
}

function createGameCard(game) {
    const imageUrl = game.files.logo || game.files.screenshots[0] || null;
    const uploadDate = new Date(game.uploadDate).toLocaleDateString();
    
    return `
        <div class="game-card" data-game-id="${game.id}">
            <div class="game-image">
                ${imageUrl ? 
                    `<img src="${imageUrl}" alt="${game.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                     <i class="fas fa-gamepad" style="display: none;"></i>` : 
                    `<i class="fas fa-gamepad"></i>`
                }
            </div>
            <div class="game-info">
                <h3 class="game-title">${escapeHtml(game.title)}</h3>
                <p class="game-developer">by ${escapeHtml(game.developer)}</p>
                <p class="game-description">${escapeHtml(game.description)}</p>
                <div class="game-meta">
                    <span class="game-genre">${escapeHtml(game.genre)}</span>
                    <span class="game-downloads">
                        <i class="fas fa-download"></i> ${game.downloads}
                    </span>
                </div>
                <div class="game-meta" style="margin-top: 0.5rem;">
                    <span>${escapeHtml(game.platform)}</span>
                    <span>${uploadDate}</span>
                </div>
            </div>
        </div>
    `;
}

function showLoading() {
    gamesGrid.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading awesome games...</p>
        </div>
    `;
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

function showNoGames() {
    hideLoading();
    gamesGrid.innerHTML = '';
    noGamesDiv.style.display = 'block';
}

function hideNoGames() {
    noGamesDiv.style.display = 'none';
}

// Search and filtering
function initializeSearch() {
    searchInput.addEventListener('input', debounce(performSearch, 300));
    genreFilter.addEventListener('change', performSearch);
    platformFilter.addEventListener('change', performSearch);
}

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedGenre = genreFilter.value;
    const selectedPlatform = platformFilter.value;
    
    let filteredGames = [...allGames];
    
    // Text search
    if (query) {
        filteredGames = filteredGames.filter(game =>
            game.title.toLowerCase().includes(query) ||
            game.description.toLowerCase().includes(query) ||
            game.developer.toLowerCase().includes(query)
        );
    }
    
    // Genre filter
    if (selectedGenre && selectedGenre !== 'all') {
        filteredGames = filteredGames.filter(game =>
            game.genre.toLowerCase() === selectedGenre.toLowerCase()
        );
    }
    
    // Platform filter
    if (selectedPlatform && selectedPlatform !== 'all') {
        filteredGames = filteredGames.filter(game =>
            game.platform.toLowerCase() === selectedPlatform.toLowerCase()
        );
    }
    
    currentGames = filteredGames;
    displayGames(currentGames);
}

// Upload form handling
function initializeUploadForm() {
    uploadForm.addEventListener('submit', handleUpload);
}

async function handleUpload(e) {
    e.preventDefault();
    
    const formData = new FormData();
    const formElements = uploadForm.elements;
    
    // Add text fields
    formData.append('title', formElements.title.value);
    formData.append('developer', formElements.developer.value);
    formData.append('description', formElements.description.value);
    formData.append('genre', formElements.genre.value);
    formData.append('platform', formElements.platform.value);
    formData.append('version', formElements.version.value || '1.0');
    
    // Add files
    if (formElements.gameFile.files[0]) {
        formData.append('gameFile', formElements.gameFile.files[0]);
    }
    
    if (formElements.logo.files[0]) {
        formData.append('logo', formElements.logo.files[0]);
    }
    
    // Add screenshots
    for (let i = 0; i < formElements.screenshot.files.length; i++) {
        formData.append('screenshot', formElements.screenshot.files[i]);
    }
    
    try {
        showUploadProgress();
        
        const response = await fetch('/api/games', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        hideUploadProgress();
        
        if (response.ok) {
            showUploadSuccess();
            uploadForm.reset();
            resetFileInputs();
            
            // Reload games to show the new upload
            setTimeout(() => {
                loadGames();
                scrollToSection('games');
            }, 2000);
        } else {
            throw new Error(result.error || 'Upload failed');
        }
    } catch (error) {
        hideUploadProgress();
        showUploadError(error.message);
    }
}

function showUploadProgress() {
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadSuccess = document.getElementById('uploadSuccess');
    
    uploadForm.style.display = 'none';
    uploadProgress.style.display = 'block';
    uploadSuccess.style.display = 'none';
    
    // Simulate progress
    const progressFill = document.querySelector('.progress-fill');
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 10;
        if (width >= 90) {
            clearInterval(interval);
            width = 90;
        }
        progressFill.style.width = width + '%';
    }, 200);
}

function hideUploadProgress() {
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.querySelector('.progress-fill');
    
    progressFill.style.width = '100%';
    setTimeout(() => {
        uploadProgress.style.display = 'none';
    }, 500);
}

function showUploadSuccess() {
    const uploadSuccess = document.getElementById('uploadSuccess');
    uploadSuccess.style.display = 'block';
    uploadSuccess.classList.add('fade-in');
    
    setTimeout(() => {
        uploadSuccess.style.display = 'none';
        uploadForm.style.display = 'flex';
    }, 3000);
}

function showUploadError(message) {
    alert('Upload failed: ' + message);
    uploadForm.style.display = 'flex';
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('gameModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', closeGameModal);
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeGameModal();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeGameModal();
        }
    });
}

function openGameModal(game) {
    const modal = document.getElementById('gameModal');
    const gameDetails = document.getElementById('gameDetails');
    
    gameDetails.innerHTML = createGameModalContent(game);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add download button functionality
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => downloadGame(game.id));
    }
}

function closeGameModal() {
    const modal = document.getElementById('gameModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function createGameModalContent(game) {
    const imageUrl = game.files.logo || game.files.screenshots[0] || null;
    const uploadDate = new Date(game.uploadDate).toLocaleDateString();
    
    const screenshotsHtml = game.files.screenshots.length > 0 ? `
        <div class="game-screenshots" style="margin: 2rem 0;">
            <h3 style="color: #4ecdc4; margin-bottom: 1rem;">Screenshots</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                ${game.files.screenshots.map(screenshot => `
                    <img src="${screenshot}" alt="Screenshot" style="width: 100%; border-radius: 8px; cursor: pointer;" 
                         onclick="window.open('${screenshot}', '_blank')">
                `).join('')}
            </div>
        </div>
    ` : '';
    
    return `
        <div class="game-modal-content">
            <div style="display: grid; grid-template-columns: 300px 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div class="game-modal-image" style="height: 200px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    ${imageUrl ? 
                        `<img src="${imageUrl}" alt="${game.title}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                        `<i class="fas fa-gamepad" style="font-size: 3rem; color: rgba(255, 255, 255, 0.8);"></i>`
                    }
                </div>
                <div class="game-modal-info">
                    <h2 style="color: #4ecdc4; margin-bottom: 0.5rem; font-size: 2rem;">${escapeHtml(game.title)}</h2>
                    <p style="color: #cccccc; margin-bottom: 1rem; font-size: 1.1rem;">by ${escapeHtml(game.developer)}</p>
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                        <span class="game-genre" style="background: rgba(78, 205, 196, 0.2); color: #4ecdc4; padding: 0.5rem 1rem; border-radius: 6px;">${escapeHtml(game.genre)}</span>
                        <span style="background: rgba(255, 107, 107, 0.2); color: #ff6b6b; padding: 0.5rem 1rem; border-radius: 6px;">${escapeHtml(game.platform)}</span>
                        <span style="color: #cccccc; padding: 0.5rem 1rem;">v${escapeHtml(game.version)}</span>
                    </div>
                    <div style="display: flex; gap: 2rem; margin-bottom: 1rem; color: #888888; font-size: 0.9rem;">
                        <span><i class="fas fa-download"></i> ${game.downloads} downloads</span>
                        <span><i class="fas fa-calendar"></i> ${uploadDate}</span>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="color: #4ecdc4; margin-bottom: 1rem;">Description</h3>
                <p style="color: #cccccc; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(game.description)}</p>
            </div>
            
            ${screenshotsHtml}
            
            <div style="text-align: center; padding-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                ${game.files.game ? 
                    `<button id="downloadBtn" class="btn btn-primary btn-large" style="font-size: 1.2rem; padding: 1rem 2rem;">
                        <i class="fas fa-download"></i> Download Game
                    </button>` :
                    `<p style="color: #888888;">Download not available</p>`
                }
            </div>
        </div>
    `;
}

async function downloadGame(gameId) {
    try {
        window.open(`/api/games/${gameId}/download`, '_blank');
    } catch (error) {
        console.error('Download error:', error);
        alert('Download failed. Please try again.');
    }
}

// File input handling
function initializeFileInputs() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateFileInputDisplay(this);
        });
    });
}

function updateFileInputDisplay(input) {
    const container = input.closest('.file-input-container');
    const display = container.querySelector('.file-input-display span');
    
    if (input.files.length > 0) {
        if (input.multiple) {
            display.textContent = `${input.files.length} file(s) selected`;
        } else {
            display.textContent = input.files[0].name;
        }
        container.style.borderColor = '#4ecdc4';
        container.style.background = 'rgba(78, 205, 196, 0.1)';
    } else {
        // Reset to original text
        const originalTexts = {
            'gameFile': 'Choose game file',
            'logo': 'Choose logo',
            'screenshot': 'Choose screenshots'
        };
        display.textContent = originalTexts[input.name] || 'Choose file';
        container.style.borderColor = 'rgba(78, 205, 196, 0.3)';
        container.style.background = 'rgba(255, 255, 255, 0.05)';
    }
}

function resetFileInputs() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.value = '';
        updateFileInputDisplay(input);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Add some sample games for demonstration (this would normally come from uploads)
function addSampleGames() {
    const sampleGames = [
        {
            id: 'sample-1',
            title: 'Pixel Adventure',
            developer: 'Indie Studio',
            description: 'A retro-style platformer with challenging levels and beautiful pixel art. Jump through dangerous obstacles and collect treasures in this nostalgic adventure.',
            genre: 'adventure',
            platform: 'pc',
            version: '1.2',
            uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            downloads: 1250,
            rating: 4.5,
            reviews: [],
            files: {
                game: null,
                logo: null,
                screenshots: []
            }
        },
        {
            id: 'sample-2',
            title: 'Space Defender',
            developer: 'Cosmic Games',
            description: 'Defend Earth from alien invaders in this intense space shooter. Upgrade your ship and battle through waves of enemies.',
            genre: 'action',
            platform: 'pc',
            version: '2.0',
            uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            downloads: 890,
            rating: 4.2,
            reviews: [],
            files: {
                game: null,
                logo: null,
                screenshots: []
            }
        },
        {
            id: 'sample-3',
            title: 'Puzzle Master',
            developer: 'Brain Games Ltd',
            description: 'Challenge your mind with hundreds of unique puzzles. Perfect for casual gaming sessions.',
            genre: 'puzzle',
            platform: 'web',
            version: '1.0',
            uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            downloads: 567,
            rating: 4.8,
            reviews: [],
            files: {
                game: null,
                logo: null,
                screenshots: []
            }
        }
    ];
    
    // Add sample games only if no games exist
    if (allGames.length === 0) {
        allGames = sampleGames;
        currentGames = [...allGames];
        displayGames(currentGames);
    }
}

// Load sample games if needed (for demo purposes)
setTimeout(() => {
    if (allGames.length === 0) {
        addSampleGames();
    }
}, 1000);