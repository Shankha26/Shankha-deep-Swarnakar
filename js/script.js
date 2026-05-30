const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.16
});

document.querySelectorAll(".reveal, .hidden").forEach((element) => {
    revealObserver.observe(element);
});

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll(".skill-fill").forEach((bar) => {
                bar.style.width = bar.dataset.width || "0";
            });
        }
    });
}, {
    threshold: 0.35
});

document.querySelectorAll("#skills, .skills-grid, .page-shell").forEach((section) => {
    skillObserver.observe(section);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

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
