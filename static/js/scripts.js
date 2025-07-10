// Preloader
window.addEventListener('load', function () {
    const preloader = document.querySelector('.preloader');
    preloader.classList.add('fade-out');
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

const themeToggle = document.querySelector('#checkbox');

// Set default theme on page load
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
document.documentElement.style.backgroundColor = savedTheme === 'dark' ? '#0f0f1a' : '#ffffff';
if (themeToggle) themeToggle.checked = savedTheme === 'dark';

// Toggle handler
if (themeToggle) {
  themeToggle.addEventListener('change', function () {
    const newTheme = this.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.style.backgroundColor = newTheme === 'dark' ? '#0f0f1a' : '#ffffff';
    localStorage.setItem('theme', newTheme);
  });
}


// Sidebar Toggle for Mobile
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const sidebarClose = document.querySelector('.sidebar-close');
const overlay = document.querySelector('.overlay');

hamburger.addEventListener('click', function () {
    sidebar.classList.add('active');
    overlay.classList.add('active');
});

sidebarClose.addEventListener('click', function () {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', function () {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Function to handle CV download
function downloadCV(event) {
    event.preventDefault();
    
    // Get the href attribute
    const pdfUrl = event.currentTarget.getAttribute('href');
    
    // Create a temporary link with download attribute
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = pdfUrl;
    a.download = "Shubham_Kumar_Resume.pdf";
    
    // For browsers that require the element to be in the DOM
    document.body.appendChild(a);
    
    // Trigger click programmatically
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
    }, 100);
}

// Check if Resume PDF Exists and Toggle Download Buttons Visibility
document.addEventListener('DOMContentLoaded', function() {
    const downloadCvBtn = document.querySelector('.download-cv-btn');
    const downloadResumeBtn = document.querySelector('.download-resume-btn');
    const resumeUrl = "../static/Shubham_Resume.pdf";

    // Use a HEAD request to check if the PDF file exists
    fetch(resumeUrl, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                // If the file doesn't exist (e.g., 404), hide both buttons
                if (downloadCvBtn) downloadCvBtn.style.display = 'none';
                if (downloadResumeBtn) downloadResumeBtn.style.display = 'none';
            }
            // If the file exists, buttons remain visible (default state)
        })
        .catch(() => {
            // In case of a network error, hide the buttons as a fallback
            if (downloadCvBtn) downloadCvBtn.style.display = 'none';
            if (downloadResumeBtn) downloadResumeBtn.style.display = 'none';
        });
});

// Function to toggle mobile number field based on service selection
function toggleMobileNumber(service) {
    const mobileGroup = document.getElementById('mobileNumberGroup');
    if (service === 'AI Model Development' || service === 'AI Web Applications' || service === 'WordPress Website') {
        mobileGroup.style.display = 'block';
        document.getElementById('mobileNumber').setAttribute('required', 'required');
    } else {
        mobileGroup.style.display = 'none';
        document.getElementById('mobileNumber').removeAttribute('required');
    }
}

// Function to scroll to contact form and pre-select a service
function scrollToContactWithService(serviceName) {
    // Pre-select the service in the dropdown
    const serviceDropdown = document.getElementById('service');
    if (serviceDropdown) {
        // Find the option that matches or contains the service name
        for (let i = 0; i < serviceDropdown.options.length; i++) {
            if (serviceDropdown.options[i].text.includes(serviceName)) {
                serviceDropdown.selectedIndex = i;
                toggleMobileNumber(serviceName); // Show mobile field for service purchase
                break;
            }
        }
    }
    
    // Scroll to contact section with smooth scrolling
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        window.scrollTo({
            top: contactSection.offsetTop - 80,
            behavior: 'smooth'
        });
    }
    
    // Focus on the name field after scrolling
    setTimeout(() => {
        const nameField = document.getElementById('name'); // Assuming 'name' is the ID of the name input field
        if (nameField) nameField.focus();
    }, 800);
}

// Scroll to Top Button
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
});

