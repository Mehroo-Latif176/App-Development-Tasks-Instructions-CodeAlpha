// 10 Songs Array
const songs = [
    {
        title: "Creative Minds",
        artist: "Bensound",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Sunny Drive",
        artist: "SoundHelix",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Ocean Waves",
        artist: "SoundHelix",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Midnight City",
        artist: "SoundHelix",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Forest Trail",
        artist: "SoundHelix",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        cover: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Summer Walk",
        artist: "SoundHelix",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Acoustic Vibe",
        artist: "SoundHelix",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        cover: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Electronic Pulse",
        artist: "SoundHelix",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        cover: "https://images.unsplash.com/photo-1483032469466-b937c425697b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Chill Lofi",
        artist: "SoundHelix",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Epic Journey",
        artist: "SoundHelix",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
];

// DOM Elements
const carousel = document.getElementById('carousel');
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const miniCover = document.getElementById('mini-cover');
const miniTitle = document.getElementById('mini-title');
const miniArtist = document.getElementById('mini-artist');
const mainSubtitle = document.getElementById('main-subtitle');
const visualizer = document.getElementById('visualizer');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const muteBtn = document.getElementById('mute-btn');
const volumeSlider = document.getElementById('volume-slider');
const bgContainer = document.getElementById('bg-container');

// New UI Elements
const queueBtn = document.getElementById('queue-btn');
const castBtn = document.getElementById('cast-btn');
const playlistOverlay = document.getElementById('playlist-overlay');
const playlistList = document.getElementById('playlist-list');
const closePlaylistBtn = document.getElementById('close-playlist');
const toast = document.getElementById('toast');

let currentIndex = 0;
let isPlaying = false;
let isCasting = false;
let cards = [];

// Initialize
function init() {
    renderCarousel();
    renderPlaylist();
    loadSong(currentIndex);
    updateCarouselClasses();
}

// Render all cards in the carousel
function renderCarousel() {
    carousel.innerHTML = '';
    songs.forEach((song, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${song.cover}" alt="cover">
            <div class="info">
                <div class="title">${song.title}</div>
                <div class="artist">${song.artist}</div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (currentIndex === index) {
                togglePlay();
            } else {
                currentIndex = index;
                loadSong(currentIndex);
                playSong();
                updateCarouselClasses();
            }
        });
        
        carousel.appendChild(card);
    });
    
    cards = document.querySelectorAll('.card');
}

// Update 3D classes based on current index
function updateCarouselClasses() {
    const total = cards.length;
    
    cards.forEach((card, index) => {
        // Reset classes
        card.className = 'card hidden';
        
        if (index === currentIndex) {
            card.classList.add('active');
        } else if (index === (currentIndex - 1 + total) % total) {
            card.classList.add('prev-1');
        } else if (index === (currentIndex - 2 + total) % total) {
            card.classList.add('prev-2');
        } else if (index === (currentIndex + 1) % total) {
            card.classList.add('next-1');
        } else if (index === (currentIndex + 2) % total) {
            card.classList.add('next-2');
        }
    });
}

// Load song data into player
function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    miniTitle.textContent = song.title;
    miniArtist.textContent = song.artist;
    mainSubtitle.textContent = song.title;
    miniCover.src = song.cover;
    
    // Update dynamic background
    bgContainer.style.backgroundImage = `url(${song.cover})`;
    
    progressBar.style.width = '0%';
    
    updatePlaylistActiveState();
}

// Play
function playSong() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    visualizer.classList.add('active');
    audio.play();
}

// Pause
function pauseSong() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    visualizer.classList.remove('active');
    audio.pause();
}

// Toggle Play/Pause
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Prev Song
function prevSong() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) playSong();
    updateCarouselClasses();
}

// Next Song
function nextSong() {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) playSong();
    updateCarouselClasses();
}

// Audio Time Update for Progress Bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (isNaN(duration)) return;
    const percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
}

// Set Progress Bar on Click
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    if (!isNaN(duration)) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// Volume Controls
function setVolume(e) {
    audio.volume = e.target.value;
    updateMuteIcon();
}

function toggleMute() {
    if (audio.volume > 0) {
        audio.dataset.volume = audio.volume;
        audio.volume = 0;
        volumeSlider.value = 0;
    } else {
        audio.volume = audio.dataset.volume || 1;
        volumeSlider.value = audio.volume;
    }
    updateMuteIcon();
}

function updateMuteIcon() {
    if (audio.volume === 0) {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (audio.volume < 0.5) {
        muteBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

// Toast Notification Logic
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Cast Button Logic
castBtn.addEventListener('click', () => {
    isCasting = !isCasting;
    if (isCasting) {
        castBtn.style.color = 'var(--accent)';
        showToast('Searching for devices to cast...');
    } else {
        castBtn.style.color = '';
        showToast('Disconnected from cast device.');
    }
});

// Queue / Playlist Logic
queueBtn.addEventListener('click', () => {
    playlistOverlay.classList.toggle('active');
});

closePlaylistBtn.addEventListener('click', () => {
    playlistOverlay.classList.remove('active');
});

function renderPlaylist() {
    playlistList.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = `playlist-item ${index === currentIndex ? 'active' : ''}`;
        li.innerHTML = `
            <img src="${song.cover}" alt="cover">
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
        `;
        li.addEventListener('click', () => {
            currentIndex = index;
            loadSong(currentIndex);
            playSong();
            updateCarouselClasses();
        });
        playlistList.appendChild(li);
    });
}

function updatePlaylistActiveState() {
    const items = playlistList.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong); // Autoplay next
progressContainer.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', setVolume);
muteBtn.addEventListener('click', toggleMute);

// Initialize
init();
