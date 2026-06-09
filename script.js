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

    // Interactive Carousels with Thumbnails and Expanded Side-by-Side View
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        // Assign column class based on index in a 2-column layout
        if (index % 2 === 0) {
            card.classList.add('col-left');
        } else {
            card.classList.add('col-right');
        }
        
        const overlay = card.querySelector('.project-overlay');
        if (!overlay) return;
        
        const info = overlay.querySelector('.project-info');
        if (!info) return;
        
        const container = card.querySelector('.carousel-container');
        const slides = container ? container.querySelectorAll('.carousel-slide') : [];
        
        // Dynamically create the large image container
        const largeView = document.createElement('div');
        largeView.className = 'project-large-view';
        const largeImg = document.createElement('img');
        largeImg.className = 'project-large-img';
        largeImg.alt = `${card.querySelector('.project-title h4 span')?.textContent || 'Project'} image large view`;
        
        // Set initial large image source
        let initialBg = '';
        if (slides.length > 0) {
            initialBg = slides[0].style.backgroundImage;
        } else {
            const staticImg = card.querySelector('.project-image');
            if (staticImg) {
                initialBg = staticImg.style.backgroundImage;
            }
        }
        
        if (initialBg) {
            const imgUrl = initialBg.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
            largeImg.src = imgUrl;
        }
        
        largeView.appendChild(largeImg);
        overlay.appendChild(largeView);
        
        let thumbContainer = null;
        
        // Generate thumbnails only if there are multiple slides
        if (slides.length > 1) {
            thumbContainer = document.createElement('div');
            thumbContainer.className = 'project-thumbnails';
            
            slides.forEach((slide, idx) => {
                const thumb = document.createElement('div');
                thumb.className = 'project-thumbnail';
                if (idx === 0) thumb.classList.add('active');
                
                thumb.style.backgroundImage = slide.style.backgroundImage;
                
                // Navigate on click
                thumb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    if (container) {
                        container.classList.add('manual-control');
                    }
                    
                    // Toggle active slide
                    slides.forEach(s => s.classList.remove('active'));
                    slide.classList.add('active');
                    
                    // Toggle active thumbnail
                    thumbContainer.querySelectorAll('.project-thumbnail').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    
                    // Update large image
                    const bgImage = slide.style.backgroundImage;
                    const imgUrl = bgImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
                    largeImg.src = imgUrl;
                    
                    // Expand card
                    card.classList.add('expanded');
                });
                
                thumbContainer.appendChild(thumb);
            });
            
            overlay.appendChild(thumbContainer);
        }
        
        // Handle overlay click to expand (if closed) or collapse (if open)
        overlay.addEventListener('click', (e) => {
            // Let links work normally
            if (e.target.closest('a')) {
                return;
            }
            
            if (!card.classList.contains('expanded')) {
                // Expand the card
                card.classList.add('expanded');
                if (container) {
                    container.classList.add('manual-control');
                    const activeSlide = container.querySelector('.carousel-slide.active');
                    if (activeSlide) {
                        const bgImage = activeSlide.style.backgroundImage;
                        const imgUrl = bgImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
                        largeImg.src = imgUrl;
                    }
                }
            } else {
                // Collapse only if clicking outside the interactive text and thumbnails
                if (e.target.closest('.project-info') || e.target.closest('.project-thumbnails')) {
                    return;
                }
                
                card.classList.remove('expanded');
                if (container) {
                    container.classList.remove('manual-control');
                    slides.forEach(s => s.classList.remove('active'));
                }
                if (thumbContainer) {
                    thumbContainer.querySelectorAll('.project-thumbnail').forEach(t => t.classList.remove('active'));
                    const firstThumb = thumbContainer.querySelector('.project-thumbnail');
                    if (firstThumb) firstThumb.classList.add('active');
                }
            }
        });
        
        // Reset to auto-play on mouseleave ONLY if it's not expanded
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('expanded')) {
                if (container) {
                    container.classList.remove('manual-control');
                    slides.forEach(s => s.classList.remove('active'));
                }
                if (thumbContainer) {
                    thumbContainer.querySelectorAll('.project-thumbnail').forEach(t => t.classList.remove('active'));
                    const firstThumb = thumbContainer.querySelector('.project-thumbnail');
                    if (firstThumb) firstThumb.classList.add('active');
                }
            }
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
