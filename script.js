/* ============================================
   UNDANGAN PERNIKAHAN - JAVASCRIPT
   Fitur: Cover transition, Countdown, Scroll 
   animations, Falling petals, Music toggle,
   Wishes, Parallax
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === LOADER ===
    const loader = document.querySelector('.loader-wrapper');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500);
    });

    // Fallback: hide loader after 4 seconds regardless
    setTimeout(() => {
        if (loader) loader.classList.add('hidden');
    }, 4000);


    // === BUKA UNDANGAN (OPEN INVITATION) ===
    const coverSection = document.getElementById('cover-section');
    const mainContent = document.getElementById('main-content');
    const btnOpen = document.getElementById('btn-open');
    const btnMusic = document.getElementById('btn-music');

    btnOpen.addEventListener('click', () => {
        // Animate cover out
        coverSection.classList.add('hide');

        // Allow body scroll
        document.body.classList.add('opened');

        // After cover transition, show main content
        setTimeout(() => {
            coverSection.style.display = 'none';
            mainContent.classList.add('show');

            // Init scroll animations
            initScrollAnimations();

            // Start falling petals
            startFallingPetals();

            // Show music button
            btnMusic.classList.add('visible');

            // Start background music (auto on user interaction)
            playMusic();

        }, 1000);
    });


    // === SCROLL ANIMATIONS (Intersection Observer) ===
    function initScrollAnimations() {
        const animElements = document.querySelectorAll('[class*="anim-fade"], [class*="anim-zoom"]');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('anim-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animElements.forEach(el => observer.observe(el));
    }


    // === COUNTDOWN TIMER ===
    const weddingDate = new Date("Oct 24, 2026 09:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('cd-days').textContent = '00';
            document.getElementById('cd-hours').textContent = '00';
            document.getElementById('cd-minutes').textContent = '00';
            document.getElementById('cd-seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
        document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    // === FALLING PETALS (Canvas-based for performance) ===
    let petalCanvas, petalCtx;
    let petals = [];
    let petalAnimationId;
    const petalImages = [];
    const PETAL_COUNT = 30;

    function createPetalShapes() {
        // Create different petal shapes using small canvases
        const colors = [
            'rgba(212, 175, 55, 0.6)',     // Gold
            'rgba(105, 122, 106, 0.5)',     // Sage green
            'rgba(220, 180, 180, 0.65)',    // Pink blush
            'rgba(180, 160, 120, 0.5)',     // Tan
            'rgba(160, 200, 160, 0.45)',    // Light green
        ];

        colors.forEach(color => {
            const c = document.createElement('canvas');
            c.width = 20;
            c.height = 20;
            const ctx = c.getContext('2d');

            // Draw petal shape
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.bezierCurveTo(15, 4, 18, 10, 10, 20);
            ctx.bezierCurveTo(2, 10, 5, 4, 10, 0);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();

            petalImages.push(c);
        });
    }

    function startFallingPetals() {
        petalCanvas = document.getElementById('petal-canvas');
        petalCtx = petalCanvas.getContext('2d');

        resizePetalCanvas();
        window.addEventListener('resize', resizePetalCanvas);

        createPetalShapes();

        // Spawn petals gradually
        for (let i = 0; i < PETAL_COUNT; i++) {
            setTimeout(() => {
                petals.push(createPetal());
            }, i * 200);
        }

        petalCanvas.classList.add('visible');
        animatePetals();
    }

    function resizePetalCanvas() {
        if (!petalCanvas) return;
        petalCanvas.width = window.innerWidth;
        petalCanvas.height = window.innerHeight;
    }

    function createPetal() {
        return {
            x: Math.random() * (petalCanvas ? petalCanvas.width : window.innerWidth),
            y: -20 - Math.random() * 100,
            size: Math.random() * 12 + 8,
            speedY: Math.random() * 1.5 + 0.5,
            speedX: Math.random() * 1 - 0.5,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 2 - 1,
            opacity: Math.random() * 0.6 + 0.3,
            swayAmplitude: Math.random() * 30 + 10,
            swaySpeed: Math.random() * 0.02 + 0.01,
            swayOffset: Math.random() * Math.PI * 2,
            image: petalImages[Math.floor(Math.random() * petalImages.length)],
            time: 0
        };
    }

    function animatePetals() {
        if (!petalCtx || !petalCanvas) return;

        petalCtx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);

        petals.forEach((p, i) => {
            p.time += p.swaySpeed;
            p.y += p.speedY;
            p.x += Math.sin(p.time + p.swayOffset) * 0.5 + p.speedX;
            p.rotation += p.rotationSpeed;

            // Reset petal when it goes off screen
            if (p.y > petalCanvas.height + 30) {
                p.y = -20;
                p.x = Math.random() * petalCanvas.width;
            }

            petalCtx.save();
            petalCtx.globalAlpha = p.opacity;
            petalCtx.translate(p.x, p.y);
            petalCtx.rotate((p.rotation * Math.PI) / 180);
            petalCtx.drawImage(p.image, -p.size / 2, -p.size / 2, p.size, p.size);
            petalCtx.restore();
        });

        petalAnimationId = requestAnimationFrame(animatePetals);
    }


    // === MUSIC CONTROL ===
    let bgMusic;
    let isMusicPlaying = false;

    function playMusic() {
        if (!bgMusic) {
            bgMusic = new Audio('https://www.dropbox.com/scl/fi/56nuys1esb53lgmc9x1ac/Canon-in-D-Pachelbel-Violin-Cello_Piano-SjYecEQFL0U.mp3?rlkey=4863hj6py7ynzikmsv8jdt7v2&st=ne3yg0mw&raw=1');
            bgMusic.loop = true;
            bgMusic.volume = 0.3;
        }

        bgMusic.play().then(() => {
            isMusicPlaying = true;
            btnMusic.classList.remove('paused');
        }).catch(() => {
            // Autoplay blocked, user needs to interact
            isMusicPlaying = false;
            btnMusic.classList.add('paused');
        });
    }

    if (btnMusic) {
        btnMusic.addEventListener('click', () => {
            if (!bgMusic) {
                bgMusic = new Audio('https://www.dropbox.com/scl/fi/56nuys1esb53lgmc9x1ac/Canon-in-D-Pachelbel-Violin-Cello_Piano-SjYecEQFL0U.mp3?rlkey=4863hj6py7ynzikmsv8jdt7v2&st=ne3yg0mw&raw=1');
                bgMusic.loop = true;
                bgMusic.volume = 0.3;
            }

            if (isMusicPlaying) {
                bgMusic.pause();
                isMusicPlaying = false;
                btnMusic.classList.add('paused');
            } else {
                bgMusic.play();
                isMusicPlaying = true;
                btnMusic.classList.remove('paused');
            }
        });
    }


    // === WISHES FORM (Local Only, No Database) ===
    const wishForm = document.getElementById('wish-form');
    const wishesList = document.getElementById('wishes-list');

    // Pre-populated sample wishes
    const sampleWishes = [
        { name: 'Keluarga Besar Wayan', message: 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, wa rahmah. Bahagia selalu! 🎉' },
        { name: 'Yuni & Made', message: 'Turut berbahagia atas pernikahan Budi & Sari. Semoga langgeng sampai kakek nenek ya! ❤️' },
        { name: 'Ketut Dharma', message: 'Om Swastiastu! Bahagia selalu untuk kalian berdua. Semoga dianugerahi keturunan yang soleh. 🙏' },
    ];

    function renderWishes() {
        let allWishes = [...sampleWishes];

        // Get local wishes
        const localWishes = JSON.parse(localStorage.getItem('wedding-wishes') || '[]');
        allWishes = [...allWishes, ...localWishes];

        wishesList.innerHTML = '';
        allWishes.forEach(wish => {
            const el = document.createElement('div');
            el.className = 'wish-item anim-fade-up anim-visible';
            el.innerHTML = `
                <div class="wish-name">${escapeHtml(wish.name)}</div>
                <div class="wish-message">${escapeHtml(wish.message)}</div>
            `;
            wishesList.appendChild(el);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    if (wishForm) {
        wishForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('wish-name').value.trim();
            const message = document.getElementById('wish-message').value.trim();

            if (!name || !message) return;

            // Store locally
            const localWishes = JSON.parse(localStorage.getItem('wedding-wishes') || '[]');
            localWishes.push({ name, message });
            localStorage.setItem('wedding-wishes', JSON.stringify(localWishes));

            // Reset form
            wishForm.reset();

            // Re-render
            renderWishes();

            // Show toast
            showToast('Terima kasih atas doa dan ucapannya! 🙏');
        });
    }

    // Initial render
    renderWishes();


    // === TOAST NOTIFICATION ===
    function showToast(message) {
        let toast = document.querySelector('.toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }


    // === PARALLAX ON SCROLL ===
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const parallaxElements = document.querySelectorAll('.parallax-leaf');
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.speed) || 0.3;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });


    // === GALLERY LIGHTBOX (Simple) ===
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.9); z-index: 10000;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; animation: fadeIn 0.3s ease;
            `;
            const bigImg = document.createElement('img');
            bigImg.src = img.src;
            bigImg.style.cssText = 'max-width: 90%; max-height: 90%; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);';
            overlay.appendChild(bigImg);
            document.body.appendChild(overlay);

            overlay.addEventListener('click', () => {
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.3s ease';
                setTimeout(() => overlay.remove(), 300);
            });
        });
    });

});

// === GIFT MODAL FUNCTIONS (Global scope) ===
window.openGiftModal = function(bankName, logoUrl, accountNo, accountName) {
    var logoImg = document.getElementById('modal-gift-logo');
    var fallbackText = document.getElementById('modal-gift-fallback');
    
    // Reset display styles
    if (logoImg) logoImg.style.display = 'block';
    if (fallbackText) fallbackText.style.display = 'none';
    
    logoImg.src = logoUrl;
    logoImg.alt = bankName;
    
    document.getElementById('modal-gift-account').innerText = accountNo;
    document.getElementById('modal-gift-name').innerText = 'a.n. ' + accountName;
    document.getElementById('modal-gift-copy').setAttribute('data-acc', accountNo);
    
    var modalElement = document.getElementById('giftModal');
    if(modalElement) {
        var modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
};

window.copyFromModal = function() {
    const text = document.getElementById('modal-gift-copy').getAttribute('data-acc');
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('modal-gift-copy');
        const originalHTML = '<i class="far fa-copy me-2"></i> Salin Nomor';
        
        // Show success state
        btn.innerHTML = '<i class="fas fa-check me-2"></i> Berhasil Disalin!';
        btn.style.background = 'var(--color-primary-dark)';
        btn.style.color = '#151715';
        
        // Revert back after 2 seconds
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = 'var(--color-primary)';
            btn.style.color = 'white';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy!', err);
    });
};
