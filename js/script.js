if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Page load entry animations (Hero and UI transitions)
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            initPageLoadAnimations();
            initSvgHoverAnimations();
            initPageTransitions();
            initGridParallax();
        });
    } else {
        initPageLoadAnimations();
        initSvgHoverAnimations();
        initPageTransitions();
        initGridParallax();
    }

    // Scroll animations initialization (Runs only after all layout heights are fully calculated)
    if (document.readyState === "complete") {
        initScrollAnimations();
        ScrollTrigger.refresh();
    } else {
        window.addEventListener("load", () => {
            initScrollAnimations();
            ScrollTrigger.refresh();
        });
    }
}

// 1. Page Load Intro Timeline
function initPageLoadAnimations() {
    // Reveal main page container and footer safely from opacity 0 to 1 with slide-up
    gsap.from("main, .site-footer", { 
        opacity: 0, 
        y: 15, 
        duration: 0.6, 
        stagger: 0.08,
        ease: "power3.out" 
    });
    
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    heroTl.from(".greeting-badge", { opacity: 0, scale: 0.8, duration: 0.6 })
          .from(".hero-name", { opacity: 0, y: 30, duration: 0.8, ease: "power4.out" }, "-=0.4")
          .from(".hero-tagline", { opacity: 0, x: -20, duration: 0.6 }, "-=0.5")
          .from(".hero-desc", { opacity: 0, y: 20, duration: 0.8 }, "-=0.5")
          .from(".hero-actions-new", { opacity: 0, y: 15, duration: 0.6 }, "-=0.5")
          .from(".socials-container", { opacity: 0, y: 15, duration: 0.6 }, "-=0.5")
          .from(".hero-glass-frame", { opacity: 0, scale: 0.95, rotateX: 8, rotateY: -8, duration: 0.8 }, "-=0.8")
          .from(".hero-orbit-ring", { opacity: 0, scale: 0.8, duration: 1.0 }, "-=0.7")
          .from(".metrics-panel", { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
          .add(() => {
              animateMetricsNumbers();
          }, "-=0.5");
}

// 2. Metrics Numbers Count Up
function animateMetricsNumbers() {
    document.querySelectorAll(".metric-num").forEach((el) => {
        const text = el.textContent.trim();
        const num = parseInt(text, 10);
        if (isNaN(num)) return;
        const suffix = text.replace(num, "");
        const obj = { val: 0 };
        gsap.to(obj, {
            val: num,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
                el.textContent = Math.floor(obj.val) + suffix;
            }
        });
    });
}

// 3. Scroll-Triggered Layout Animations
function initScrollAnimations() {
    // Staggered projects slide-up
    if (document.querySelector(".project-grid-new")) {
        gsap.from(".project-card-new", {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".project-grid-new",
                start: "top 95%",
                toggleActions: "play none none none"
            }
        });
    }

    // Staggered skills card zoom-in
    if (document.querySelector(".skill-categories-stack")) {
        gsap.from(".skill-card-new", {
            opacity: 0,
            scale: 0.7,
            duration: 0.6,
            stagger: 0.03,
            ease: "back.out(1.5)",
            scrollTrigger: {
                trigger: ".skill-categories-stack",
                start: "top 95%",
                toggleActions: "play none none none"
            }
        });
    }

    // Experience timeline line and nodes
    if (document.querySelector(".timeline-container-new")) {
        gsap.to(".timeline-line-new", {
            scaleY: 1,
            duration: 1.2,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: ".timeline-container-new",
                start: "top 95%",
                toggleActions: "play none none none"
            }
        });

        gsap.from(".timeline-node-new", {
            opacity: 0,
            x: 30,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".timeline-container-new",
                start: "top 95%",
                toggleActions: "play none none none"
            }
        });
    }

    // Contact card reveal
    if (document.querySelector(".contact-banner-glass")) {
        gsap.from(".contact-banner-left > *", {
            opacity: 0,
            x: -40,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".contact-banner-glass",
                start: "top 95%",
                toggleActions: "play none none none"
            }
        });

        gsap.from(".quick-info-card", {
            opacity: 0,
            x: 40,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".contact-banner-glass",
                start: "top 95%",
                toggleActions: "play none none none"
            }
        });

        gsap.from(".contact-action-row", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".contact-banner-glass",
                start: "top 95%",
                toggleActions: "play none none none"
            }
        });
    }

    // Section headers fade & slide up reveal on scroll
    document.querySelectorAll(".section-heading, .box-heading-wrapper").forEach((header) => {
        gsap.from(header, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: header,
                start: "top 95%",
                toggleActions: "play none none none"
            }
        });
    });

}

