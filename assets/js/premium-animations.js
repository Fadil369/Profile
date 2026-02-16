/*******************************************************************************
 * Premium Animations & UX Enhancements
 * Smooth scroll animations and interactive elements
 ******************************************************************************/

(function() {
  'use strict';

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-on-scroll');
        // Unobserve after animation to improve performance
        animateOnScroll.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Elements to animate on scroll
  const elementsToAnimate = [
    '.card',
    '.project',
    '.news-item',
    '.post-item',
    '.profile',
    'h1',
    'h2',
    'h3',
    '.tech-badge-container',
    'table',
    'blockquote'
  ];

  // Initialize animations when DOM is ready
  function initializeAnimations() {
    elementsToAnimate.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        animateOnScroll.observe(element);
      });
    });
  }

  // Smooth scroll for anchor links
  function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#' && href !== '#!') {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            // Update URL without jumping
            if (history.pushState) {
              history.pushState(null, null, href);
            }
          }
        }
      });
    });
  }

  // Enhanced navbar on scroll
  function initializeNavbarEnhancement() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    const navbarHeight = navbar.offsetHeight;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Add shadow when scrolled
      if (currentScroll > 10) {
        navbar.classList.add('scrolled');
        navbar.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
      } else {
        navbar.classList.remove('scrolled');
        navbar.style.boxShadow = '';
      }

      // Hide/show navbar on scroll (optional - can be disabled)
      // Uncomment the following lines to enable auto-hide navbar
      /*
      if (currentScroll > lastScroll && currentScroll > navbarHeight) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      */

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // Loading state for images
  function initializeImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
      // Add loading class
      img.classList.add('img-loading');
      
      // Remove loading class when image loads
      img.addEventListener('load', () => {
        img.classList.remove('img-loading');
        img.classList.add('img-loaded');
      });

      // Handle errors
      img.addEventListener('error', () => {
        img.classList.remove('img-loading');
        img.classList.add('img-error');
      });
    });
  }

  // Card hover parallax effect (subtle)
  function initializeCardParallax() {
    const cards = document.querySelectorAll('.card, .premium-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        // Very subtle tilt effect
        const rotateX = deltaY * 2;
        const rotateY = -deltaX * 2;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Ripple effect on buttons
  function initializeRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .btn-premium, button');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // Progress indicator as you scroll down the page
  function initializeScrollProgress() {
    const progressBar = document.querySelector('.progress-bar, #progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = (window.pageYOffset / documentHeight) * 100;
      
      if (progressBar.style) {
        progressBar.style.width = scrolled + '%';
      }
    }, { passive: true });
  }

  // Copy code button enhancement
  function initializeCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(code => {
      const pre = code.parentElement;
      if (!pre.querySelector('.copy-code-button')) {
        const button = document.createElement('button');
        button.className = 'copy-code-button';
        button.innerHTML = '📋 Copy';
        button.title = 'Copy to clipboard';
        
        button.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(code.textContent);
            button.innerHTML = '✓ Copied!';
            button.classList.add('copied');
            
            setTimeout(() => {
              button.innerHTML = '📋 Copy';
              button.classList.remove('copied');
            }, 2000);
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        });
        
        pre.style.position = 'relative';
        pre.appendChild(button);
      }
    });
  }

  // Add CSS for animations
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Fade in animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-on-scroll {
        animation: fadeInUp 0.6s ease forwards;
      }

      /* Image loading states */
      .img-loading {
        opacity: 0.5;
        filter: blur(5px);
      }

      .img-loaded {
        opacity: 1;
        filter: blur(0);
        transition: opacity 0.3s ease, filter 0.3s ease;
      }

      .img-error {
        opacity: 0.3;
      }

      /* Ripple effect */
      .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }

      @keyframes ripple-animation {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }

      button, .btn, .btn-premium {
        position: relative;
        overflow: hidden;
      }

      /* Copy code button */
      .copy-code-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        background: var(--color-bg-subtle, #f6f8fa);
        border: 1px solid var(--color-border, #d0d7de);
        border-radius: 6px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 10;
      }

      pre:hover .copy-code-button {
        opacity: 1;
      }

      .copy-code-button.copied {
        background: var(--color-success, #1a7f37);
        color: white;
        border-color: var(--color-success, #1a7f37);
      }

      /* Navbar transition */
      .navbar {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize everything when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      injectStyles();
      initializeAnimations();
      initializeSmoothScroll();
      initializeNavbarEnhancement();
      initializeImageLoading();
      initializeCardParallax();
      initializeRippleEffect();
      initializeScrollProgress();
      initializeCodeCopy();
    });
  } else {
    // DOM already loaded
    injectStyles();
    initializeAnimations();
    initializeSmoothScroll();
    initializeNavbarEnhancement();
    initializeImageLoading();
    initializeCardParallax();
    initializeRippleEffect();
    initializeScrollProgress();
    initializeCodeCopy();
  }

})();
