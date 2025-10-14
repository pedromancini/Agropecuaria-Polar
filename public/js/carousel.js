const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('indicators');

let currentPage = 0;
const totalPages = 4;
let autoPlayInterval;
const autoPlayDelay = 4000; // passagem automatica dos slides

for (let i = 0; i < totalPages; i++) {
    const indicator = document.createElement('div');
    indicator.className = 'indicator';
    if (i === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToPage(i));
    indicatorsContainer.appendChild(indicator);
}

function updateCarousel() {
    track.style.transform = `translateX(-${currentPage * 100}%)`;
    
    document.querySelectorAll('.indicator').forEach((ind, idx) => {
        ind.classList.toggle('active', idx === currentPage);
    });
    
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;
}

function goToPage(page) {
    currentPage = page;
    updateCarousel();
    resetAutoPlay();
}

function nextPage() {
    currentPage = (currentPage + 1) % totalPages;
    updateCarousel();
}

function startAutoPlay() {
    autoPlayInterval = setInterval(nextPage, autoPlayDelay);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        updateCarousel();
        resetAutoPlay();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
        currentPage++;
        updateCarousel();
        resetAutoPlay();
    }
});

// pausa o autoplay qnd coloca o mouse em cima.
track.addEventListener('mouseenter', stopAutoPlay);
track.addEventListener('mouseleave', startAutoPlay);

updateCarousel();
startAutoPlay();