scrollTopBtn.addEventListener('click', function () {
    // Smooth scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Create page transition element
function setupPageTransitions() {
    // Create transition overlay if it doesn't exist
    if (!document.querySelector('.page-transition')) {
        const transitionEl = document.createElement('div');
        transitionEl.className = 'page-transition';
        document.body.appendChild(transitionEl);
    }

    // Handle all internal links for smooth transitions
    document.querySelectorAll('a').forEach(link => {
        // Only apply to internal links that aren't anchors
        const href = link.getAttribute('href');
        if (href && href.startsWith('/') && !href.startsWith('/#') && !link.hasAttribute('download')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetUrl = this.getAttribute('href');
                
                // Activate transition
                const transitionEl = document.querySelector('.page-transition');
                transitionEl.classList.add('active');
                document.body.classList.add('fade-out');
                
                // Navigate after transition
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 300);
            });
        }
    });
}
// ✅ Force reload on back/forward navigation from bfcache
window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};
// Make "Explore My Work" button behave like Projects nav link
document.addEventListener('DOMContentLoaded', function() {
    // Set up page transitions
    setupPageTransitions();
    
    const exploreWorkBtn = document.getElementById('explore-work-btn');
    if (exploreWorkBtn) {
        exploreWorkBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                window.scrollTo({
                    top: projectsSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Smooth Scrolling for Nav Links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-links a, .sidebar-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Handle external links (like /projects)
            if (href.startsWith('/') && !href.startsWith('/#')) {
                return; // Let the browser handle the navigation
            }
            
            e.preventDefault();
            
            // Handle links to index page sections from projects page
            if (href.includes('/#')) {
                const targetId = href.substring(href.indexOf('#') + 1);
                // If we're not on the index page, navigate to index with hash
                if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                    window.location.href = '/#' + targetId;
                    return;
                }
                // Otherwise, scroll to the section on this page
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            } else if (href.includes('#')) {
                const targetId = href.substring(href.indexOf('#') + 1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
            
            // Update active class for nav links
            document.querySelectorAll('.nav-links a, .sidebar-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
            
            // Close sidebar on link click (mobile)
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    });
});

// Highlight Nav Links Based on Scroll Position
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a, .sidebar-links a');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.includes('#') && href.substring(href.indexOf('#') + 1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// Particles.js Initialization with Arrows and Dots
document.addEventListener('DOMContentLoaded', function() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 100,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#4a6cf7"
                },
                "shape": {
                    "type": ["circle", "triangle"], // Added triangle for arrow-like shapes
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 3 // Triangle for arrows
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false
                },
                "size": {
                    "value": 3,
                    "random": true
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#4a6cf7",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                }
            },
            "retina_detect": true
        });
    }
    
    // Add event listeners to CV download buttons
    const cvButtons = document.querySelectorAll('a[download="Shubham_Kumar_Resume.pdf"]');
    cvButtons.forEach(button => {
        button.addEventListener('click', downloadCV);
    });
});

// AOS Animation Initialization
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false,
            easing: 'ease-in-out-cubic'
        });
    }
});

// 3D Tilt Effect for Hero Image
const heroImage = document.querySelector('.hero-image-container');
if (heroImage) {
    heroImage.addEventListener('mousemove', function (e) {
        const rect = heroImage.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / rect.height) * 20;
        const tiltY = -(x / rect.width) * 20;
        heroImage.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    heroImage.addEventListener('mouseleave', function () {
        heroImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        // Add smooth transition when releasing cursor
        heroImage.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
        setTimeout(() => {
            heroImage.style.transition = '';
        }, 600);
    });
}

// Contact Form Submission with Button Animation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const submitBtn = document.getElementById('submitButton');
    const originalText = submitBtn.innerHTML;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        const formData = new FormData(contactForm);

        fetch('/contact', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const successMessage = document.getElementById('successMessage');
            const successContent = successMessage.querySelector('.success-content');

            if (data.status === 'success') {
                successContent.innerHTML = `
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Submission Successful</h3>
                    <p>Your message has been sent successfully!</p>
                `;
                successMessage.style.display = 'flex';
                AOS.refresh();

                contactForm.reset();
                document.getElementById('mobileNumberGroup').style.display = 'none';

                setTimeout(() => {
                    successMessage.style.animation = 'fadeOut 0.3s ease-in-out forwards';
                    setTimeout(() => successMessage.style.display = 'none', 300);
                }, 2000);
            } else {
                throw new Error(data.message || 'Form submission failed');
            }
        })
        .catch(error => {
            const successMessage = document.getElementById('successMessage');
            const successContent = successMessage.querySelector('.success-content');
            successContent.innerHTML = `
                <div class="success-icon error">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h3>Submission Failed</h3>
                <p>${error.message || 'There was an error submitting your form. Please try again later.'}</p>
            `;
            successMessage.style.display = 'flex';
            AOS.refresh();

            setTimeout(() => {
                successMessage.style.animation = 'fadeOut 0.3s ease-in-out forwards';
                setTimeout(() => successMessage.style.display = 'none', 300);
            }, 2000);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
    });
}


