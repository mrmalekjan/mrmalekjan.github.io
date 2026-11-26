/* ==========================================================================
   Mohammadreza Malekjan — Portfolio Interactivity (part 1)
   ========================================================================== */

(function () {
  'use strict';

  // Theme toggle (dark / light) with localStorage persistence
  const THEME_KEY = 'portfolio-theme';
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem(THEME_KEY);
  const systemPrefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  function setTheme(theme) {
    if (theme === 'light') {
      htmlEl.classList.add('light');
      localStorage.setItem(THEME_KEY, 'light');
    } else {
      htmlEl.classList.remove('light');
      localStorage.setItem(THEME_KEY, 'dark');
    }
  }

  if (savedTheme) {
    setTheme(savedTheme);
  } else if (systemPrefersDark) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = htmlEl.classList.contains('light');
      setTheme(isLight ? 'dark' : 'light');
    });
  }
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active nav link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  function highlightNav() {
    const scrollY = window.pageYOffset;
    let current = null;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 90;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  }

  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();
  }
  // Scroll reveal animations via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
    );
    revealElements.forEach((el) => observer.observe(el));
  }

  // Typing effect for the hero lead paragraph
  const typingTarget = document.getElementById('typing-target');
  const BIO_TEXT =
    'Innovative Control & Machine Learning Engineer experienced in designing robust ' +
    'control systems, deploying AI/ML models, and building embedded & IoT products ' +
    'across PLC, ARM/STM32 (FreeRTOS), Python, React, and ASP.NET.';

  if (typingTarget) {
    let i = 0;
    function type() {
      if (i < BIO_TEXT.length) {
        typingTarget.textContent += BIO_TEXT.charAt(i);
        i++;
        setTimeout(type, 15);
      }
    }
    if (document.visibilityState === 'visible') {
      setTimeout(type, 300);
    } else {
      document.addEventListener(
        'visibilitychange',
        () => {
          if (document.visibilityState === 'visible') setTimeout(type, 300);
        },
        { once: true }
      );
    }
  }
  // Current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Contact form submission (mailto fallback for static hosting)
  const contactForm = document.querySelector('.contact-form');
  const formMsg = document.querySelector('.form-msg');

  if (contactForm && formMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const subject = encodeURIComponent(
        `Portfolio inquiry from ${formData.get('name') || 'a visitor'}`
      );
      const body = encodeURIComponent(
        `Name: ${formData.get('name') || ''}\n` +
        `Email: ${formData.get('email') || ''}\n\n` +
        `${formData.get('message') || ''}`
      );
      const mailtoLink = `mailto:malak1377mm@gmail.com?subject=${subject}&body=${body}`;
      formMsg.textContent = 'Opening your email client…';
      formMsg.style.color = 'var(--color-accent)';
      window.location.href = mailtoLink;
      setTimeout(() => {
        formMsg.textContent = '';
      }, 4000);
    });
  }

  // Smooth scroll offset correction for sticky header
  if (window.CSS && CSS.supports('scroll-padding-top', '80px')) {
    document.documentElement.style.scrollPaddingTop = '80px';
  }
})();