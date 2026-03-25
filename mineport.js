document.addEventListener("DOMContentLoaded", function () {
    const html = document.documentElement;
    const body = document.body;
    const enterForm = document.getElementById("enterForm");
    const nameInput = document.getElementById("name");
    const enterButton = document.getElementById("enterButton");
    const subtitle = document.getElementById("subtitle");
    const viewToggle = document.getElementById("viewToggle");
    const projectGrid = document.querySelector(".project-grid");
    const protectedLinks = document.querySelectorAll('a[href="#projects"], a[href="#about"], a[href="#contact"]');
    const categoryLinks = document.querySelectorAll(".category-link");
    const projectCards = document.querySelectorAll(".project-card");
    const defaultSubtitleText = "welcome to my home page.";
    let hasEntered = false;

    html.classList.add("is-locked");
    body.classList.add("is-locked");

    function updateButtonState() {
        if (!nameInput || !enterButton) {
            return;
        }

        enterButton.disabled = nameInput.value.trim() === "";
    }

    function updateSubtitle() {
        if (!nameInput || !subtitle) {
            return;
        }

        const enteredName = nameInput.value.trim();
        subtitle.textContent = enteredName === "" ? defaultSubtitleText : "welcome, " + enteredName;
    }

    function smoothScrollTo(targetY, duration) {
        const startY = window.scrollY;
        const distance = targetY - startY;
        const startTime = performance.now();

        function easeInOutCubic(progress) {
            return progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        }

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            window.scrollTo(0, startY + distance * easedProgress);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    }

    function unlockPage(name) {
        hasEntered = true;
        html.classList.remove("is-locked");
        body.classList.remove("is-locked");
        updateSubtitle();
    }

    updateButtonState();
    updateSubtitle();

    if (nameInput) {
        nameInput.addEventListener("input", function () {
            updateButtonState();
            updateSubtitle();
        });
        nameInput.addEventListener("keyup", updateSubtitle);
    }

    if (enterForm) {
        enterForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const enteredName = nameInput ? nameInput.value.trim() : "";

            if (enteredName === "") {
                updateButtonState();
                return;
            }

            unlockPage(enteredName);
            const projectsSection = document.getElementById("projects");

            if (projectsSection) {
                smoothScrollTo(projectsSection.offsetTop, 1800);
            }
        });
    }

    protectedLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            if (!hasEntered) {
                event.preventDefault();
            }
        });
    });

    function applyFilter(filter) {
        projectCards.forEach(function (card) {
            const category = card.dataset.category;
            const shouldShow = filter === "all" || category === filter;
            card.style.display = shouldShow ? "" : "none";
        });
    }

    function formatCategory(category) {
        return (category || "").replace(/^\w/, function (match) {
            return match.toUpperCase();
        });
    }

    projectCards.forEach(function (card, index) {
        card.style.setProperty("--card-index", index);
        const title = card.querySelector(".project-caption h2");
        const location = card.querySelector(".project-caption p");
        const listInfo = document.createElement("div");
        listInfo.className = "project-list-info";
        listInfo.innerHTML =
            '<p class="project-list-title">' + (title ? title.textContent : "") + "</p>" +
            '<p class="project-list-category">' + formatCategory(card.dataset.category) + "</p>" +
            '<p class="project-list-location">' + (location ? location.textContent : "") + "</p>" +
            '<p class="project-list-year">' + (card.dataset.year || "") + "</p>";
        card.appendChild(listInfo);

        card.addEventListener("click", function () {
            card.classList.add("is-revealed");
        });
    });

    categoryLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            const filter = link.dataset.filter;

            categoryLinks.forEach(function (item) {
                item.classList.remove("is-active");
            });

            link.classList.add("is-active");
            applyFilter(filter);
        });
    });

    if (viewToggle && projectGrid) {
        viewToggle.addEventListener("click", function () {
            const isListView = projectGrid.classList.toggle("is-list-view");
            projectGrid.classList.remove("is-switching-to-grid", "is-switching-to-list");
            void projectGrid.offsetWidth;
            projectGrid.classList.add(isListView ? "is-switching-to-list" : "is-switching-to-grid");
            viewToggle.classList.toggle("is-active", isListView);
            viewToggle.setAttribute("aria-pressed", String(isListView));
            viewToggle.setAttribute("aria-label", isListView ? "Switch to grid view" : "Switch to list view");

            window.setTimeout(function () {
                projectGrid.classList.remove("is-switching-to-grid", "is-switching-to-list");
            }, 2050);
        });
    }
});
