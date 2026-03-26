document.addEventListener("DOMContentLoaded", function () {
    const html = document.documentElement;
    const body = document.body;
    const enterForm = document.getElementById("enterForm");
    const nameInput = document.getElementById("name");
    const enterButton = document.getElementById("enterButton");
    const subtitle = document.getElementById("subtitle");
    const aboutInstagramText = document.getElementById("aboutInstagramText");
    const viewToggle = document.getElementById("viewToggle");
    const projectGrid = document.querySelector(".project-grid");
    const sectionReturn = document.getElementById("sectionReturn");
    const aboutInfoToggles = document.querySelectorAll(".about-info-toggle");
    const sectionNavs = document.querySelectorAll(".top-nav, .project-top-nav, .about-nav");
    const sectionLinks = document.querySelectorAll('a[href^="#"]');
    const protectedLinks = document.querySelectorAll('a[href="#projects"], a[href="#about"], a[href="#contact"]');
    const categoryLinks = document.querySelectorAll(".category-link");
    const projectCards = document.querySelectorAll(".project-card");
    const defaultSubtitleText = "welcome to my home page.";
    const sections = ["home", "projects", "about", "contact"]
        .map(function (id) {
            return document.getElementById(id);
        })
        .filter(Boolean);
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

        if (aboutInstagramText) {
            aboutInstagramText.textContent = enteredName === ""
                ? "Do you want to connect to YLX studio on Instagram?"
                : enteredName + ", do you want to connect to YLX studio on Instagram?";
        }
    }

    function smoothScrollTo(targetY) {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const destinationY = Math.max(0, Math.min(targetY, maxScroll));

        window.scrollTo({
            top: destinationY,
            behavior: "smooth"
        });
    }

    function smoothScrollToSection(section) {
        if (!section) {
            return;
        }

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function isAnyNavVisible() {
        return Array.from(sectionNavs).some(function (nav) {
            const rect = nav.getBoundingClientRect();
            return rect.bottom > 0 && rect.top < 120;
        });
    }

    function updateSectionReturnVisibility() {
        if (!sectionReturn) {
            return;
        }

        const shouldShow = window.scrollY > 240 && !isAnyNavVisible();
        sectionReturn.classList.toggle("is-visible", shouldShow);
    }

    function getCurrentSection() {
        const currentScroll = window.scrollY + 120;
        let currentSection = sections[0];

        sections.forEach(function (section) {
            if (section.offsetTop <= currentScroll) {
                currentSection = section;
            }
        });

        return currentSection;
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
                smoothScrollToSection(projectsSection);
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

    sectionLinks.forEach(function (link) {
        const href = link.getAttribute("href");
        const targetId = href ? href.slice(1) : "";
        const targetSection = targetId ? document.getElementById(targetId) : null;

        if (!targetSection) {
            return;
        }

        link.addEventListener("click", function (event) {
            if (!hasEntered && targetId !== "home") {
                return;
            }

            event.preventDefault();
            smoothScrollToSection(targetSection);
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

    if (sectionReturn) {
        sectionReturn.addEventListener("click", function () {
            const currentSection = getCurrentSection();

            if (currentSection) {
                smoothScrollToSection(currentSection);
            }
        });
    }

    aboutInfoToggles.forEach(function (toggle) {
        toggle.addEventListener("click", function () {
            const block = toggle.closest(".about-info-block");
            const shouldOpen = block ? !block.classList.contains("is-open") : false;

            aboutInfoToggles.forEach(function (item) {
                const itemBlock = item.closest(".about-info-block");

                if (itemBlock) {
                    itemBlock.classList.remove("is-open");
                }

                item.setAttribute("aria-expanded", "false");
            });

            if (block && shouldOpen) {
                block.classList.add("is-open");
                toggle.setAttribute("aria-expanded", "true");
            }
        });
    });

    window.addEventListener("scroll", updateSectionReturnVisibility, { passive: true });
    window.addEventListener("resize", updateSectionReturnVisibility);
    updateSectionReturnVisibility();
});
