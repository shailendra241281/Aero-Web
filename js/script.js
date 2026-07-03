AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Scroll progress bar
window.addEventListener('scroll', function() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset;
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    }
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Lightbox Functionality
const lightbox = document.getElementById('lightbox');
if (lightbox) {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    let currentImageIndex = 0;
    
    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Navigation
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxImage();
    });
    
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        updateLightboxImage();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightboxImage();
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
            updateLightboxImage();
        }
    });
    
    function updateLightboxImage() {
        const imgSrc = galleryItems[currentImageIndex].querySelector('img').src;
        lightboxImage.src = imgSrc;
        lightboxImage.alt = galleryItems[currentImageIndex].querySelector('img').alt;
    }
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Initialize counter animation
if (document.querySelector('.stat-number')) {
    animateCounters();
}

// Parallax effect for clouds
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const clouds = document.querySelectorAll('.cloud');
    
    clouds.forEach((cloud, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        cloud.style.transform = `translateY(${yPos}px)`;
    });
});

// Card hover animations
const cards = document.querySelectorAll('.card, .contact-card, .team-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            duration: 0.3,
            y: -10,
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
            borderColor: "#64ffda",
            ease: "power2.out"
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            duration: 0.3,
            y: 0,
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
            borderColor: "rgba(100, 255, 218, 0.1)",
            ease: "power2.out"
        });
    });
});

// Domain cards animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    const domainCards = document.querySelectorAll('.domain-card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    domainCards.forEach(card => {
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// COVERFLOW CAROUSEL SCRIPT
const carousel = document.getElementById('carousel');
if (carousel) {
    let slides = Array.from(carousel.querySelectorAll('.slide'));
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    let currentIndex = 0;
    const visibleRange = 2; // number of side images

    function updateCarousel(){
        const len = slides.length;
        
        slides.forEach((slide,i)=>{
            // calculate offset circularly
            let offset = (i - currentIndex);
            if (offset < -Math.floor(len/2)) offset += len;
            if (offset > Math.floor(len/2)) offset -= len;

            if(offset === 0){ // center
                slide.style.transform = 'translate(-50%, -50%) scale(1.4)';
                slide.style.zIndex = 10;
                slide.style.filter = 'blur(0)';
                slide.style.borderColor = 'var(--accent)';
            } else if(offset > 0 && offset <= visibleRange){ // right stack
                const scale = 1 - 0.1*offset;
                const xShift = 220*offset;
                const yShift = 25*offset;
                const blur = 3*offset;
                slide.style.transform = `translate(calc(-50% + ${xShift}px), calc(-50% + ${yShift}px)) scale(${scale})`;
                slide.style.zIndex = 10 - offset;
                slide.style.filter = `blur(${blur}px)`;
                slide.style.borderColor = 'transparent';
            } else if(offset < 0 && offset >= -visibleRange){ // left stack
                const scale = 1 + 0.1*offset;
                const xShift = 220*offset;
                const yShift = 25*Math.abs(offset);
                const blur = 3*Math.abs(offset);
                slide.style.transform = `translate(calc(-50% + ${xShift}px), calc(-50% + ${yShift}px)) scale(${scale})`;
                slide.style.zIndex = 10 - Math.abs(offset);
                slide.style.filter = `blur(${blur}px)`;
                slide.style.borderColor = 'transparent';
            } else { // hide slides beyond stack
                slide.style.transform = 'translate(-50%, -50%) scale(0.5)';
                slide.style.zIndex = 0;
                slide.style.filter = 'blur(10px)';
                slide.style.borderColor = 'transparent';
            }
        });
    }

    // Initial render
    updateCarousel();

    // Arrows
    leftArrow.addEventListener('click', ()=>{
        currentIndex = (currentIndex-1+slides.length)%slides.length;
        updateCarousel();
    });
    rightArrow.addEventListener('click', ()=>{
        currentIndex = (currentIndex+1)%slides.length;
        updateCarousel();
    });

    // Click slide to center
    slides.forEach((slide, idx)=>{
        slide.addEventListener('click', ()=>{
            currentIndex = idx;
            updateCarousel();
        });
    });

    // Auto-rotate carousel
    setInterval(() => {
        currentIndex = (currentIndex+1)%slides.length;
        updateCarousel();
    }, 5000);
}

