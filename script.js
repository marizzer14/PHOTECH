// Scroll to top on refresh
window.onbeforeunload = function() { 
    window.scrollTo(0, 0); 
}

// Simple Active Navigation Highlighter
document.addEventListener('DOMContentLoaded', function() {
    const sections = {
        'aboutus': document.getElementById('aboutus'),
        'products': document.getElementById('products'),
        'management': document.getElementById('management'),
        'fun-e-exam': document.getElementById('fun-e-exam'),
        'contactus': document.getElementById('contactus')
    };
    
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        // Reset all links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Check which section is in view
        for (const [sectionId, section] of Object.entries(sections)) {
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                    break;
                }
            }
        }
    }
    
    // Throttle the scroll event for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                scrollTimeout = null;
                highlightActiveNav();
            }, 100);
        }
    });
    
    // Initial highlight
    highlightActiveNav();
    
    console.log('Navigation highlighter initialized');
});

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Nav bar scroll effect
    const nav = document.querySelector('.nav-bar');
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 0) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Sticky header
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Logo reload functionality
    document.querySelector('.mainlogo').addEventListener('click', function(e) {
        e.preventDefault();
        location.reload();
    });
    
    console.log('Navigation initialized');
});

// Additional scroll to top on load
window.addEventListener('load', function() {
    setTimeout(function() {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    }, 100);
});

// Products & Services Interactive Cards
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing product cards...');
    
    const productCards = document.querySelectorAll('.product-card');
    const productsGrid = document.querySelector('.products-grid');
    
    productCards.forEach(card => {
        // Add tabindex for accessibility
        card.setAttribute('tabindex', '0');
        
        // Add click event
        card.addEventListener('click', function(e) {
            console.log('Product card clicked');
            handleProductCardClick(card);
        });
        
        // Add keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleProductCardClick(card);
            }
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            if (!card.classList.contains('expanded')) {
                card.style.transform = 'translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!card.classList.contains('expanded')) {
                card.style.transform = 'translateY(0)';
            }
        });
    });
    
    function handleProductCardClick(clickedCard) {
        const isExpanded = clickedCard.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse the clicked card
            collapseProductCard(clickedCard);
        } else {
            // Expand the clicked card and collapse others
            expandProductCard(clickedCard);
        }
    }
    
    function expandProductCard(card) {
        // Collapse all cards first
        collapseAllProductCards();
        
        // Expand the clicked card
        card.classList.add('expanded');
        productsGrid.classList.add('has-expanded');
        
        // Update ARIA attributes
        card.setAttribute('aria-expanded', 'true');
        
        // Smooth scroll for mobile
        if (window.innerWidth < 768) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        console.log('Expanded product card:', card.dataset.card);
    }
    
    function collapseProductCard(card) {
        card.classList.remove('expanded');
        card.setAttribute('aria-expanded', 'false');
        checkProductExpandedState();
    }
    
    function collapseAllProductCards() {
        productCards.forEach(card => {
            card.classList.remove('expanded');
            card.setAttribute('aria-expanded', 'false');
        });
    }
    
    function checkProductExpandedState() {
        const hasExpanded = Array.from(productCards).some(card => 
            card.classList.contains('expanded')
        );
        
        if (hasExpanded) {
            productsGrid.classList.add('has-expanded');
        } else {
            productsGrid.classList.remove('has-expanded');
        }
    }
    
    console.log('Product cards initialized:', productCards.length);
});

// Management Team Accordions
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing management accordions...');
    
    const managementAccordions = document.querySelectorAll('.manager-card.accordion-item');
    
    managementAccordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        const arrow = accordion.querySelector('.accordion-arrow');
        const content = accordion.querySelector('.accordion-content');
        
        if (!header || !arrow || !content) {
            console.warn('Missing elements in management accordion:', accordion);
            return;
        }
        
        // Set initial state
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        arrow.textContent = '→';
        
        header.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Management accordion clicked');
            
            const isActive = accordion.classList.contains('active');
            
            // Close all other management accordions
            managementAccordions.forEach(otherAccordion => {
                if (otherAccordion !== accordion) {
                    closeManagementAccordion(otherAccordion);
                }
            });
            
            // Toggle current accordion
            if (!isActive) {
                openManagementAccordion(accordion);
            } else {
                closeManagementAccordion(accordion);
            }
        });
    });
    
    function openManagementAccordion(accordion) {
        const content = accordion.querySelector('.accordion-content');
        const arrow = accordion.querySelector('.accordion-arrow');
        
        accordion.classList.add('active');
        arrow.textContent = '←';
        
        // Calculate content height
        content.style.maxHeight = 'none';
        const fullHeight = content.scrollHeight + 'px';
        content.style.maxHeight = '0px';
        
        // Trigger animation
        setTimeout(() => {
            content.style.maxHeight = fullHeight;
            content.style.opacity = '1';
        }, 10);
    }
    
    function closeManagementAccordion(accordion) {
        const content = accordion.querySelector('.accordion-content');
        const arrow = accordion.querySelector('.accordion-arrow');
        
        accordion.classList.remove('active');
        arrow.textContent = '→';
        
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
    }
    
    console.log('Management accordions initialized:', managementAccordions.length);
});

