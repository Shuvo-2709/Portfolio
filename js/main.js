// ===== Typing Effect =====
const typingEl = document.getElementById("typing");

if (typingEl) {
  const words = ["Shuvajit", "Developer", "Coder"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const current = words[wordIndex];

    if (!isDeleting) {
      typingEl.textContent = current.substring(0, charIndex++);
    }
    else {
      typingEl.textContent = current.substring(0, charIndex--);
    }

    let speed = isDeleting ? 60 : 120;

    if (!isDeleting && charIndex === current.length + 1) {
      speed = 1000;
      isDeleting = true;
    }
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 400;
    }

    setTimeout(typeEffect, speed);
  }

  setTimeout(typeEffect, 500);
}

/* --- MOBILE MENU --- */
function toggleMenu() {
  let menu = document.getElementById('mobile-menu');
  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'mobile-menu';
    menu.className = 'mobile-menu';

    const links = [
      ['index.html', 'Home'],
      ['about.html', 'About'],
      ['skills.html', 'Skills'],
      ['projects.html', 'Projects'],
      ['achievements.html', 'Achievements'],
      ['contact.html', 'Contact'],
    ];

    links.forEach(([href, label]) => {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      menu.appendChild(a);
    });

    document.body.appendChild(menu);
  }
  menu.classList.toggle('open');
}

/* --- SMOOTH SCROLL for in-page links --- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* --- PROJECT FILTER (projects.html) --- */
function filterProjects(cat, btn) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Show/hide cards
  document.querySelectorAll('.project-card').forEach(card => {
    if (cat === 'all' || card.getAttribute('data-cat') === cat) {
      card.classList.remove('hidden');
    }
    else {
      card.classList.add('hidden');
    }
  });
}

/* --- CONTACT FORM VALIDATION (contact.html) --- */
function showError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(fieldId + '-error');
  if (field) field.classList.add('error');
  if (errEl) errEl.textContent = msg;
}

function handleSubmit(e) {
  e.preventDefault();
  let valid = true;

  // Clear previous errors
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-group input, .form-group textarea')
    .forEach(el => el.classList.remove('error'));

  // Validate name
  const name = document.getElementById('fname');
  if (name && name.value.trim().length < 2) {
    showError('fname', 'Please enter your full name.');
    valid = false;
  }

  // Validate email
  const email = document.getElementById('femail');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRe.test(email.value.trim())) {
    showError('femail', 'Please enter a valid email address.');
    valid = false;
  }

  // Validate job role
  const jobrole = document.getElementById('fjobrole');
  if (jobrole && jobrole.value.trim() === '') {
    showError('fjobrole', 'Please select a job role.');
    valid = false;
  }

  // Validate message
  const msg = document.getElementById('fmessage');
  if (msg && msg.value.trim().length < 10) {
    showError('fmessage', 'Message must be at least 10 characters.');
    valid = false;
  }

  if (valid) {
    showPopup()
    e.target.reset();
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  }
}

// popup functions
function showPopup() {
  const popup = document.getElementById("popup");
  if (popup) popup.classList.add("show");
}

function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) popup.classList.remove("show");
}

/* --- PAGE LOAD ANIMATIONS --- */
function initAnimations() {
  const els = document.querySelectorAll(
    'h1, h2, .hero-text, .subtitle, .hero-buttons, .hero-stats,' +
    '.about-grid, .skill-card, .project-card,' +
    '.cert-card, .timeline-item, .contact-wrap, .carousel-section, .milestone-card'
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
        entry.target.style.opacity = '1';
        entry.target.style.transform = '';

        setTimeout(() => {
          entry.target.style.transition = '';
        }, 600 + i * 50);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    observer.observe(el);
  });
}

