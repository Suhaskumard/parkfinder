import "./BackToTop.css";

/**
 * Initializes the global premium "Back to Top" floating button.
 * Dynamically handles DOM injection, optimized scroll/resize listeners,
 * active scroll-to-top tracking, arrow direction flipping, and glow pulse triggers.
 */
export function initBackToTop() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Prevent duplicate injection
  if (document.getElementById("back-to-top-btn")) return;

  // Create the floating button element
  const button = document.createElement("button");
  button.id = "back-to-top-btn";
  button.className = "back-to-top";
  button.setAttribute("aria-label", "Back to top");
  button.setAttribute("title", "Back to top");
  button.setAttribute("type", "button");

  // Injected SVG Chevron-Up wrapped in an icon span to handle rotation cleanly
  button.innerHTML = `
    <span class="back-to-top-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="m18 15-6-6-6 6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  `;

  document.body.appendChild(button);

  let isScrollingToTop = false;
  let lastScrollY = window.scrollY || document.documentElement.scrollTop;

  // Check scroll position and height to toggle button visibility, handle scroll-end states
  const checkVisibility = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // Only display if page is scrollable beyond current viewport height
    const isScrollable = scrollHeight - clientHeight > 150;

    // Show button if page is scrollable and scroll distance exceeds 300px
    if (isScrollable && scrollY > 300) {
      button.classList.add("visible");
    } else {
      // Hide button (unless it's currently scrolling to top, to prevent premature fade-out)
      if (!isScrollingToTop) {
        button.classList.remove("visible");
      }
    }

    // Scroll completion tracking
    if (isScrollingToTop) {
      if (scrollY <= 3) {
        // Reached the top successfully
        isScrollingToTop = false;
        button.classList.remove("scrolling");
        button.classList.remove("visible"); // Hide once at the top

        // Trigger premium neon soft pulse glow
        button.classList.add("pulse");
        setTimeout(() => {
          button.classList.remove("pulse");
        }, 750);
      } else if (scrollY > lastScrollY && scrollY > 20) {
        // Scroll direction reversed (user manually scrolled down during smooth scroll)
        isScrollingToTop = false;
        button.classList.remove("scrolling");
      }
    }

    lastScrollY = scrollY;
  };

  // Performance-optimized scroll handler using requestAnimationFrame
  let isTicking = false;
  const handleScroll = () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        checkVisibility();
        isTicking = false;
      });
      isTicking = true;
    }
  };

  // Attach optimized event listeners
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll, { passive: true });

  // Handle smooth scroll-to-top action on click with arrow rotating downward
  button.addEventListener("click", () => {
    // Prevent double triggers if already scrolling to top
    if (isScrollingToTop) return;

    isScrollingToTop = true;
    
    // Add scrolling class to flip the chevron 180 degrees downwards
    button.classList.add("scrolling");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // Run initial visibility check immediately
  checkVisibility();
}

// Safely boot feature once DOM loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBackToTop);
} else {
  initBackToTop();
}
