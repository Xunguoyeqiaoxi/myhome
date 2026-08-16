(() => {
  "use strict";

  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");
  const navLinks = [...document.querySelectorAll("[data-nav-link]")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const revealItems = [...document.querySelectorAll(".reveal:not(.is-visible)")];
  const year = document.querySelector("[data-current-year]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (year) year.textContent = new Date().getFullYear();

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const closeMenu = () => {
    if (!navToggle || !navPanel) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "打开导航菜单");
    navPanel.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  navToggle?.addEventListener("click", () => {
    const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
    navToggle.setAttribute("aria-expanded", String(willOpen));
    navToggle.setAttribute("aria-label", willOpen ? "关闭导航菜单" : "打开导航菜单");
    navPanel?.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("nav-open", willOpen);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeMenu();
  });

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        navLinks.forEach((link) => {
          const target = link.getAttribute("href")?.slice(1);
          link.classList.toggle("is-active", target === visible.target.id);
        });
      },
      { rootMargin: "-30% 0px -55%", threshold: [0, 0.1, 0.3] },
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const canvas = document.getElementById("starfield");
  const context = canvas?.getContext("2d", { alpha: true });

  if (!canvas || !context) return;

  let width = 0;
  let height = 0;
  let stars = [];
  let frame = 0;
  let isPageVisible = !document.hidden;

  const createStars = () => {
    const count = Math.min(190, Math.max(70, Math.floor((width * height) / 9500)));

    stars = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 0.8 + (index % 29 === 0 ? 0.65 : 0.08),
      alpha: Math.random() * 0.5 + 0.12,
      speed: Math.random() * 0.0008 + 0.0002,
      phase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.018,
    }));
  };

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    createStars();
  };

  const drawMilkyWay = () => {
    const gradient = context.createLinearGradient(width * 0.24, height, width * 0.88, 0);
    gradient.addColorStop(0, "rgba(69, 99, 132, 0)");
    gradient.addColorStop(0.42, "rgba(84, 118, 153, 0.026)");
    gradient.addColorStop(0.62, "rgba(112, 145, 176, 0.045)");
    gradient.addColorStop(1, "rgba(69, 99, 132, 0)");
    context.save();
    context.translate(width * 0.56, height * 0.48);
    context.rotate(-0.47);
    context.fillStyle = gradient;
    context.filter = "blur(18px)";
    context.fillRect(-width * 0.5, -height * 0.13, width, height * 0.26);
    context.restore();
  };

  const draw = (time = 0) => {
    context.clearRect(0, 0, width, height);
    drawMilkyWay();

    stars.forEach((star) => {
      if (!reducedMotion.matches) {
        star.x += star.drift;
        if (star.x < -2) star.x = width + 2;
        if (star.x > width + 2) star.x = -2;
      }

      const shimmer = reducedMotion.matches ? 0.78 : 0.72 + Math.sin(time * star.speed + star.phase) * 0.28;
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(220, 235, 245, ${star.alpha * shimmer})`;
      context.fill();
    });

    if (isPageVisible && !reducedMotion.matches) frame = requestAnimationFrame(draw);
  };

  const restartAnimation = () => {
    cancelAnimationFrame(frame);
    draw(0);
  };

  document.addEventListener("visibilitychange", () => {
    isPageVisible = !document.hidden;
    if (isPageVisible) restartAnimation();
    else cancelAnimationFrame(frame);
  });

  reducedMotion.addEventListener?.("change", restartAnimation);
  window.addEventListener("resize", resizeCanvas, { passive: true });

  resizeCanvas();
  draw(0);
})();
