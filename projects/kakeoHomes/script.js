function toggleGallery(button) {
    const gallery = button.closest('.gallery');
    const hiddenImages = gallery.querySelector('.hidden-images');
    
    if (hiddenImages.style.display === 'none' || hiddenImages.style.display === '') {
        hiddenImages.style.display = 'grid';
        button.textContent = 'Show Less';
        hiddenImages.style.animation = 'fadeIn 0.5s ease';
    } else {
        hiddenImages.style.display = 'none';
        button.textContent = 'Show All Photos';
    }
}

// Initialize gallery state on page load
function initializeGalleries() {
    document.querySelectorAll('.gallery').forEach(gallery => {
        const hiddenImages = gallery.querySelector('.hidden-images');
        const button = gallery.querySelector('.show-all');

        // Initially hide the hidden images
        hiddenImages.style.display = 'none';
        button.textContent = 'Show All Photos'; // Set default button text
    });
}

// Call the initialize function when the page loads
window.onload = initializeGalleries;

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
let currentGallery = null;
let currentImageIndex = 0;

document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', e => {
        const gallery = e.target.closest('.gallery');
        const allImages = [...gallery.querySelectorAll('img')];
        currentGallery = gallery;
        currentImageIndex = allImages.indexOf(e.target);
        
        lightboxImg.src = e.target.src;
        lightbox.classList.add('active');
    });
});

document.querySelector('.close-lightbox').addEventListener('click', () => {
    lightbox.classList.remove('active');
});

document.querySelector('.next').addEventListener('click', () => {
    const allImages = [...currentGallery.querySelectorAll('img')];
    currentImageIndex = (currentImageIndex + 1) % allImages.length;
    lightboxImg.src = allImages[currentImageIndex].src;
});

document.querySelector('.prev').addEventListener('click', () => {
    const allImages = [...currentGallery.querySelectorAll('img')];
    currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    lightboxImg.src = allImages[currentImageIndex].src;
});

// Back to top button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
