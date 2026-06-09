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

    // In-Card Text and Image Thumbnail Toggle
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const overlay = card.querySelector('.project-overlay');
        if (!overlay) return;
        
        const info = overlay.querySelector('.project-info');
        if (!info) return;
        
        const container = card.querySelector('.carousel-container');
        const slides = container ? container.querySelectorAll('.carousel-slide') : [];
        
        // 1. Create the large image viewer element (sibling of project-info)
        const imageView = document.createElement('div');
        imageView.className = 'project-overlay-image-view';
        const imageEl = document.createElement('img');
        imageEl.className = 'project-overlay-image';
        imageEl.alt = `${card.querySelector('.project-title h4 span')?.textContent || 'Project'} large view`;
        imageView.appendChild(imageEl);
        overlay.appendChild(imageView);
        
        // 2. Create the vertical thumbnails container
        const thumbContainer = document.createElement('div');
        thumbContainer.className = 'project-thumbnails';
        
        // 3. Create the Text Thumbnail first
        const textThumb = document.createElement('div');
        textThumb.className = 'project-thumbnail text-thumb active'; // Active by default
        textThumb.title = 'View project description';
        textThumb.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="18" x2="3" y2="18"></line>
            </svg>
        `;
        thumbContainer.appendChild(textThumb);
        
        // 4. Gather image URLs from slides or static image
        const imageUrls = [];
        if (slides.length > 0) {
            slides.forEach(slide => {
                const bg = slide.style.backgroundImage;
                if (bg) {
                    imageUrls.push(bg.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, ''));
                }
            });
        } else {
            const staticImg = card.querySelector('.project-image');
            if (staticImg && staticImg.style.backgroundImage) {
                imageUrls.push(staticImg.style.backgroundImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, ''));
            }
        }
        
        // 5. Create Image Thumbnails
        imageUrls.forEach((url, idx) => {
            const thumb = document.createElement('div');
            thumb.className = 'project-thumbnail img-thumb';
            thumb.style.backgroundImage = `url('${url}')`;
            thumb.title = `View image ${idx + 1}`;
            
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Set manual control on container (to pause auto animation)
                if (container) {
                    container.classList.add('manual-control');
                    if (slides[idx]) {
                        slides.forEach(s => s.classList.remove('active'));
                        slides[idx].classList.add('active');
                    }
                }
                
                // Toggle active thumbnail
                thumbContainer.querySelectorAll('.project-thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                
                // Show Image View, hide Text View
                imageEl.src = url;
                info.classList.add('view-hidden');
                imageView.classList.add('view-active');
            });
            
            thumbContainer.appendChild(thumb);
        });
        
        // Add click listener to Text Thumbnail
        textThumb.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Toggle active thumbnail
            thumbContainer.querySelectorAll('.project-thumbnail').forEach(t => t.classList.remove('active'));
            textThumb.classList.add('active');
            
            // Show Text View, hide Image View
            info.classList.remove('view-hidden');
            imageView.classList.remove('view-active');
        });
        
        overlay.appendChild(thumbContainer);
        
        // 6. Reset to default (Text View active) on mouseleave
        card.addEventListener('mouseleave', () => {
            info.classList.remove('view-hidden');
            imageView.classList.remove('view-active');
            
            thumbContainer.querySelectorAll('.project-thumbnail').forEach(t => t.classList.remove('active'));
            textThumb.classList.add('active');
            
            if (container) {
                container.classList.remove('manual-control');
                slides.forEach(s => s.classList.remove('active'));
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
    // What Can I Offer You Interactive Tab Switcher
    const offeringCards = document.querySelectorAll('.offering-card');
    const offeringPanes = document.querySelectorAll('.offering-detail-pane');
    
    offeringCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active classes
            offeringCards.forEach(c => c.classList.remove('active'));
            offeringPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked card
            card.classList.add('active');
            
            // Show corresponding details pane
            const targetId = card.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}
