document.addEventListener("DOMContentLoaded", function () {
    const html = document.documentElement;
    const body = document.body;
    const enterForm = document.getElementById("enterForm");
    const nameInput = document.getElementById("name");
    const enterButton = document.getElementById("enterButton");
    const title = document.querySelector(".title");
    const subtitle = document.getElementById("subtitle");
    const aboutInstagramText = document.getElementById("aboutInstagramText");
    const viewToggle = document.getElementById("viewToggle");
    const projectGrid = document.querySelector(".project-grid");
    const drawingsTrack = document.getElementById("drawingsTrack");
    const drawingsPrev = document.getElementById("drawingsPrev");
    const drawingsNext = document.getElementById("drawingsNext");
    const projectDetailOverlay = document.getElementById("projectDetailOverlay");
    const projectDetailClose = document.getElementById("projectDetailClose");
    const projectDetailTitle = document.getElementById("projectDetailTitle");
    const projectDetailLocation = document.getElementById("projectDetailLocation");
    const projectDetailCategory = document.getElementById("projectDetailCategory");
    const projectDetailYear = document.getElementById("projectDetailYear");
    const projectDetailDescription = document.getElementById("projectDetailDescription");
    const projectDetailGallery = document.getElementById("projectDetailGallery");
    const sectionReturn = document.getElementById("sectionReturn");
    const aboutInfoToggles = document.querySelectorAll(".about-info-toggle");
    const sectionNavs = document.querySelectorAll(".top-nav, .project-top-nav, .drawings-nav, .about-nav");
    const sectionLinks = document.querySelectorAll('a[href^="#"]');
    const protectedLinks = document.querySelectorAll('a[href="#projects"], a[href="#drawings"], a[href="#about"], a[href="#contact"]');
    const stackedSections = document.querySelectorAll(".drawings-section, .about-section, .contact-section");
    const categoryLinks = document.querySelectorAll(".category-link");
    const projectCards = document.querySelectorAll(".project-card");
    const defaultSubtitleText = "welcome to my home page.";
    const scrollDuration = 1600;
    const subtitleEnterAnimationDuration = 760;
    const sections = ["home", "projects", "drawings", "about", "contact"]
        .map(function (id) {
            return document.getElementById(id);
        })
        .filter(Boolean);
    let hasEntered = false;
    let activeScrollFrame = null;
    let hasPlayedFirstTypedAnimation = false;
    let lastFocusedProjectCard = null;
    let projectDetailCloseTimer = null;
    let drawingsIndex = 0;
    let drawingsLoopReady = false;
    let drawingsVisibleCount = getDrawingsVisibleCount();
    let isSectionStackTicking = false;
    html.classList.add("is-locked");
    body.classList.add("is-locked");

    const projectDetailData = [
        { title: "Double Interaction", location: "Taipei, Taiwan", category: "Architecture", year: "2014-2026", description: ["A spatial study shaped by shifting views, layered circulation, and a quiet exchange between structure and movement.", "The project is conceived as a sequence of measured moments where public openness and intimate pause can coexist."], images: ["project1.jpg", "project2.jpg", "project3.jpg", "project4.jpg", "project5.jpg", "project6.jpg"] },
        { title: "Euphoria", location: "Senior Center", category: "Art", year: "2018-2018", description: ["An atmospheric proposal focused on warmth, memory, and collective rhythm within a shared interior setting.", "Material contrast and soft transitions are used to create a sense of dignity, comfort, and calm energy."], images: ["project2.jpg", "project1.jpg", "project6.jpg", "project3.jpg"] },
        { title: "Light, Stone, Hope", location: "Taipei, Taiwan", category: "Design", year: "2018-2025", description: ["A design composition where light and material weight are balanced to produce a restrained but emotional field.", "The visual language stays minimal while allowing texture, shadow, and proportion to carry the narrative."], images: ["project3.jpg", "project5.jpg", "project1.jpg", "project4.jpg"] },
        { title: "Stone Horizon House", location: "Los Angeles, USA", category: "Architecture", year: "2018-2026", description: ["A residential concept framed by long horizons, low silhouettes, and a measured relationship between land and enclosure.", "The project explores how stillness can be expressed through geometry, light, and carefully edited material transitions."], images: ["project4.jpg", "project1.jpg", "project5.jpg", "project6.jpg", "project3.jpg"] },
        { title: "Stone Horizon House", location: "Los Angeles, USA", category: "Design", year: "2018-2026", description: ["An interior-forward reading of the project that focuses on tactile surfaces, tone, and a disciplined editing of detail.", "Furniture, openings, and circulation are treated as part of one continuous visual composition."], images: ["project5.jpg", "project3.jpg", "project4.jpg", "project2.jpg"] },
        { title: "Stone Horizon House", location: "Los Angeles, USA", category: "Art", year: "2017-2020", description: ["This version extends the project into a more image-driven exploration of atmosphere and narrative framing.", "The result is less about object and more about mood, pacing, and emotional resonance."], images: ["project6.jpg", "project2.jpg", "project1.jpg", "project5.jpg"] },
        { title: "Stone Horizon House", location: "Los Angeles, USA", category: "Architecture", year: "2016-2024", description: ["A study in structural calm and horizontal emphasis, using massing to build quiet tension against the landscape.", "Its design language moves between solidity and openness without becoming heavy."], images: ["project1.jpg", "project4.jpg", "project6.jpg", "project2.jpg", "project5.jpg"] },
        { title: "Stone Horizon House", location: "Los Angeles, USA", category: "Art", year: "2019-2023", description: ["A visual narrative built from fragments of landscape, form, and silhouette rather than a single fixed object.", "The imagery focuses on atmosphere, contrast, and the emotional pacing of each frame."], images: ["project2.jpg", "project6.jpg", "project5.jpg", "project3.jpg"] },
        { title: "Stone Horizon House", location: "Los Angeles, USA", category: "Design", year: "2015-2021", description: ["A design exercise in compositional order, highlighting how proportion and alignment can carry visual clarity.", "Small shifts in edge, rhythm, and material tone shape the overall reading of the space."], images: ["project3.jpg", "project1.jpg", "project5.jpg", "project2.jpg"] },
        { title: "Stone Horizon House", location: "Los Angeles, USA", category: "Architecture", year: "2020-2024", description: ["An updated architectural proposal that refines the dialogue between envelope, light, and circulation.", "The project privileges spatial atmosphere over statement, allowing experience to unfold gradually."], images: ["project4.jpg", "project6.jpg", "project1.jpg", "project3.jpg", "project5.jpg"] },
        { title: "Stone Horizon House", location: "Los Angeles, USA", category: "Design", year: "2019-2026", description: ["A spatial design proposal centered on editing, restraint, and the visual weight of each surface condition.", "The composition seeks balance between tactile intimacy and overall formal control."], images: ["project5.jpg", "project4.jpg", "project2.jpg", "project1.jpg"] },
        { title: "Stone Horizon House", location: "Los Angeles, USA", category: "Art", year: "2018-2022", description: ["A project told through image sequences that emphasize mood, tempo, and the relationship between figure and background.", "It turns architecture into an emotional frame rather than a static object."], images: ["project6.jpg", "project3.jpg", "project2.jpg", "project4.jpg"] }
    ];

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
        const subtitleText = enteredName === "" ? defaultSubtitleText : "welcome, " + enteredName;

        if (enteredName === "") {
            setAnimatedText(subtitle, subtitleText, 22);
        } else if (!hasPlayedFirstTypedAnimation) {
            setAnimatedText(subtitle, subtitleText, 22);
            hasPlayedFirstTypedAnimation = true;
        } else {
            setStaticText(subtitle, subtitleText);
        }

        if (aboutInstagramText) {
            aboutInstagramText.textContent = enteredName === ""
                ? "Do you want to connect to YLX studio on Instagram?"
                : enteredName + ", do you want to connect to YLX studio on Instagram?";
        }
    }

    function setAnimatedText(element, text, stagger) {
        if (!element) {
            return;
        }

        element.textContent = "";
        element.classList.add("is-animated");
        element.setAttribute("aria-label", text);

        Array.from(text).forEach(function (char, index) {
            const span = document.createElement("span");
            span.className = "hero-char" + (char === " " ? " is-space" : "");
            span.textContent = char === " " ? "\u00A0" : char;
            span.setAttribute("aria-hidden", "true");
            span.style.animationDelay = (index * stagger) + "ms";
            element.appendChild(span);
        });
    }

    function setStaticText(element, text) {
        if (!element) {
            return;
        }

        element.classList.remove("is-animated");
        element.removeAttribute("aria-label");
        element.textContent = text;
    }

    function openProjectDetail(index, sourceCard) {
        const detail = projectDetailData[index];

        if (!detail || !projectDetailOverlay) {
            return;
        }

        const repeatedImageSource = detail.images[0];
        const galleryImageCount = Math.min(Math.max(detail.images.length, 4), 10);

        lastFocusedProjectCard = sourceCard || null;
        projectDetailTitle.textContent = detail.title;
        projectDetailLocation.textContent = detail.location;
        projectDetailCategory.textContent = detail.category;
        projectDetailYear.textContent = detail.year;
        projectDetailDescription.innerHTML = detail.description.map(function (paragraph) {
            return "<p>" + paragraph + "</p>";
        }).join("");
        projectDetailGallery.innerHTML = Array.from({ length: galleryImageCount }, function (_, imageIndex) {
            return '<figure class="project-detail-gallery-item" style="transition-delay:' + (imageIndex * 28) + 'ms"><img class="project-detail-gallery-image" src="' + repeatedImageSource + '" alt="' + detail.title + " image " + (imageIndex + 1) + '" loading="eager" decoding="async"></figure>';
        }).join("");

        if (projectDetailCloseTimer) {
            window.clearTimeout(projectDetailCloseTimer);
            projectDetailCloseTimer = null;
        }

        projectDetailOverlay.classList.remove("is-active");
        projectDetailOverlay.classList.add("is-visible");
        projectDetailOverlay.setAttribute("aria-hidden", "false");
        body.classList.add("is-project-detail-open");
        projectDetailGallery.scrollTop = 0;

        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
                projectDetailOverlay.classList.add("is-active");
            });
        });

        if (projectDetailClose) {
            window.setTimeout(function () {
                if (projectDetailOverlay.classList.contains("is-active")) {
                    projectDetailClose.focus({ preventScroll: true });
                }
            }, 220);
        }
    }

    function closeProjectDetail() {
        if (!projectDetailOverlay) {
            return;
        }

        projectDetailOverlay.classList.remove("is-active");
        projectDetailOverlay.setAttribute("aria-hidden", "true");
        projectDetailCloseTimer = window.setTimeout(function () {
            projectDetailOverlay.classList.remove("is-visible");
            body.classList.remove("is-project-detail-open");
            projectDetailCloseTimer = null;

            if (lastFocusedProjectCard) {
                lastFocusedProjectCard.focus();
            }
        }, 320);
    }

    function preloadProjectDetailImages() {
        const uniqueImages = Array.from(new Set(projectDetailData.flatMap(function (detail) {
            return detail.images.slice(0, 10);
        })));

        uniqueImages.forEach(function (imageSrc) {
            const image = new Image();
            image.decoding = "async";
            image.src = imageSrc;
        });
    }

    function easeInOutCubic(progress) {
        return progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    }

    function getDrawingsVisibleCount() {
        if (window.innerWidth <= 768) {
            return 1;
        }

        if (window.innerWidth <= 1080) {
            return 2;
        }

        return 3;
    }

    function buildDrawingsLoop() {
        if (!drawingsTrack) {
            return;
        }

        const baseCards = Array.from(drawingsTrack.querySelectorAll(".drawings-card")).filter(function (card) {
            return !card.hasAttribute("data-clone");
        });

        baseCards.forEach(function (card, index) {
            card.setAttribute("data-base-index", String(index));
        });

        drawingsTrack.querySelectorAll('[data-clone="true"]').forEach(function (card) {
            card.remove();
        });

        drawingsVisibleCount = getDrawingsVisibleCount();

        if (!baseCards.length) {
            return;
        }

        const prependCards = baseCards.slice(-drawingsVisibleCount).map(function (card) {
            const clone = card.cloneNode(true);
            clone.setAttribute("data-clone", "true");
            return clone;
        });

        const appendCards = baseCards.slice(0, drawingsVisibleCount).map(function (card) {
            const clone = card.cloneNode(true);
            clone.setAttribute("data-clone", "true");
            return clone;
        });

        prependCards.forEach(function (clone) {
            drawingsTrack.insertBefore(clone, drawingsTrack.firstChild);
        });

        appendCards.forEach(function (clone) {
            drawingsTrack.appendChild(clone);
        });

        drawingsTrack.style.transition = "none";
        drawingsIndex = drawingsVisibleCount;
        drawingsLoopReady = true;
    }

    function updateDrawingsCarousel() {
        if (!drawingsTrack) {
            return;
        }

        const cards = drawingsTrack.querySelectorAll(".drawings-card");
        const gap = window.innerWidth <= 768 ? 16 : 24;
        const viewport = drawingsTrack.parentElement;

        if (!cards.length || !viewport) {
            return;
        }

        drawingsVisibleCount = getDrawingsVisibleCount();
        const cardWidth = (viewport.clientWidth - (gap * (drawingsVisibleCount - 1))) / drawingsVisibleCount;
        const translateX = (cardWidth + gap) * drawingsIndex * -1;
        drawingsTrack.style.transform = "translateX(" + translateX + "px)";
    }

    function shiftDrawingsCarousel(direction) {
        if (!drawingsTrack || !drawingsLoopReady) {
            return;
        }

        const baseCardsCount = drawingsTrack.querySelectorAll(".drawings-card:not([data-clone])").length;

        if (!baseCardsCount) {
            return;
        }

        drawingsTrack.style.transition = "transform 0.8s cubic-bezier(0.2, 0.92, 0.24, 1)";
        drawingsIndex += direction;
        updateDrawingsCarousel();
    }

    function normalizeDrawingsLoopPosition() {
        if (!drawingsTrack || !drawingsLoopReady) {
            return;
        }

        const baseCardsCount = drawingsTrack.querySelectorAll(".drawings-card:not([data-clone])").length;

        if (!baseCardsCount) {
            return;
        }

        if (drawingsIndex >= baseCardsCount + drawingsVisibleCount) {
            drawingsTrack.style.transition = "none";
            drawingsIndex = drawingsVisibleCount;
            updateDrawingsCarousel();
        } else if (drawingsIndex < drawingsVisibleCount) {
            drawingsTrack.style.transition = "none";
            drawingsIndex = baseCardsCount + drawingsVisibleCount - 1;
            updateDrawingsCarousel();
        }
    }

    function smoothScrollTo(targetY) {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const destinationY = Math.max(0, Math.min(targetY, maxScroll));
        const startY = window.scrollY;
        const distance = destinationY - startY;
        const startTime = performance.now();

        if (activeScrollFrame) {
            window.cancelAnimationFrame(activeScrollFrame);
        }

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / scrollDuration, 1);
            const easedProgress = easeInOutCubic(progress);
            window.scrollTo(0, startY + (distance * easedProgress));

            if (progress < 1) {
                activeScrollFrame = window.requestAnimationFrame(step);
            } else {
                activeScrollFrame = null;
            }
        }

        activeScrollFrame = window.requestAnimationFrame(step);
    }

    function smoothScrollToSection(section) {
        if (!section) {
            return;
        }

        let targetY = section.offsetTop;

        if (section.classList.contains("drawings-section") || section.classList.contains("about-section") || section.classList.contains("contact-section")) {
            const overlapOffset = window.innerWidth <= 768
                ? window.innerHeight * 0.18
                : window.innerHeight * 0.34;
            targetY += overlapOffset;
        }

        smoothScrollTo(targetY);
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

    function updateSectionStackMotion() {
        stackedSections.forEach(function (section) {
            const rect = section.getBoundingClientRect();
            const triggerDistance = Math.min(window.innerHeight * 0.48, 420);
            let progress = 0;

            if (rect.top < triggerDistance) {
                progress = Math.min((triggerDistance - rect.top) / triggerDistance, 1);
            }

            section.style.setProperty("--section-separate", String(progress));
        });
    }

    function requestSectionStackMotion() {
        if (isSectionStackTicking) {
            return;
        }

        isSectionStackTicking = true;
        window.requestAnimationFrame(function () {
            updateSectionStackMotion();
            isSectionStackTicking = false;
        });
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

    function isSectionInViewport(section) {
        if (!section) {
            return false;
        }

        const rect = section.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    function unlockPage(name) {
        hasEntered = true;
        html.classList.remove("is-locked");
        body.classList.remove("is-locked");
    }

    setAnimatedText(title, title ? title.textContent : "", 42);
    updateButtonState();
    updateSubtitle();
    preloadProjectDetailImages();
    buildDrawingsLoop();
    updateDrawingsCarousel();

    if (nameInput) {
        nameInput.addEventListener("input", function () {
            updateButtonState();
            updateSubtitle();
        });
        nameInput.addEventListener("keyup", updateSubtitle);
    }

    if (drawingsPrev) {
        drawingsPrev.addEventListener("click", function () {
            shiftDrawingsCarousel(-1);
        });
    }

    if (drawingsNext) {
        drawingsNext.addEventListener("click", function () {
            shiftDrawingsCarousel(1);
        });
    }

    if (drawingsTrack) {
        drawingsTrack.addEventListener("transitionend", function (event) {
            if (event.propertyName === "transform") {
                normalizeDrawingsLoopPosition();
            }
        });
    }

    if (enterForm) {
        enterForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const enteredName = nameInput ? nameInput.value.trim() : "";

            if (enteredName === "") {
                updateButtonState();
                return;
            }

            setStaticText(subtitle, "welcome, " + enteredName);
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
        const detail = projectDetailData[index];
        card.style.setProperty("--card-index", index);
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        const title = card.querySelector(".project-caption h2");
        const location = card.querySelector(".project-caption p");
        const listInfo = document.createElement("div");
        listInfo.className = "project-list-info";
        listInfo.innerHTML =
            '<p class="project-list-title">' + (detail ? detail.title : (title ? title.textContent : "")) + "</p>" +
            '<p class="project-list-category">' + (detail ? detail.category : formatCategory(card.dataset.category)) + "</p>" +
            '<p class="project-list-location">' + (detail ? detail.location : (location ? location.textContent : "")) + "</p>" +
            '<p class="project-list-year">' + (detail ? detail.year : (card.dataset.year || "")) + "</p>";
        card.appendChild(listInfo);
        card.addEventListener("click", function () {
            openProjectDetail(index, card);
        });
        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProjectDetail(index, card);
            }
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

    if (sectionReturn) {
        sectionReturn.addEventListener("click", function () {
            const currentSection = getCurrentSection();
            const contactSection = document.getElementById("contact");
            const projectsSection = document.getElementById("projects");
            const targetSection = isSectionInViewport(contactSection)
                ? projectsSection
                : currentSection;

            if (targetSection) {
                smoothScrollToSection(targetSection);
            }
        });
    }

    if (projectDetailClose) {
        projectDetailClose.addEventListener("click", closeProjectDetail);
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && projectDetailOverlay && projectDetailOverlay.classList.contains("is-visible")) {
            closeProjectDetail();
        }
    });

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
    window.addEventListener("scroll", requestSectionStackMotion, { passive: true });
    window.addEventListener("resize", updateSectionReturnVisibility);
    window.addEventListener("resize", function () {
        buildDrawingsLoop();
        updateDrawingsCarousel();
        updateSectionStackMotion();
    });
    updateSectionReturnVisibility();
    updateSectionStackMotion();
});
