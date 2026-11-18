(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    console.error("Canvas 2D context is unavailable; homepage particles are disabled.");
    return;
  }

  canvas.className = "homepage-particles";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const particles = [];
  const maxDistance = 150;
  let width = 0;
  let height = 0;
  let mouse = null;
  let animationFrame = 0;

  const createParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.24,
    vy: (Math.random() - 0.5) * 0.24,
    radius: Math.random() * 1.2 + 0.7,
  });

  const resize = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const targetCount = Math.min(72, Math.max(20, Math.round((width * height) / 18000)));
    while (particles.length < targetCount) particles.push(createParticle());
    particles.length = targetCount;

    for (const particle of particles) {
      particle.x = Math.min(particle.x, width);
      particle.y = Math.min(particle.y, height);
    }
  };

  const drawConnection = (from, to, distance, color) => {
    if (distance >= maxDistance) return;

    const opacity = 0.18 * (1 - distance / maxDistance);
    context.strokeStyle = `rgba(${color}, ${opacity})`;
    context.lineWidth = 0.8;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  };

  const animate = () => {
    if (document.hidden) {
      animationFrame = 0;
      return;
    }

    context.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i += 1) {
      const particle = particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      for (let j = i + 1; j < particles.length; j += 1) {
        const other = particles[j];
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
        drawConnection(particle, other, distance, "125, 185, 255");
      }

      if (mouse) {
        const distance = Math.hypot(particle.x - mouse.x, particle.y - mouse.y);
        drawConnection(particle, mouse, distance, "196, 181, 253");
      }

      context.fillStyle = "rgba(186, 215, 255, 0.65)";
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    }

    if (mouse) {
      context.fillStyle = "rgba(196, 181, 253, 0.8)";
      context.beginPath();
      context.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
      context.fill();
    }

    animationFrame = window.requestAnimationFrame(animate);
  };

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener(
    "pointermove",
    (event) => {
      mouse = { x: event.clientX, y: event.clientY };
    },
    { passive: true },
  );
  window.addEventListener("pointerleave", () => {
    mouse = null;
  });
  window.addEventListener("blur", () => {
    mouse = null;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    } else if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(animate);
    }
  });

  resize();
  animationFrame = window.requestAnimationFrame(animate);
})();