// Function to show error message (no longer needed, replaced by catch block)
// Removed this function as it's now handled in the catch block above

// Initialize project data on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the index page and load featured projects
    const mainProjectsGrid = document.getElementById('main-projects-grid');
    if (mainProjectsGrid) {
        // If projectsData is defined, use it to populate the grid
        if (typeof projectsData !== 'undefined') {
            const featuredProjects = projectsData.filter(project => project.featured);
            
            // Determine how many projects to show based on screen width
            let projectsToShow;
            if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
                // Tablet view - show 4 projects
                projectsToShow = featuredProjects.slice(0, 4);
            } else {
                // Desktop and mobile views - show 3 projects
                projectsToShow = featuredProjects.slice(0, 3);
            }
            
            mainProjectsGrid.innerHTML = projectsToShow.map(project => createProjectCard(project)).join('');
            
            // Add resize listener to adjust projects when screen size changes
            window.addEventListener('resize', function() {
                if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
                    // Tablet view - show 4 projects
                    if (mainProjectsGrid.children.length !== 4 && featuredProjects.length >= 4) {
                        const tabletProjects = featuredProjects.slice(0, 4);
                        mainProjectsGrid.innerHTML = tabletProjects.map(project => createProjectCard(project)).join('');
                    }
                } else {
                    // Desktop and mobile views - show 3 projects
                    if (mainProjectsGrid.children.length !== 3 && featuredProjects.length >= 3) {
                        const otherProjects = featuredProjects.slice(0, 3);
                        mainProjectsGrid.innerHTML = otherProjects.map(project => createProjectCard(project)).join('');
                    }
                }
            });
        } else {
            console.error('projectsData is not defined. Make sure projectsData.js is loaded before scripts.js');
        }
    }
    
    // Check if we're on the all projects page
    const allProjectsGrid = document.getElementById('all-projects-grid');
    if (allProjectsGrid) {
        // If projectsData is defined, use it to populate the grid
        if (typeof projectsData !== 'undefined') {
            allProjectsGrid.innerHTML = projectsData.map(project => createProjectCard(project)).join('');
            
            // Set up category filtering
            setupCategoryFiltering();
        } else {
            console.error('projectsData is not defined. Make sure projectsData.js is loaded before scripts.js');
        }
    }
    
    // Handle ongoing projects display based on screen size
    const ongoingContainer = document.querySelector('.ongoing-projects-container');
    if (ongoingContainer) {
        const ongoingProjects = ongoingContainer.querySelectorAll('.ongoing-project-card');
        
        function adjustOngoingProjects() {
            // Reset all to visible first
            ongoingProjects.forEach(project => {
                project.style.display = 'block';
            });
            
            // Desktop: show only first 3
            if (window.innerWidth >= 1025) {
                ongoingProjects.forEach((project, index) => {
                    if (index >= 3) project.style.display = 'none';
                });
            }
            // Tablet: show all 4
            else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
                ongoingProjects.forEach((project, index) => {
                    if (index >= 4) project.style.display = 'none';
                });
            }
            // Mobile: show only first 3
            else {
                ongoingProjects.forEach((project, index) => {
                    if (index >= 3) project.style.display = 'none';
                });
            }
        }
        
        // Run on load and resize
        adjustOngoingProjects();
        window.addEventListener('resize', adjustOngoingProjects);
    }
});

