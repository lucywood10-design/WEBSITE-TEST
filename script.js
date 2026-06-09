const initPortfolio = () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once the animation has triggered
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements with the slide-up class
    const slideUpElements = document.querySelectorAll('.slide-up');
    
    slideUpElements.forEach(el => {
        observer.observe(el);
    });

    // Interactive Carousels with Thumbnails
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const container = card.querySelector('.carousel-container');
        if (!container) return;
        
        const slides = container.querySelectorAll('.carousel-slide');
        if (slides.length <= 1) return;
        
        const overlay = card.querySelector('.project-overlay');
        if (!overlay) return;
        
        const info = overlay.querySelector('.project-info');
        if (!info) return;
        
        const thumbContainer = document.createElement('div');
        thumbContainer.className = 'project-thumbnails';
        
        slides.forEach((slide, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'project-thumbnail';
            if (index === 0) thumb.classList.add('active');
            
            // Get background-image from slide styling
            thumb.style.backgroundImage = slide.style.backgroundImage;
            
            // Navigate on click
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Add manual mode overrides
                container.classList.add('manual-control');
                
                // Toggle active slide
                slides.forEach(s => s.classList.remove('active'));
                slide.classList.add('active');
                
                // Toggle active thumbnail
                thumbContainer.querySelectorAll('.project-thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
            
            thumbContainer.appendChild(thumb);
        });
        
        overlay.appendChild(thumbContainer);
        
        // Reset to auto-play on mouseleave
        card.addEventListener('mouseleave', () => {
            container.classList.remove('manual-control');
            slides.forEach(s => s.classList.remove('active'));
            thumbContainer.querySelectorAll('.project-thumbnail').forEach(t => t.classList.remove('active'));
            
            const firstThumb = thumbContainer.querySelector('.project-thumbnail');
            if (firstThumb) firstThumb.classList.add('active');
        });
    });

    // Typewriter effect for Hero heading
    const heroHeading = document.querySelector('.hero-content h1');
    if (heroHeading) {
        const originalHTML = `Hello, I am <span class="highlight">Lucy.</span>`;
        const part1 = "Hello, I am ";
        const part2 = "Lucy.";
        
        // Clear heading and set up typing elements
        heroHeading.innerHTML = '<span class="text-container"></span><span class="typing-cursor">|</span>';
        const textSpan = heroHeading.querySelector('.text-container');
        const cursor = heroHeading.querySelector('.typing-cursor');
        
        let charIndex = 0;
        let writingPart1 = true;
        
        const typeCharacter = () => {
            if (writingPart1) {
                if (charIndex < part1.length) {
                    textSpan.textContent += part1.charAt(charIndex);
                    charIndex++;
                    const delay = 60 + Math.random() * 80;
                    setTimeout(typeCharacter, delay);
                } else {
                    writingPart1 = false;
                    charIndex = 0;
                    
                    const highlightSpan = document.createElement('span');
                    highlightSpan.className = 'highlight';
                    textSpan.appendChild(highlightSpan);
                    
                    setTimeout(typeCharacter, 300);
                }
            } else {
                const highlightSpan = textSpan.querySelector('.highlight');
                if (charIndex < part2.length) {
                    highlightSpan.textContent += part2.charAt(charIndex);
                    charIndex++;
                    const delay = 100 + Math.random() * 100;
                    setTimeout(typeCharacter, delay);
                } else {
                    setTimeout(() => {
                        cursor.style.opacity = '0';
                        setTimeout(() => {
                            heroHeading.innerHTML = originalHTML;
                        }, 400);
                    }, 1000);
                }
            }
        };
        
        setTimeout(typeCharacter, 450);
    }

};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}
