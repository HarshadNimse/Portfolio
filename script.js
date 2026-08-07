document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // PRELOADER
  // ==========================================================================
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("hidden");
    }, 1600);
  });
  // Fallback: hide preloader after 3 seconds no matter what
  setTimeout(() => preloader.classList.add("hidden"), 3000);

  // ==========================================================================
  // CUSTOM CURSOR (Desktop Only)
  // ==========================================================================
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");

  if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });

    // Smooth ring follow
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + "px";
      cursorRing.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Show cursor after a brief delay
    setTimeout(() => document.body.classList.add("cursor-ready"), 200);

    // Scale ring on hover over interactive elements
    const interactiveElements = document.querySelectorAll("a, button, .skill-card, .project-card, .featured-project, .cert-card, .contact-card, .filter-btn, .skill-tab, .resume-dl-btn, input, textarea");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => cursorRing.classList.add("hovering"));
      el.addEventListener("mouseleave", () => cursorRing.classList.remove("hovering"));
    });
  }

  // ==========================================================================
  // PROFILE IMAGE FALLBACK
  // ==========================================================================
  const profileImg = document.getElementById("profileImg");
  const profileFallback = document.getElementById("profileFallback");

  if (profileImg) {
    profileImg.addEventListener("error", () => {
      profileImg.classList.add("hidden");
      if (profileFallback) profileFallback.classList.add("active");
    });
  }

  // ==========================================================================
  // MOBILE NAVIGATION
  // ==========================================================================
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // ==========================================================================
  // THEME TOGGLE
  // ==========================================================================
  const themeToggle = document.getElementById("themeToggle");
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);

  themeToggle.addEventListener("click", () => {
    const theme = document.documentElement.getAttribute("data-theme");
    const newTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    anime({
      targets: themeToggle,
      rotate: "+=360",
      scale: [1, 1.2, 1],
      duration: 500,
      easing: "easeInOutBack",
    });
  });

  // ==========================================================================
  // SCROLL PROGRESS BAR
  // ==========================================================================
  const scrollProgress = document.getElementById("scrollProgress");

  window.addEventListener("scroll", () => {
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    if (height > 0) {
      scrollProgress.style.width = `${(scrollPosition / height) * 100}%`;
    }
  });

  // ==========================================================================
  // PARTICLE CANVAS
  // ==========================================================================
  const canvas = document.getElementById("particleCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let canvasMouseX = 0, canvasMouseY = 0;
    const PARTICLE_COUNT = 70;
    const CONNECTION_DISTANCE = 120;
    const MOUSE_RADIUS = 150;

    function resizeCanvas() {
      const hero = document.getElementById("home");
      if (!hero) return;
      canvas.width = window.innerWidth;
      canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get computed primary color for particles
      const computedStyle = getComputedStyle(document.documentElement);
      const primaryColor = computedStyle.getPropertyValue("--primary").trim() || "#6366f1";

      // Parse hex to RGB
      let r = 99, g = 102, b = 241;
      if (primaryColor.startsWith("#")) {
        const hex = primaryColor.slice(1);
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }

      particles.forEach((p, i) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse interaction — gentle push away
        const dx = p.x - canvasMouseX;
        const dy = p.y - canvasMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Dampen velocity
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < CONNECTION_DISTANCE) {
            const opacity = (1 - cdist / CONNECTION_DISTANCE) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(drawParticles);
    }

    // Track mouse for particle interaction
    document.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      canvasMouseX = e.clientX - rect.left;
      canvasMouseY = e.clientY - rect.top;
    });

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });
  }

  // ==========================================================================
  // TYPING EFFECT
  // ==========================================================================
  const typingElement = document.getElementById("typingText");
  if (typingElement) {
    const phrases = [
      "scalable backend systems.",
      "data pipelines & ETL workflows.",
      "interactive web applications.",
      "intelligent automation.",
      "secure REST APIs.",
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 60;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          typeSpeed = 1800; // Pause before deleting
        } else {
          typeSpeed = 55 + Math.random() * 40;
        }
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          typeSpeed = 400; // Pause before typing next
        } else {
          typeSpeed = 30;
        }
      }

      setTimeout(type, typeSpeed);
    }

    // Start after preloader
    setTimeout(type, 2000);
  }

  // ==========================================================================
  // COUNTER ANIMATION
  // ==========================================================================
  const statNumbers = document.querySelectorAll(".stat-number");
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute("data-target"));
      const obj = { value: 0 };

      anime({
        targets: obj,
        value: target,
        round: 1,
        duration: 1500,
        easing: "easeOutExpo",
        update: () => {
          el.textContent = obj.value;
        },
      });
    });
  }

  // Trigger counters when hero is visible (they're above the fold, so trigger early)
  setTimeout(animateCounters, 2200);

  // ==========================================================================
  // TILT EFFECT ON CARDS
  // ==========================================================================
  if (window.matchMedia("(pointer: fine)").matches) {
    const profileCard = document.getElementById("profileCard");
    const tiltCards = document.querySelectorAll(".tilt-card");

    function applyTilt(card, e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    function resetTilt(card) {
      card.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    }

    // Profile card tilt
    if (profileCard) {
      profileCard.addEventListener("mousemove", (e) => applyTilt(profileCard, e));
      profileCard.addEventListener("mouseleave", () => resetTilt(profileCard));
    }

    // Project cards tilt
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => applyTilt(card, e));
      card.addEventListener("mouseleave", () => resetTilt(card));
    });
  }

  // ==========================================================================
  // SKILLS TABS
  // ==========================================================================
  const skillTabs = document.querySelectorAll(".skill-tab");
  const skillPanels = document.querySelectorAll(".skill-panel");

  skillTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Deactivate all
      skillTabs.forEach((t) => t.classList.remove("active"));
      skillPanels.forEach((p) => p.classList.remove("active"));

      // Activate clicked
      tab.classList.add("active");
      const panelId = "panel-" + tab.getAttribute("data-tab");
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.classList.add("active");

        // Animate skill cards entrance
        anime({
          targets: panel.querySelectorAll(".skill-card"),
          opacity: [0, 1],
          scale: [0.9, 1],
          translateY: [15, 0],
          delay: anime.stagger(40),
          duration: 400,
          easing: "easeOutBack",
        });
      }
    });
  });

  // ==========================================================================
  // PROJECT FILTERING
  // ==========================================================================
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const featuredProject = document.querySelector(".featured-project");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      // Animate out
      anime({
        targets: ".project-card, .featured-project",
        scale: 0.85,
        opacity: 0,
        duration: 200,
        easing: "easeInQuad",
        complete: () => {
          // Toggle visibility
          projectCards.forEach((card) => {
            const category = card.getAttribute("data-category");
            if (filterValue === "all" || category === filterValue) {
              card.classList.remove("hide");
            } else {
              card.classList.add("hide");
            }
          });

          if (featuredProject) {
            const featCategory = featuredProject.getAttribute("data-category");
            if (filterValue === "all" || featCategory === filterValue) {
              featuredProject.classList.remove("hide");
            } else {
              featuredProject.classList.add("hide");
            }
          }

          // Animate in
          anime({
            targets: ".project-card:not(.hide), .featured-project:not(.hide)",
            scale: [0.85, 1],
            opacity: [0, 1],
            translateY: [15, 0],
            delay: anime.stagger(60),
            duration: 450,
            easing: "easeOutBack",
          });
        },
      });
    });
  });

  // ==========================================================================
  // TIMELINE LINE ANIMATION
  // ==========================================================================
  const timelineLine = document.getElementById("timelineLine");
  if (timelineLine) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timelineLine.style.height = "100%";
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    const experienceSection = document.getElementById("experience");
    if (experienceSection) timelineObserver.observe(experienceSection);
  }

  // ==========================================================================
  // CONTACT FORM — mailto fallback
  // ==========================================================================
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const message = document.getElementById("contactMessage").value.trim();

      if (!name || !email || !message) return;

      // Construct mailto link
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );
      const mailtoLink = `mailto:nimseharshad@gmail.com?subject=${subject}&body=${body}`;

      window.open(mailtoLink, "_blank");

      // Visual feedback
      const submitBtn = contactForm.querySelector(".form-submit");
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        Opening Mail Client...
      `;
      submitBtn.style.pointerEvents = "none";

      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.pointerEvents = "auto";
        contactForm.reset();
      }, 3000);
    });
  }

  // ==========================================================================
  // ANIME.JS HERO INTRO ANIMATION
  // ==========================================================================
  const introTimeline = anime.timeline({
    easing: "easeOutCubic",
    delay: 1600, // After preloader
  });

  introTimeline
    .add({
      targets: ".availability-badge",
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 500,
    })
    .add({
      targets: ".hero-content .eyebrow",
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 500,
      offset: "-=350",
    })
    .add({
      targets: ".hero-content h1",
      opacity: [0, 1],
      translateY: [25, 0],
      duration: 700,
      offset: "-=350",
    })
    .add({
      targets: ".typing-line",
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 500,
      offset: "-=450",
    })
    .add({
      targets: ".hero-content .hero-text",
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 500,
      offset: "-=400",
    })
    .add({
      targets: ".hero-actions .btn, .hero-actions .resume-dropdown",
      opacity: [0, 1],
      translateY: [10, 0],
      delay: anime.stagger(80),
      duration: 500,
      offset: "-=350",
    })
    .add({
      targets: ".hero-stats .stat-item",
      opacity: [0, 1],
      translateY: [15, 0],
      delay: anime.stagger(80),
      duration: 500,
      offset: "-=400",
    })
    .add({
      targets: ".profile-card",
      opacity: [0, 1],
      scale: [0.92, 1],
      translateY: [25, 0],
      duration: 800,
      easing: "easeOutElastic(1, 0.8)",
      offset: "-=600",
    });

  // ==========================================================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================================================
  const reveals = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add("active");

          // Section-specific animations
          if (target.id === "about") {
            anime({
              targets: "#about .glass-card",
              opacity: [0, 1],
              translateY: [30, 0],
              delay: anime.stagger(120),
              duration: 700,
              easing: "easeOutQuad",
            });
          } else if (target.id === "skills") {
            anime({
              targets: "#skills .skill-tab",
              opacity: [0, 1],
              translateY: [15, 0],
              delay: anime.stagger(60),
              duration: 400,
              easing: "easeOutQuad",
            });
            anime({
              targets: "#skills .skill-panel.active .skill-card",
              opacity: [0, 1],
              scale: [0.9, 1],
              translateY: [20, 0],
              delay: anime.stagger(50),
              duration: 500,
              easing: "easeOutBack",
            });
          } else if (target.id === "projects") {
            anime({
              targets: "#projects .featured-project, #projects .project-card",
              opacity: [0, 1],
              translateY: [35, 0],
              delay: anime.stagger(100),
              duration: 750,
              easing: "easeOutCubic",
            });
          } else if (target.id === "experience") {
            anime({
              targets: "#experience .timeline-card",
              opacity: [0, 1],
              translateX: [-25, 0],
              duration: 800,
              easing: "easeOutCubic",
            });
          } else if (target.id === "education") {
            anime({
              targets: "#education .education-card",
              opacity: [0, 1],
              translateY: [25, 0],
              delay: anime.stagger(120),
              duration: 700,
              easing: "easeOutQuad",
            });
          } else if (target.id === "certifications") {
            anime({
              targets: "#certifications .cert-card",
              opacity: [0, 1],
              scale: [0.92, 1],
              translateY: [25, 0],
              delay: anime.stagger(60),
              duration: 600,
              easing: "easeOutElastic(1, 0.85)",
            });
          } else if (target.classList.contains("contact-section")) {
            anime({
              targets: "#contact .glass-card, #contact .contact-card, #contact .resume-downloads",
              opacity: [0, 1],
              translateY: [25, 0],
              delay: anime.stagger(80),
              duration: 600,
              easing: "easeOutCubic",
            });
          }

          observer.unobserve(target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -30px 0px",
    }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  // ==========================================================================
  // HEADER SCROLL EFFECT — subtle shadow on scroll
  // ==========================================================================
  const siteHeader = document.getElementById("siteHeader");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      siteHeader.style.boxShadow = "0 4px 20px var(--shadow)";
    } else {
      siteHeader.style.boxShadow = "none";
    }
    lastScroll = currentScroll;
  });
});