// Nested Accordion Functionality for Viducation - COMPLETELY REWRITTEN
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing nested accordions...');
    
    // Remove any existing event listeners first
    const nestedHeaders = document.querySelectorAll('.nested-accordion-header');
    nestedHeaders.forEach(header => {
        header.replaceWith(header.cloneNode(true));
    });
    
    const nestedAccordions = document.querySelectorAll('.nested-accordion-item');
    
    nestedAccordions.forEach((accordion, index) => {
        const header = accordion.querySelector('.nested-accordion-header');
        const arrow = accordion.querySelector('.nested-accordion-arrow');
        const content = accordion.querySelector('.nested-accordion-content');
        
        // Set initial state - ALL CLOSED
        content.style.maxHeight = '0px';
        content.style.overflow = 'hidden';
        arrow.textContent = '→';
        accordion.classList.remove('active');
        
        // Add single click event listener
        header.addEventListener('click', function(e) {
            console.log('Nested accordion clicked:', index);
            
            // Get fresh references to elements
            const currentAccordion = this.parentElement;
            const currentContent = currentAccordion.querySelector('.nested-accordion-content');
            const currentArrow = currentAccordion.querySelector('.nested-accordion-arrow');
            const isCurrentlyActive = currentAccordion.classList.contains('active');
            
            console.log('Current state:', isCurrentlyActive);
            
            // Close all other nested accordions
            nestedAccordions.forEach(otherAccordion => {
                if (otherAccordion !== currentAccordion) {
                    const otherContent = otherAccordion.querySelector('.nested-accordion-content');
                    const otherArrow = otherAccordion.querySelector('.nested-accordion-arrow');
                    
                    otherAccordion.classList.remove('active');
                    otherContent.style.maxHeight = '0px';
                    otherArrow.textContent = '→';
                }
            });
            
            // Toggle current accordion
            if (isCurrentlyActive) {
                // Close it
                currentAccordion.classList.remove('active');
                currentContent.style.maxHeight = '0px';
                currentArrow.textContent = '→';
                console.log('Closed nested accordion');
            } else {
                // Open it
                currentAccordion.classList.add('active');
                
                // Calculate height and animate
                currentContent.style.maxHeight = 'none';
                const fullHeight = currentContent.scrollHeight + 'px';
                currentContent.style.maxHeight = '0px';
                
                setTimeout(() => {
                    currentContent.style.maxHeight = fullHeight;
                }, 10);
                
                currentArrow.textContent = '↓';
                console.log('Opened nested accordion');
            }
            
            // Prevent any other handlers
            e.stopPropagation();
            return false;
        });
    });
    
    console.log('Nested accordions initialized:', nestedAccordions.length);
});

// Debug function to test nested accordions
function testNestedAccordions() {
    console.log('=== Testing Nested Accordions ===');
    const accordions = document.querySelectorAll('.nested-accordion-item');
    accordions.forEach((acc, i) => {
        const title = acc.querySelector('h3').textContent;
        const isActive = acc.classList.contains('active');
        console.log(`${i + 1}. ${title} - Active: ${isActive}`);
    });
}

// Management Team Accordions - COMPLETELY FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing management accordions...');
    
    const managementAccordions = document.querySelectorAll('.manager-card.accordion-item');
    
    managementAccordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        const arrow = accordion.querySelector('.accordion-arrow');
        const content = accordion.querySelector('.accordion-content');
        
        if (!header || !arrow || !content) {
            console.warn('Missing elements in management accordion:', accordion);
            return;
        }
        
        // Set initial state - COMPLETELY HIDDEN
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        content.style.visibility = 'hidden';
        content.style.overflow = 'hidden';
        arrow.textContent = '→';
        
        header.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Management accordion clicked:', accordion.querySelector('.manager-name').textContent);
            
            const isActive = accordion.classList.contains('active');
            
            // Close all other management accordions
            managementAccordions.forEach(otherAccordion => {
                if (otherAccordion !== accordion && otherAccordion.classList.contains('active')) {
                    closeManagementAccordion(otherAccordion);
                }
            });
            
            // Toggle current accordion
            if (!isActive) {
                openManagementAccordion(accordion);
            } else {
                closeManagementAccordion(accordion);
            }
        });
    });
    
    function openManagementAccordion(accordion) {
        const content = accordion.querySelector('.accordion-content');
        const arrow = accordion.querySelector('.accordion-arrow');
        
        accordion.classList.add('active');
        arrow.textContent = '←';
        
        // Make content visible first
        content.style.visibility = 'visible';
        content.style.overflow = 'hidden';
        
        // Calculate content height
        content.style.maxHeight = 'none';
        const fullHeight = content.scrollHeight + 'px';
        content.style.maxHeight = '0px';
        
        // Trigger animation
        setTimeout(() => {
            content.style.maxHeight = fullHeight;
            content.style.opacity = '1';
        }, 10);
        
        console.log('Opened management accordion');
    }
    
    function closeManagementAccordion(accordion) {
        const content = accordion.querySelector('.accordion-content');
        const arrow = accordion.querySelector('.accordion-arrow');
        
        accordion.classList.remove('active');
        arrow.textContent = '→';
        
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        
        // Hide content completely after transition
        setTimeout(() => {
            if (!accordion.classList.contains('active')) {
                content.style.visibility = 'hidden';
                content.style.overflow = 'hidden';
            }
        }, 400);
        
        console.log('Closed management accordion');
    }
    
    console.log('Management accordions initialized:', managementAccordions.length);
});