// 4. Interactive SVG Micro-Animations
function initSvgHoverAnimations() {
    document.querySelectorAll(".skill-card-new").forEach((card) => {
        const title = card.getAttribute("title");
        const svg = card.querySelector("svg");
        if (!svg) return;

        let hoverTween = null;

        card.addEventListener("mouseenter", () => {
            if (title === "React") {
                // Continuous spin
                hoverTween = gsap.to(svg, {
                    rotate: 360,
                    transformOrigin: "center center",
                    duration: 4,
                    repeat: -1,
                    ease: "none"
                });
            } else if (title === "Gemini AI") {
                // Pulse sparkles
                const paths = svg.querySelectorAll("path");
                hoverTween = gsap.to(paths, {
                    scale: 1.18,
                    transformOrigin: "center center",
                    duration: 0.45,
                    yoyo: true,
                    repeat: -1,
                    ease: "power1.inOut",
                    stagger: 0.08
                });
            } else if (title === "Git") {
                // Pulse branching circles
                const circles = svg.querySelectorAll("circle");
                hoverTween = gsap.to(circles, {
                    r: "+=0.8",
                    duration: 0.5,
                    yoyo: true,
                    repeat: -1,
                    stagger: 0.12
                });
            } else {
                // Bounce and rotate
                hoverTween = gsap.to(svg, {
                    y: -3,
                    rotate: 8,
                    duration: 0.25,
                    yoyo: true,
                    repeat: 1,
                    ease: "power1.inOut"
                });
            }
        });

        card.addEventListener("mouseleave", () => {
            if (hoverTween) {
                hoverTween.kill();
                gsap.to(svg.querySelectorAll("path, circle, ellipse"), {
                    clearProps: "all",
                    duration: 0.25
                });
                gsap.to(svg, {
                    clearProps: "all",
                    duration: 0.25
                });
            }
        });
    });
}

// 5. Page Transitions & Smooth Anchor Links
function initPageTransitions() {
    document.querySelectorAll('a').forEach((link) => {
        const href = link.getAttribute("href");
        const targetAttr = link.getAttribute("target");

        if (!href) return;

        // Case A: Smooth scroll for internal hash links on the same page
        if (href.startsWith("#")) {
            link.addEventListener("click", (event) => {
                if (href === "#") return;
                const targetEl = document.querySelector(href);
                if (targetEl) {
                    event.preventDefault();
                    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
            return;
        }

        // Case B: Ignore links that open in a new tab, mailto/tel, external, or javascript:
        if (
            targetAttr === "_blank" ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("http://") ||
            href.startsWith("https://") ||
            href.startsWith("javascript:")
        ) {
            return;
        }

        // Case C: Smooth transition for internal pages (same tab)
        link.addEventListener("click", (event) => {
            event.preventDefault();
            
            const targets = document.querySelectorAll("main, .site-footer");
            gsap.to(targets, {
                opacity: 0,
                y: -15,
                duration: 0.4,
                ease: "power3.in",
                onComplete: () => {
                    window.location.href = href;
                }
            });
        });
    });
}

function validateForm(form) {
    if (!form) {
        return false;
    }

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message ? form.message.value.trim() : "";

    if (!name || !email || !message) {
        alert("Please fill in your name, email, and message.");
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    return true;
}

// Google Sheets Web App URL - Paste your script URL here
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx-1w-0ENREuQ350-oZmYufW4zraoH2wotUtD1ZrUSUQ3rJEL-D_5RWC4tuincGyh5t_A/exec';

document.querySelectorAll('form[name="contactForm"]').forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!validateForm(form)) {
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending Message...";
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const postData = {
            name: formData.get("name").trim(),
            email: formData.get("email").trim(),
            message: formData.get("message") ? formData.get("message").trim() : ""
        };

        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_WEB_APP_URL') {
            alert("Please configure your GOOGLE_SCRIPT_URL in js/script.js!");
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", // Crucial: Handles redirect without CORS blocks
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        })
            .then(() => {
                alert("Thank you, " + postData.name + "! Your message has been sent successfully.");
                form.reset();
            })
            .catch((err) => {
                console.error("Submission Error:", err);
                alert("Something went wrong. Please try again.");
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
});

// 6. High-Performance Background Grid Parallax Effect
function initGridParallax() {
    const grid = document.querySelector(".bg-grid");
    if (!grid) return;

    // quickTo is highly optimized for rapid property updates like mousemove events
    const gridXTo = gsap.quickTo(grid, "x", { duration: 1.2, ease: "power2.out" });
    const gridYTo = gsap.quickTo(grid, "y", { duration: 1.2, ease: "power2.out" });

    document.addEventListener("mousemove", (e) => {
        // Calculate normalized cursor position (-1 to 1) from screen center
        const normX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const normY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        
        // Shift grid in the opposite direction (max 18px translation)
        gridXTo(-normX * 18);
        gridYTo(-normY * 18);
    });

    document.addEventListener("mouseleave", () => {
        // Reset grid position when mouse leaves the page
        gridXTo(0);
        gridYTo(0);
    });
}


