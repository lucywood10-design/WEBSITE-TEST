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

    // Custom Cursor logic
    const pencil = document.getElementById('cursor-pencil');
    const ring = document.getElementById('cursor-ring');
    const canvas = document.getElementById('cursor-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    
    if (pencil && ring) {
        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;
        let isMoving = false;
        let points = [];
        const maxAge = 35; // How many frames the line lasts

        // Resize canvas to cover screen
        if (canvas && ctx) {
            const resizeCanvas = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();
        }
        
        // Track mouse position
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move pencil instantly
            pencil.style.left = mouseX + 'px';
            pencil.style.top = mouseY + 'px';
            
            if (!isMoving) {
                isMoving = true;
                pencil.style.opacity = '1';
                ring.style.opacity = '1';
            }

            if (canvas && ctx) {
                points.push({
                    x: mouseX,
                    y: mouseY,
                    age: 0,
                    isHovering: document.body.classList.contains('cursor-hovering')
                });
            }
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            pencil.style.opacity = '0';
            ring.style.opacity = '0';
            isMoving = false;
            points = [];
            if (canvas && ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });

        // Smooth follower animation & trail drawing loop
        const tick = () => {
            const speed = 0.15;
            
            ringX += (mouseX - ringX) * speed;
            ringY += (mouseY - ringY) * speed;
            
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';

            // Draw line trail
            if (canvas && ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (points.length > 1) {
                    for (let i = 1; i < points.length; i++) {
                        const p1 = points[i - 1];
                        const p2 = points[i];

                        // Fade older segments
                        const ageRatio = Math.max(0, 1 - (p2.age / maxAge));
                        const alpha = ageRatio * 0.45; // Peak opacity 0.45

                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);

                        if (p2.isHovering) {
                            ctx.strokeStyle = `rgba(200, 121, 101, ${alpha})`; // Terracotta
                        } else {
                            ctx.strokeStyle = `rgba(44, 76, 59, ${alpha})`; // Forest Green
                        }

                        ctx.lineWidth = 1.5;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.stroke();
                    }
                }

                // Increment age of points and remove expired ones
                points.forEach(p => p.age++);
                points = points.filter(p => p.age < maxAge);
            }
            
            requestAnimationFrame(tick);
        };
        tick();

        // Hover effect on interactive elements
        const updateHoverState = () => {
            const interactiveElements = document.querySelectorAll('a, button, .node-item, .project-card, input, textarea, select');
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', addHoverClass);
                el.removeEventListener('mouseleave', removeHoverClass);
                el.addEventListener('mouseenter', addHoverClass);
                el.addEventListener('mouseleave', removeHoverClass);
            });
        };

        function addHoverClass() {
            document.body.classList.add('cursor-hovering');
        }

        function removeHoverClass() {
            document.body.classList.remove('cursor-hovering');
        }

        updateHoverState();

        // Re-run hover state update on dynamic content changes
        const cursorMutationObserver = new MutationObserver(updateHoverState);
        cursorMutationObserver.observe(document.body, { childList: true, subtree: true });
    }

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