/* --- ACHIEVEMENT CAROUSEL --- */
function initAchievementCarousel() {
  const container = document.getElementById("achievement-carousel");
  if (!container) return;

  const slides = container.querySelectorAll(".carousel-slide");
  const dots = container.querySelectorAll(".carousel-dots .dot");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const counter = document.getElementById("carousel-counter");

  if (!slides.length) return;

  let current = 0;
  const total = slides.length;
  let autoPlayTimer = null;

  function updateSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    if (counter) {
      counter.textContent = `${index + 1} / ${total}`;
    }
    current = index;
  }

  function nextSlide() {
    updateSlide((current + 1) % total);
  }

  function prevSlide() {
    updateSlide((current - 1 + total) % total);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetTimer();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const idx = parseInt(dot.getAttribute("data-index"), 10);
      if (!isNaN(idx)) {
        updateSlide(idx);
        resetTimer();
      }
    });
  });

  function startTimer() {
    if (!autoPlayTimer) {
      autoPlayTimer = setInterval(nextSlide, 4500);
    }
  }

  function stopTimer() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function resetTimer() {
    stopTimer();
    startTimer();
  }

  container.addEventListener("mouseenter", stopTimer);
  container.addEventListener("mouseleave", startTimer);

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener(
    "touchstart",
    e => {
      touchStartX = e.changedTouches[0].screenX;
      stopTimer();
    },
    { passive: true }
  );

  container.addEventListener(
    "touchend",
    e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startTimer();
    },
    { passive: true }
  );

  startTimer();
}

/* --- INIT --- */
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  initAchievementCarousel();

  const sections = document.querySelectorAll(".page-section");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(sec => observer.observe(sec));

  document.addEventListener("click", (e) => {
    const menu = document.getElementById("mobile-menu");
    const toggle = document.querySelector(".nav-toggle") || {};

    if (menu && !menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove("open");
    }
    if (e.target.closest("#mobile-menu a")) {
      menu?.classList.remove("open");
    }
  });

  // ===== LIVE INPUT VALIDATION FIX =====
  const inputs = document.querySelectorAll(
    '#fname, #femail, #fjobrole, #fmessage'
  );

  inputs.forEach(input => {
    input.addEventListener("input", () => {
      input.classList.remove("error");

      const errorEl = document.getElementById(input.id + "-error");
      if (errorEl) errorEl.textContent = "";
    });

    input.addEventListener("change", () => {
      input.classList.remove("error");

      const errorEl = document.getElementById(input.id + "-error");
      if (errorEl) errorEl.textContent = "";
    });
  });

  // ===== Smooth Animated Counter =====
  const counters = document.querySelectorAll(".stat-num");

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        const el = entry.target;
        const target = +el.getAttribute("data-target");

        let start = 0;
        const duration = 2000; // 2 seconds animation
        const startTime = performance.now();

        function update(currentTime) {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const value = Math.floor(progress * target);

          el.textContent = value;

          if (progress < 1) {
            requestAnimationFrame(update);
          }
          else {
            el.textContent = target + "+";
          }
        }

        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  });

  counters.forEach(counter => counterObserver.observe(counter));

  // ===== XML LOAD =====
fetch("projects.xml")
  .then(res => res.text())
  .then(data => {

    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "text/xml");
    const projects = xml.getElementsByTagName("project");

    let output = "";

    for (let i = 0; i < projects.length; i++) {

      const title = projects[i].getElementsByTagName("title")[0].textContent;
      const desc = projects[i].getElementsByTagName("description")[0].textContent;
      const number = projects[i].getElementsByTagName("number")[0].textContent;
      const category = projects[i].getAttribute("category");

      // STACK
      const techs = projects[i].getElementsByTagName("tech");
      let stackHTML = "";

      for (let j = 0; j < techs.length; j++) {
        stackHTML += `<span class="proj-tag">${techs[j].textContent}</span>`;
      }

      // LINKS
      const github = projects[i].getElementsByTagName("github")[0]?.textContent.trim();
      const live = projects[i].getElementsByTagName("live")[0]?.textContent.trim();

      let linksHTML = "";

      if (github) {
        linksHTML += `<a href="${github}" class="proj-link" target="_blank" rel="noopener noreferrer">GitHub →</a>`;
      }

      if (live) {
        linksHTML += `<a href="${live}" class="proj-link" target="_blank" rel="noopener noreferrer">Live Demo →</a>`;
      }

      // FINAL CARD
      output += `
        <div class="project-card" data-cat="${category}">
          <div class="proj-num">${number}</div>
          <h3>${title}</h3>
          <p>${desc}</p>

          <div class="proj-stack">
            ${stackHTML}
          </div>

          <div class="proj-links">
            ${linksHTML}
          </div>
        </div>
      `;
    }

    // INSERT INTO HTML
    const container = document.getElementById("xml-projects");

    if (container) {
      container.innerHTML = output;
    }

  })
  .catch(err => console.error("XML Load Error:", err));
});