// TEAM SECTION SCRIPT
document.addEventListener("DOMContentLoaded", () => {
    // Fade-in scroll for team section
    const fadeElements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.15 });

    fadeElements.forEach(el => observer.observe(el));

    // Secretaries data - only for team page
    if (document.getElementById("secretaries")) {
        const names = [
            "Ankit", "Simran", "Vivek Rao", "Nidhi", "Mohit Bansal",
            "Sneha", "Karan Gupta", "Pooja", "Nikhil Jain", "Aradhya",
            "Rohan", "Priya", "Siddharth", "Meera", "Amit",
            "Neha", "Rajesh", "Divya", "Vikram", "Anjali",
            "Ravi", "Kavita", "Sanjay", "Pooja Sharma", "Deepak",
            "Sunita", "Manoj", "Swati", "Alok"
        ];

        const secContainer = document.getElementById("secretaries");
        const descs = [
            "A creative mind passionate about teamwork.",
            "Brings new energy and enthusiasm to every task.",
            "Keeps everything organized and efficient.",
            "Loves innovation and problem-solving.",
            "Always ready with fresh ideas and dedication.",
            "Excellent communicator and team player.",
            "Detail-oriented with great leadership skills.",
            "Creative thinker and problem solver.",
            "Tech-savvy and innovative approach.",
            "Dedicated and hardworking team member.",
            "Skilled in project management and coordination.",
            "Excellent at multitasking and meeting deadlines.",
            "Strong analytical skills and attention to detail.",
            "Great at building relationships with stakeholders.",
            "Proactive approach to problem-solving.",
            "Excellent organizational and planning abilities.",
            "Strong communication and interpersonal skills.",
            "Creative approach to challenges and opportunities.",
            "Dedicated to continuous improvement.",
            "Excellent at team building and motivation.",
            "Skilled in data analysis and reporting.",
            "Strong work ethic and commitment to quality.",
            "Excellent at managing multiple priorities.",
            "Creative problem-solver with attention to detail.",
            "Strong leadership and decision-making skills.",
            "Excellent at process optimization.",
            "Skilled in stakeholder management.",
            "Great at fostering collaboration and teamwork.",
            "Dedicated to achieving organizational goals."
        ];

        names.forEach((name, i) => {
            const gender = i % 2 === 0 ? "men" : "women";
            const imgNum = (i * 7 + 11) % 99;
            const imgUrl = `https://tse3.mm.bing.net/th/id/OIP.kSwr58mK0Z901dX3FEKvAQHaJ4?pid=ImgDet&w=206&h=274&c=7&dpr=1.5&o=7&rm=3`;

            const cardHTML = `
                <div class="team-card secretary-card">
                    <img src="${imgUrl}" alt="${name}"
                        class="profile-img"
                        style="width: 64px; height: 64px;"
                        onerror="this.src='https://via.placeholder.com/150/1f2937/ffffff?text=No+Image'">
                    <h3 style="font-size: 1rem; font-weight: 600; margin: 8px 0 4px;">${name}</h3>
                    <p style="color: #06b6d4; font-weight: 500; font-size: 0.8rem; margin-bottom: 8px;">Secretary</p>
                    <p style="font-size: 0.7rem; color: #cccccc; font-style: italic; line-height: 1.3; margin-bottom: 12px;">${descs[i]}</p>
                    <div style="display: flex; justify-content: center; gap: 8px;">
                        <a href="https://www.instagram.com/aero_club_iitk/" class="team-social-icon" style="width: 30px; height: 30px;">
                            <i class="fab fa-instagram" style="font-size: 0.8rem;"></i>
                        </a>
                        <a href="https://www.linkedin.com/company/aeromodelling-club-iitk/" class="team-social-icon" style="width: 30px; height: 30px;">
                            <i class="fab fa-linkedin-in" style="font-size: 0.8rem;"></i>
                        </a>
                    </div>
                </div>
            `;
            secContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId.includes('.html')) return;
        
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// GSAP Animations for hero section
const heroTitle = document.getElementById('hero-title');
if (heroTitle) {
    const heroTl = gsap.timeline();
    heroTl.from("#hero-title", { 
        duration: 1.5, 
        y: 100, 
        opacity: 0, 
        ease: "power3.out" 
    })
    .from("#hero-subtitle", { 
        duration: 1, 
        y: 50, 
        opacity: 0, 
        ease: "power2.out" 
    }, "-=0.5")
    .from("#hero-btn", { 
        duration: 0.8, 
        scale: 0, 
        rotation: 180, 
        ease: "back.out(1.7)" 
    }, "-=0.3");
}


// Projects and Resources Functionality
function initProjectsSection() {
    // Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                // Filter projects
                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Resource Tabs
    const resourceTabs = document.querySelectorAll('.resource-tab');
    const resourceContents = document.querySelectorAll('.resources-content');
    
    if (resourceTabs.length > 0 && resourceContents.length > 0) {
        resourceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                resourceTabs.forEach(t => t.classList.remove('active'));
                resourceContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Video Modal
    const videoModal = document.getElementById('videoModal');
    const videoLinks = document.querySelectorAll('.video-link');
    const modalClose = document.querySelector('.modal-close');
    const videoContainer = document.querySelector('.video-container');
    
    if (videoModal && videoLinks.length > 0) {
        videoLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const videoId = link.getAttribute('data-video');
                
                // Set iframe src
                videoContainer.innerHTML = `
                    <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                `;
                
                // Show modal
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                videoModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                // Clear iframe to stop video
                videoContainer.innerHTML = '';
            });
        }
        
        // Close modal when clicking outside
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                videoContainer.innerHTML = '';
            }
        });
        
        // Close modal with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                videoModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                videoContainer.innerHTML = '';
            }
        });
    }
    
    // Download tracking
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const fileName = button.getAttribute('data-file');
            console.log(`Download started: ${fileName}`);
            // Here you can add analytics tracking
        });
    });
}

