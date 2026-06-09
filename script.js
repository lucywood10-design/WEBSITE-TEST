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
