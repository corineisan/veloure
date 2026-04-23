console.log("corineisan");
function scrollToProducts() {
  const section = document.getElementById("featuredproducts");
  if (!section) return;

  section.scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    section.querySelectorAll(".card").forEach((card, i) => {
      setTimeout(() => card.classList.add("show"), i * 200);
    });
  }, 400);
}

/* ---------- Navbar active link ---------- */
(function initNavActive() {
  const links = document.querySelectorAll(".nav-links a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
})();

/* ---------- Cart icon badge (localStorage) ---------- */
(function initCart() {
  let count = parseInt(localStorage.getItem("velour_cart") || "0");

  function updateBadge() {
    let badge = document.getElementById("cart-badge");
    if (!badge) {
      const cartImg = document.querySelector(".nav-links img[alt='Cart']");
      if (!cartImg) return;
      const wrap = document.createElement("div");
      wrap.style.cssText = "position:relative;display:inline-flex;";
      cartImg.parentNode.insertBefore(wrap, cartImg);
      wrap.appendChild(cartImg);
      badge = document.createElement("span");
      badge.id = "cart-badge";
      badge.style.cssText = `
        position:absolute;top:-6px;right:-6px;
        background:#b8895a;color:#fff;
        border-radius:50%;width:16px;height:16px;
        font-size:10px;display:flex;align-items:center;
        justify-content:center;font-weight:600;
        transition:transform .2s;
        ${count === 0 ? "display:none;" : ""}
      `;
      wrap.appendChild(badge);
    }
    badge.textContent = count;
    badge.style.display = count === 0 ? "none" : "flex";
  }

  // expose global so "Add to cart" buttons can call it
  window.addToCart = function () {
    count++;
    localStorage.setItem("velour_cart", count);
    updateBadge();
    const badge = document.getElementById("cart-badge");
    if (badge) {
      badge.style.transform = "scale(1.4)";
      setTimeout(() => badge.style.transform = "scale(1)", 200);
    }
  };

  updateBadge();
})();

/* ---------- Product card "Add to cart" buttons ---------- */
(function initProductButtons() {
  document.querySelectorAll(".card").forEach(card => {
    if (card.querySelector(".add-to-cart-btn")) return; // already added

    const btn = document.createElement("button");
    btn.className = "add-to-cart-btn";
    btn.textContent = "Add to Cart";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.addToCart();
      btn.textContent = "Added ✓";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = "Add to Cart";
        btn.classList.remove("added");
      }, 1500);
    });
    card.appendChild(btn);
  });
})();


/* ---------- Products page: category navigation ---------- */
document.addEventListener("DOMContentLoaded", () => {

  (function initCategoryNav() {
    const categories = document.querySelectorAll(".category-btn");
    if (!categories.length) return;

    categories.forEach(btn => {
      btn.addEventListener("click", () => {
        categories.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // 🔽 SCROLL
        const section = document.getElementById("products");
        console.log(window.location.href);

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }

        const target = btn.dataset.category;

        document.querySelectorAll(".product-item").forEach(item => {
          const match = target === "all" || item.dataset.category === target;

          if (match) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  })();

});

/* ---------- Scroll-reveal for cards ---------- */
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".card, .review-card, .benefit, .stat").forEach(el => {
    el.classList.add("reveal");
    observer.observe(el);
  });
})();

/* ---------- Stats counter animation ---------- */
(function initCounters() {
  const stats = document.querySelectorAll(".stat h2");
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.replace(/[^0-9.]/g, "");
      const target = parseFloat(raw);
      const suffix = el.textContent.replace(/[0-9.]/g, "").trim();
      if (isNaN(target)) return;
      observer.unobserve(el);

      let start = 0;
      const duration = 1400;
      const step = 16;
      const increment = target / (duration / step);

      const timer = setInterval(() => {
        start = Math.min(start + increment, target);
        el.textContent = (Number.isInteger(target) ? Math.round(start) : start.toFixed(1)) + suffix;
        if (start >= target) clearInterval(timer);
      }, step);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
})();

/* ---------- Mobile nav toggle (hamburger) ---------- */
(function initMobileNav() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const hamburger = document.createElement("button");
  hamburger.className = "hamburger";
  hamburger.setAttribute("aria-label", "Toggle menu");
  hamburger.innerHTML = `<span></span><span></span><span></span>`;
  navbar.appendChild(hamburger);

  const nav = document.querySelector(".nav-links");
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    nav.classList.toggle("mobile-open");
  });
})();