// Function to set up category filtering with enhanced animation
function setupCategoryFiltering() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (categoryButtons.length > 0 && projectCards.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Create particle effect at click position
                createParticles(e.clientX, e.clientY, this.getAttribute('data-category'));
                
                const category = this.getAttribute('data-category');
                
                // First hide all cards with animation
                projectCards.forEach(card => {
                    card.classList.add('hidden');
                    card.classList.remove('appearing');
                });
                
                // After animation completes, show the matching cards
                setTimeout(() => {
                    projectCards.forEach(card => {
                        const cardCategories = card.getAttribute('data-category').split(' ');
                        
                        if (category === 'all' || cardCategories.includes(category)) {
                            card.style.display = 'flex';
                            card.classList.remove('hidden');
                            
                            // Stagger the appearance of cards
                            setTimeout(() => {
                                card.classList.add('appearing');
                            }, Math.random() * 200); // Random delay for each card
                        } else {
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 600);
                        }
                    });
                }, 600); // Match the transition duration in CSS
            });
        });
    }
}

// Function to create particle effects
function createParticles(x, y, category) {
    const colors = {
        'all': ['#4a6cf7', '#c53df4'],
        'machine-learning': ['#4a6cf7', '#6d8dff'],
        'deep-learning': ['#8a3bf9', '#c53df4'],
        'nlp': ['#4a6cf7', '#a742f5'],
        'computer-vision': ['#6d8dff', '#e14aff'],
        'web-app': ['#4a6cf7', '#8a3bf9']
    };
    
    // Default colors if category not found
    const particleColors = colors[category] || ['#4a6cf7', '#c53df4'];
    
    // Create 20 particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 5 and 15px
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position around click point
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100;
        const posX = x + Math.cos(angle) * distance;
        const posY = y + Math.sin(angle) * distance;
        
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        
        // Random color from the category colors
        const colorIndex = Math.floor(Math.random() * particleColors.length);
        particle.style.backgroundColor = particleColors[colorIndex];
        
        // Random animation duration
        const duration = Math.random() * 0.5 + 0.5; // 0.5 to 1 second
        particle.style.animation = `particle-animation ${duration}s ease-out forwards`;
        
        // Add to DOM
        document.body.appendChild(particle);
        
        // Remove after animation completes
        setTimeout(() => {
            document.body.removeChild(particle);
        }, duration * 1000);
    }
}

// Function to check if an element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('.project-img');
    
    images.forEach(img => {
        if (isInViewport(img) && img.getAttribute('data-src')) {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        }
    });
}

// Add event listener for lazy loading
window.addEventListener('scroll', lazyLoadImages);
window.addEventListener('resize', lazyLoadImages);
window.addEventListener('load', lazyLoadImages);

// Initialize tooltips if any
document.addEventListener('DOMContentLoaded', function() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip';
            tooltipEl.textContent = tooltipText;
            document.body.appendChild(tooltipEl);
            
            const rect = this.getBoundingClientRect();
            tooltipEl.style.top = rect.top - tooltipEl.offsetHeight - 10 + 'px';
            tooltipEl.style.left = rect.left + (rect.width / 2) - (tooltipEl.offsetWidth / 2) + 'px';
            tooltipEl.style.opacity = '1';
        });
        
        tooltip.addEventListener('mouseleave', function() {
            const tooltipEl = document.querySelector('.tooltip');
            if (tooltipEl) {
                tooltipEl.remove();
            }
        });
    });
});

// Handle form validation
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateInput(this);
                }
            });
        });
        
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
});

// Function to validate form inputs
function validateInput(input) {
    if (input.hasAttribute('required') && !input.value.trim()) {
        input.classList.add('is-invalid');
        return false;
    } else if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value)) {
        input.classList.add('is-invalid');
        return false;
    } else if (input.type === 'tel' && input.value.trim() && !isValidPhone(input.value)) {
        input.classList.add('is-invalid');
        return false;
    } else {
        input.classList.remove('is-invalid');
        return true;
    }
}

// Email validation function
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Phone validation function
function isValidPhone(phone) {
    const re = /^\+?\d{10,15}$/;
    return re.test(String(phone));
}
