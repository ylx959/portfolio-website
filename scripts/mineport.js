document.addEventListener("DOMContentLoaded", function () {
    const html = document.documentElement;
    const body = document.body;
    const enterForm = document.getElementById("enterForm");
    const nameInput = document.getElementById("name");
    const enterButton = document.getElementById("enterButton");
    const hero = document.querySelector(".hero");
    const heroContent = document.querySelector(".content");
    const heroVisual = document.getElementById("heroVisual");
    const heroEnteredName = document.getElementById("heroEnteredName");
    const heroSentenceName = document.getElementById("heroSentenceName");
    const title = document.querySelector(".title");
    const subtitle = document.getElementById("subtitle");
    const aboutInstagramText = document.getElementById("aboutInstagramText");
    const viewToggle = document.getElementById("viewToggle");
    const timeFilterToggle = document.getElementById("timeFilterToggle");
    const timeFilterPanel = document.getElementById("timeFilterPanel");
    const timeFilterOptions = document.querySelectorAll(".time-filter-option");
    const typologyFilterToggle = document.getElementById("typologyFilterToggle");
    const typologyFilterPanel = document.getElementById("typologyFilterPanel");
    const typologyFilterOptions = document.querySelectorAll(".typology-filter-option");
    const projectGrid = document.querySelector(".project-grid");
    const drawingsTrack = document.getElementById("drawingsTrack");
    const projectDetailOverlay = document.getElementById("projectDetailOverlay");
    const projectDetailClose = document.getElementById("projectDetailClose");
    const projectDetailGalleryToggle = document.getElementById("projectDetailGalleryToggle");
    const projectDetailReadmore = document.getElementById("projectDetailReadmore");
    const drawingsDetailOverlay = document.getElementById("drawingsDetailOverlay");
    const drawingsDetailClose = document.getElementById("drawingsDetailClose");
    const drawingsDetailImage = document.getElementById("drawingsDetailImage");
    const projectDetailShell = document.querySelector(".project-detail-shell");
    const projectDetailTitle = document.getElementById("projectDetailTitle");
    const projectDetailLocation = document.getElementById("projectDetailLocation");
    const projectDetailCategory = document.getElementById("projectDetailCategory");
    const projectDetailYear = document.getElementById("projectDetailYear");
    const projectDetailDescription = document.getElementById("projectDetailDescription");
    const projectDetailFullDescription = document.getElementById("projectDetailFullDescription");
    const projectDetailGallery = document.getElementById("projectDetailGallery");
    const projectDetailGalleryMode = document.getElementById("projectDetailGalleryMode");
    const projectDetailStageTrack = document.getElementById("projectDetailStageTrack");
    const projectDetailPrevImage = document.getElementById("projectDetailPrevImage");
    const projectDetailNextImage = document.getElementById("projectDetailNextImage");
    const sectionReturn = document.getElementById("sectionReturn");
    const sectionFloatingNav = document.getElementById("sectionFloatingNav");
    const sectionFloatingLinks = document.querySelectorAll(".section-floating-link");
    const aboutInfoToggles = document.querySelectorAll(".about-info-toggle");
    const sectionNavs = document.querySelectorAll(".section-floating-nav");
    const sectionLinks = document.querySelectorAll('a[href^="#"]');
    const protectedLinks = document.querySelectorAll('a[href="#projects"], a[href="#drawings"], a[href="#about"], a[href="#contact"]');
    const stackedSections = document.querySelectorAll(".drawings-section, .about-section, .contact-section");
    const categoryLinks = document.querySelectorAll(".category-link");
    const projectCards = document.querySelectorAll(".project-card");
    const defaultSubtitleText = "welcome to my home page.";
    const heroIntroDelay = 2000;
    const descriptionRevealDelay = 2000;
    const descriptionRevealDuration = 4200;
    const scrollDuration = 1600;
    const subtitleEnterAnimationDuration = 760;
    const HERO_PHASES = {
        IDLE: "idle",
        ENTERING: "entering",
        MORPHED: "morphed",
        SCRUBBING: "scrubbing",
        COMPLETE: "complete"
    };
    const sections = ["home", "projects", "drawings", "about", "contact"]
        .map(function (id) {
            return document.getElementById(id);
        })
        .filter(Boolean);
    let hasEntered = false;
    let activeScrollFrame = null;
    let hasPlayedFirstTypedAnimation = false;
    let isDescriptionRevealComplete = false;
    let lastFocusedProjectCard = null;
    let lastFocusedDrawingCard = null;
    let projectDetailCloseTimer = null;
    let currentProjectDetailIndex = -1;
    let currentProjectGalleryImages = [];
    let currentProjectGalleryImageIndex = 0;
    let drawingsDetailCloseTimer = null;
    let isSectionStackTicking = false;
    let isDrawingsStackTicking = false;
    let activeCategoryFilter = "all";
    let activeYearFilter = "all";
    let activeTypologyFilter = "all";
    let timeFilterAutoCloseTimer = null;
    let typologyFilterAutoCloseTimer = null;
    let pendingFloatingNavSectionId = "";
    let floatingNavIdleTimer = null;
    let isPointerOverFloatingNav = false;
    let heroTouchStartY = null;
    const heroState = {
        phase: HERO_PHASES.IDLE,
        progress: 0,
        isStoryUnlocked: false,
        isAwaitingAutoScroll: false
    };
    const heroTimers = {
        morph: null,
        unlock: null,
        autoScroll: null
    };
    html.classList.add("is-locked");
    body.classList.add("is-locked");

    const projectDetailData = Array.isArray(window.MINEPORT_PROJECT_DETAIL_DATA)
        ? window.MINEPORT_PROJECT_DETAIL_DATA
        : [];
    const projectDetails = projectDetailData.slice(0, projectCards.length);
    let projectEmptyState = null;

    function buildFullDescription(detail) {
        if (!detail) {
            return "";
        }

        return detail.title + " is developed as a long-form " + detail.category.toLowerCase() + " proposal rooted in atmosphere, spatial sequence, and material restraint. Set in " + detail.location + ", the work begins with a close reading of movement, pause, and the emotional rhythm produced between enclosure and openness. Rather than treating form as a singular object, the project is organized as a series of linked moments, where threshold, proportion, light, and visual compression gradually shape the experience of the whole. The intention is to create a setting that feels measured and quiet, but still carries strong emotional depth through contrast, texture, and pacing. " +
            "Across the proposal, surfaces are edited carefully so that each junction, opening, and transition contributes to a more continuous architectural narrative. Light is not only used to illuminate the space, but also to structure attention, soften boundaries, and clarify the hierarchy between public and intimate zones. Material choices are imagined as part of the same composition, allowing weight, reflection, shadow, and tactile presence to work together instead of competing for emphasis. " +
            "The result is a project that values calm over spectacle and precision over excess. It aims to feel immersive without becoming heavy, and expressive without losing discipline. In this way, " + detail.title + " becomes less a static formal statement and more a carefully paced environment, where each movement reveals another layer of spatial character, visual stillness, and lived atmosphere over time.";
    }

    function setButtonText(button, text, textSelector, textClassName) {
        if (!button) {
            return;
        }

        let textElement = button.querySelector(textSelector);

        if (!textElement) {
            textElement = document.createElement("span");
            textElement.className = textClassName;
            button.replaceChildren(textElement);
        }

        textElement.textContent = text;
    }

    function setProjectDetailExpanded(isExpanded) {
        if (!projectDetailReadmore || !projectDetailFullDescription) {
            return;
        }

        const copy = projectDetailReadmore.closest(".project-detail-copy");

        if (copy) {
            copy.classList.toggle("is-expanded", isExpanded);
        }

        projectDetailReadmore.setAttribute("aria-expanded", String(isExpanded));
        setButtonText(projectDetailReadmore, isExpanded ? "Read -" : "Read +", ".project-detail-readmore-text", "project-detail-readmore-text");
    }

    function renderProjectGalleryMode() {
        if (!projectDetailStageTrack || !currentProjectGalleryImages.length) {
            return;
        }

        if (projectDetailStageTrack.children.length !== currentProjectGalleryImages.length) {
            projectDetailStageTrack.innerHTML = currentProjectGalleryImages.map(function (imageSrc, imageIndex) {
                const altText = projectDetailTitle ? projectDetailTitle.textContent + " gallery image " + (imageIndex + 1) : "";
                return '<img class="project-detail-gallery-stage-image" src="' + imageSrc + '" alt="' + altText + '" loading="eager" decoding="async">';
            }).join("");
        }

        const firstImage = projectDetailStageTrack.querySelector(".project-detail-gallery-stage-image");
        const viewport = projectDetailStageTrack.parentElement;

        if (!firstImage || !viewport) {
            return;
        }

        const trackStyles = window.getComputedStyle(projectDetailStageTrack);
        const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || "0");
        const slideWidth = firstImage.getBoundingClientRect().width;
        const translateX = currentProjectGalleryImageIndex * (slideWidth + gap) * -1;

        projectDetailStageTrack.style.transform = "translateX(" + translateX + "px)";
    }

    function setProjectGalleryImage(index) {
        if (!currentProjectGalleryImages.length) {
            return;
        }

        const lastIndex = currentProjectGalleryImages.length - 1;
        currentProjectGalleryImageIndex = index < 0 ? lastIndex : (index > lastIndex ? 0 : index);
        renderProjectGalleryMode();
    }

    function setProjectGalleryMode(isGalleryMode) {
        if (!projectDetailShell || !projectDetailGalleryMode || !projectDetailGalleryToggle) {
            return;
        }

        projectDetailShell.classList.toggle("is-gallery-mode", isGalleryMode);
        projectDetailGalleryMode.setAttribute("aria-hidden", String(!isGalleryMode));
        projectDetailGalleryToggle.classList.toggle("is-active", isGalleryMode);
        projectDetailGalleryToggle.setAttribute("aria-pressed", String(isGalleryMode));
        setButtonText(projectDetailGalleryToggle, isGalleryMode ? "Detail" : "Gallery", ".project-detail-badge-text", "project-detail-badge-text");

        if (isGalleryMode) {
            renderProjectGalleryMode();
        }
    }

    function triggerOneShotButtonScroll(button, duration) {
        if (!button) {
            return;
        }

        button.classList.remove("is-scrolling");
        void button.offsetWidth;
        button.classList.add("is-scrolling");

        window.setTimeout(function () {
            button.classList.remove("is-scrolling");
        }, duration);
    }

    function updateButtonState() {
        if (!nameInput || !enterButton) {
            return;
        }

        enterButton.disabled = nameInput.value.trim() === "";
    }

    function sanitizeEnglishName(value) {
        return (value || "")
            .replace(/[^A-Za-z\s'-]/g, "")
            .replace(/\s{2,}/g, " ")
            .replace(/^\s+/, "");
    }

    function formatDisplayName(value) {
        return sanitizeEnglishName(value)
            .toLowerCase()
            .replace(/\b[a-z]/g, function (match) {
                return match.toUpperCase();
            });
    }

    function markDescriptionRevealComplete() {
        isDescriptionRevealComplete = true;

        if (enterForm) {
            enterForm.classList.add("is-visible");
        }
    }

    function wrapWaveText(text, startIndex) {
        return Array.from(text).map(function (char, offset) {
            const safeChar = char === " " ? "&nbsp;" : char;
            return '<span class="drawings-title-char" style="--char-index:' + (startIndex + offset) + '">' + safeChar + "</span>";
        }).join("");
    }

    function setupDrawingsTitleAnimation() {
        const drawingsTitle = document.querySelector(".drawings-title");

        if (!drawingsTitle || drawingsTitle.hasAttribute("data-wave-ready")) {
            return;
        }

        const subline = drawingsTitle.querySelector(".drawings-title-subline");
        const titleNodes = Array.from(drawingsTitle.childNodes).filter(function (node) {
            return !(subline && node === subline);
        });
        const mainParts = titleNodes
            .map(function (node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    return node.textContent.trim();
                }

                if (node.nodeName === "BR") {
                    return "\n";
                }

                return "";
            })
            .join("")
            .split("\n")
            .map(function (part) {
                return part.trim();
            })
            .filter(Boolean);
        const sublineText = subline ? subline.textContent.trim() : "";
        let charIndexOffset = 0;
        const mainMarkup = mainParts.map(function (part) {
            const markup = '<span class="drawings-title-line" aria-hidden="true">' + wrapWaveText(part, charIndexOffset) + "</span>";
            charIndexOffset += part.length;
            return markup;
        }).join("<br>");
        const sublineMarkup = subline ? wrapWaveText(sublineText, charIndexOffset) : "";
        const accessibleMainText = mainParts.join(" ");

        drawingsTitle.setAttribute("data-wave-ready", "true");
        drawingsTitle.setAttribute("aria-label", (accessibleMainText + " " + sublineText).trim());
        drawingsTitle.innerHTML =
            mainMarkup + "<br>" +
            '<span class="drawings-title-subline" aria-hidden="true">' + sublineMarkup + "</span>";

        let isDrawingsTitleWaving = false;
        const drawingsTitleCharCount = (accessibleMainText + sublineText).length;
        const drawingsTitleWaveDuration = 1020 + Math.max(drawingsTitleCharCount - 1, 0) * 90;

        function triggerDrawingsTitleWave() {
            if (isDrawingsTitleWaving) {
                return;
            }

            isDrawingsTitleWaving = true;
            drawingsTitle.classList.remove("is-waving");
            void drawingsTitle.offsetWidth;
            drawingsTitle.classList.add("is-waving");

            window.setTimeout(function () {
                drawingsTitle.classList.remove("is-waving");
                isDrawingsTitleWaving = false;
            }, drawingsTitleWaveDuration);
        }

        drawingsTitle.addEventListener("pointerenter", triggerDrawingsTitleWave);
        drawingsTitle.addEventListener("focusin", triggerDrawingsTitleWave);
    }

    function setupSubtitleWaveAnimation() {
        if (!subtitle || subtitle.hasAttribute("data-wave-ready")) {
            return;
        }

        const subtitleText = defaultSubtitleText;
        subtitle.setAttribute("data-wave-ready", "true");
        subtitle.setAttribute("aria-label", subtitleText);
        subtitle.innerHTML = '<span class="subtitle-line" aria-hidden="true">' + wrapWaveText(subtitleText, 0) + "</span>";

        let isSubtitleWaving = false;
        const subtitleWaveDuration = 1020 + Math.max(subtitleText.length - 1, 0) * 90;

        function triggerSubtitleWave() {
            if (!heroContent || !heroContent.classList.contains("is-intro-ready")) {
                return;
            }

            if (isSubtitleWaving) {
                return;
            }

            isSubtitleWaving = true;
            subtitle.classList.remove("is-waving");
            void subtitle.offsetWidth;
            subtitle.classList.add("is-waving");

            window.setTimeout(function () {
                subtitle.classList.remove("is-waving");
                isSubtitleWaving = false;
            }, subtitleWaveDuration);
        }

        subtitle.addEventListener("pointerenter", triggerSubtitleWave);
        subtitle.addEventListener("focusin", triggerSubtitleWave);
    }

    function updateSubtitle() {
        if (!nameInput || !subtitle) {
            return;
        }

        const enteredName = formatDisplayName(nameInput.value).trim();
        const subtitleText = defaultSubtitleText;
        const heroNameText = enteredName === "" ? "Guest" : enteredName;

        if (!hasPlayedFirstTypedAnimation) {
            setupSubtitleWaveAnimation();
            hasPlayedFirstTypedAnimation = true;
        }

        if (heroEnteredName) {
            heroEnteredName.textContent = heroNameText;
        }

        if (heroSentenceName) {
            heroSentenceName.textContent = heroNameText;
        }

        if (aboutInstagramText) {
            aboutInstagramText.textContent = enteredName === ""
                ? "Would you like to connect with YLX Studio on Instagram?"
                : enteredName + ", would you like to connect with YLX Studio on Instagram?";
        }
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
        const detail = projectDetails[index];

        if (!detail || !projectDetailOverlay) {
            return;
        }

        const galleryImages = detail.images.slice(0, 10);

        lastFocusedProjectCard = sourceCard || null;
        currentProjectDetailIndex = index;
        currentProjectGalleryImages = galleryImages;
        currentProjectGalleryImageIndex = 0;
        projectDetailTitle.textContent = detail.title;
        projectDetailLocation.textContent = detail.location;
        projectDetailCategory.textContent = detail.category;
        projectDetailYear.textContent = detail.year;
        projectDetailDescription.innerHTML = detail.description.map(function (paragraph) {
            return "<p>" + paragraph + "</p>";
        }).join("");
        if (projectDetailFullDescription) {
            projectDetailFullDescription.textContent = buildFullDescription(detail);
        }
        projectDetailGallery.innerHTML = galleryImages.map(function (imageSrc, imageIndex) {
            return '<figure class="project-detail-gallery-item" style="transition-delay:' + (imageIndex * 28) + 'ms"><img class="project-detail-gallery-image" src="' + imageSrc + '" alt="' + detail.title + " image " + (imageIndex + 1) + '" loading="eager" decoding="async"></figure>';
        }).join("");
        setProjectDetailExpanded(false);
        setProjectGalleryMode(false);
        renderProjectGalleryMode();

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
            currentProjectDetailIndex = -1;
            currentProjectGalleryImages = [];
            currentProjectGalleryImageIndex = 0;
            setProjectGalleryMode(false);
            setProjectDetailExpanded(false);
            projectDetailCloseTimer = null;

            if (lastFocusedProjectCard) {
                lastFocusedProjectCard.focus();
            }
        }, 320);
    }

    function openDrawingsDetail(imageSource, imageAlt, sourceCard) {
        if (!drawingsDetailOverlay || !drawingsDetailImage || !imageSource) {
            return;
        }

        lastFocusedDrawingCard = sourceCard || null;
        drawingsDetailImage.src = imageSource;
        drawingsDetailImage.alt = imageAlt || "";

        if (drawingsDetailCloseTimer) {
            window.clearTimeout(drawingsDetailCloseTimer);
            drawingsDetailCloseTimer = null;
        }

        drawingsDetailOverlay.classList.remove("is-active");
        drawingsDetailOverlay.classList.add("is-visible");
        drawingsDetailOverlay.setAttribute("aria-hidden", "false");
        body.classList.add("is-project-detail-open");

        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
                drawingsDetailOverlay.classList.add("is-active");
            });
        });

        if (drawingsDetailClose) {
            window.setTimeout(function () {
                if (drawingsDetailOverlay.classList.contains("is-active")) {
                    drawingsDetailClose.focus({ preventScroll: true });
                }
            }, 220);
        }
    }

    function closeDrawingsDetail() {
        if (!drawingsDetailOverlay) {
            return;
        }

        drawingsDetailOverlay.classList.remove("is-active");
        drawingsDetailOverlay.setAttribute("aria-hidden", "true");
        drawingsDetailCloseTimer = window.setTimeout(function () {
            drawingsDetailOverlay.classList.remove("is-visible");
            drawingsDetailImage.removeAttribute("src");
            drawingsDetailImage.alt = "";
            body.classList.remove("is-project-detail-open");
            drawingsDetailCloseTimer = null;

            if (lastFocusedDrawingCard) {
                lastFocusedDrawingCard.focus();
            }
        }, 320);
    }

    function preloadProjectDetailImages() {
        const uniqueImages = Array.from(new Set(projectDetails.flatMap(function (detail) {
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

    function easeOutBack(progress, overshoot) {
        const clamped = Math.max(0, Math.min(progress, 1));
        const c1 = overshoot;
        const c3 = c1 + 1;

        return 1 + (c3 * Math.pow(clamped - 1, 3)) + (c1 * Math.pow(clamped - 1, 2));
    }

    function isMobileHeroMode() {
        return window.innerWidth <= 768;
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

        drawingsTrack.querySelectorAll(".drawings-card").forEach(function (card, index) {
            card.style.setProperty("--drawings-card-index", String(index));
            card.style.setProperty("--drawings-card-scale", "0.94");
        });
    }

    function updateDrawingsCarousel() {}

    function shiftDrawingsCarousel() {}

    function normalizeDrawingsLoopPosition() {}

    function updateDrawingsStackMotion() {
        if (!drawingsTrack || window.innerWidth <= 768) {
            return;
        }

        const cards = Array.from(drawingsTrack.querySelectorAll(".drawings-card"));
        const stickyBaseTop = 148;

        cards.forEach(function (card, index) {
            const rect = card.getBoundingClientRect();
            const cardTop = stickyBaseTop + (index * 14);
            const progress = Math.max(0, Math.min((window.innerHeight - rect.top - 80) / (window.innerHeight - cardTop), 1));
            const scale = 0.94 + (progress * 0.04);

            card.style.setProperty("--drawings-card-scale", scale.toFixed(4));
        });
    }

    function requestDrawingsStackMotion() {
        if (isDrawingsStackTicking) {
            return;
        }

        isDrawingsStackTicking = true;
        window.requestAnimationFrame(function () {
            updateDrawingsStackMotion();
            isDrawingsStackTicking = false;
        });
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
                heroState.isAwaitingAutoScroll = false;
                pendingFloatingNavSectionId = "";
                updateFloatingNavState();
            }
        }

        activeScrollFrame = window.requestAnimationFrame(step);
    }

    function smoothScrollToSection(section) {
        if (!section) {
            return;
        }

        const rect = section.getBoundingClientRect();
        const computedStyles = window.getComputedStyle(section);
        const marginTop = parseFloat(computedStyles.marginTop) || 0;
        const overlapOffset = marginTop < 0 ? Math.abs(marginTop) : 0;
        const sectionScrollOffset = parseFloat(computedStyles.getPropertyValue("--section-scroll-offset")) || 0;
        const targetY = window.scrollY + rect.top + overlapOffset + sectionScrollOffset;

        smoothScrollTo(targetY);
    }

    function clearHeroStoryCompletionTimer() {
        if (heroTimers.autoScroll) {
            window.clearTimeout(heroTimers.autoScroll);
            heroTimers.autoScroll = null;
        }
    }

    function clearHeroStoryUnlockTimer() {
        if (heroTimers.unlock) {
            window.clearTimeout(heroTimers.unlock);
            heroTimers.unlock = null;
        }
    }

    function clearHeroMorphTimer() {
        if (heroTimers.morph) {
            window.clearTimeout(heroTimers.morph);
            heroTimers.morph = null;
        }
    }

    function scheduleHeroTimer(timerKey, delay, callback) {
        if (!Object.prototype.hasOwnProperty.call(heroTimers, timerKey)) {
            return null;
        }

        if (heroTimers[timerKey]) {
            window.clearTimeout(heroTimers[timerKey]);
        }

        heroTimers[timerKey] = window.setTimeout(function () {
            heroTimers[timerKey] = null;
            callback();
        }, delay);

        return heroTimers[timerKey];
    }

    function syncHeroPhaseClasses() {
        if (!hero) {
            return;
        }

        hero.classList.toggle("is-entered", heroState.phase !== HERO_PHASES.IDLE);
        hero.classList.toggle("is-morph-complete", heroState.phase !== HERO_PHASES.IDLE && heroState.phase !== HERO_PHASES.ENTERING);
        hero.classList.toggle("is-story-scrubbing", heroState.phase === HERO_PHASES.SCRUBBING);
        hero.classList.toggle("is-story-complete", heroState.phase === HERO_PHASES.COMPLETE);
        hero.classList.toggle("is-comma-phase", heroState.progress >= 0.94);
    }

    function setHeroPhase(phase) {
        heroState.phase = phase;
        syncHeroPhaseClasses();
    }

    function resetHeroFlowState() {
        heroState.progress = 0;
        heroState.isStoryUnlocked = false;
        heroState.isAwaitingAutoScroll = false;
        clearHeroMorphTimer();
        clearHeroStoryUnlockTimer();
        clearHeroStoryCompletionTimer();

        if (hero) {
            hero.style.setProperty("--hero-story-progress", "0.0000");
            hero.style.setProperty("--hero-side-pull", "0.0000");
            hero.style.setProperty("--hero-side-scale", "1.0000");
        }

        setHeroPhase(HERO_PHASES.IDLE);
    }

    function isHeroScrollLocked() {
        if (isMobileHeroMode()) {
            return false;
        }

        return !!(hero &&
            hasEntered &&
            heroState.phase !== HERO_PHASES.IDLE &&
            window.scrollY <= 6 &&
            (!heroState.isStoryUnlocked || heroState.isAwaitingAutoScroll));
    }

    function setHeroStoryProgress(progress) {
        if (!hero) {
            return;
        }

        heroState.progress = Math.max(0, Math.min(progress, 1));

        if (isMobileHeroMode()) {
            hero.style.setProperty("--hero-story-progress", "0.0000");
            hero.style.setProperty("--hero-side-pull", "0.0000");
            hero.style.setProperty("--hero-side-scale", "1.0000");
            setHeroPhase(HERO_PHASES.MORPHED);
            clearHeroStoryCompletionTimer();
            return;
        }

        const basePull = heroState.progress;
        const magneticOvershoot = heroState.progress >= 0.64
            ? easeOutBack((heroState.progress - 0.5) / 0.5, 2.8)
            : 0;
        const magneticPull = Math.min(basePull + (magneticOvershoot * 0.36), 1.38);
        const magneticScale = 1 - (Math.min(magneticPull, 1.24) * 0.22);

        hero.style.setProperty("--hero-story-progress", heroState.progress.toFixed(4));
        hero.style.setProperty("--hero-side-pull", magneticPull.toFixed(4));
        hero.style.setProperty("--hero-side-scale", magneticScale.toFixed(4));
        setHeroPhase(heroState.progress >= 1 ? HERO_PHASES.COMPLETE : (heroState.progress > 0 ? HERO_PHASES.SCRUBBING : HERO_PHASES.MORPHED));

        if (heroState.progress < 1) {
            clearHeroStoryCompletionTimer();
        }
    }

    function isHeroStoryActive() {
        if (isMobileHeroMode()) {
            return false;
        }

        if (!hero || !hasEntered || heroState.phase === HERO_PHASES.IDLE || heroState.phase === HERO_PHASES.ENTERING || !heroState.isStoryUnlocked) {
            return false;
        }

        return window.scrollY <= 6 && getCurrentSection() && getCurrentSection().id === "home";
    }

    function completeHeroStory() {
        const projectsSection = document.getElementById("projects");

        if (!projectsSection) {
            return;
        }

        clearHeroStoryCompletionTimer();
        heroState.isAwaitingAutoScroll = true;
        scheduleHeroTimer("autoScroll", 1300, function () {
            smoothScrollToSection(projectsSection);
        });
    }

    function scrubHeroStory(delta) {
        if (!isHeroStoryActive()) {
            return false;
        }

        const nextProgress = heroState.progress + (delta / 1120);

        if (delta > 0 && heroState.progress < 1) {
            setHeroStoryProgress(nextProgress);

            if (heroState.progress >= 1) {
                completeHeroStory();
            }

            return true;
        }

        if (delta < 0 && heroState.progress > 0) {
            setHeroStoryProgress(nextProgress);
            return true;
        }

        return false;
    }

    function isAnyNavVisible() {
        return Array.from(sectionNavs).some(function (nav) {
            if (!nav.classList.contains("is-visible")) {
                return false;
            }

            const rect = nav.getBoundingClientRect();
            return rect.bottom > 0 && rect.top < 120;
        });
    }

    function updateSectionReturnVisibility() {
        if (!sectionReturn) {
            return;
        }

        const contactSection = document.getElementById("contact");
        const shouldShow = !!contactSection && isSectionInViewport(contactSection);
        sectionReturn.classList.toggle("is-visible", shouldShow);
    }

    function setFloatingNavCollapsed(isCollapsed) {
        if (!sectionFloatingNav) {
            return;
        }

        if (window.innerWidth <= 768) {
            sectionFloatingNav.classList.remove("is-collapsed");
            return;
        }

        sectionFloatingNav.classList.toggle("is-collapsed", isCollapsed);
    }

    function clearFloatingNavIdleTimer() {
        if (floatingNavIdleTimer) {
            window.clearTimeout(floatingNavIdleTimer);
            floatingNavIdleTimer = null;
        }
    }

    function scheduleFloatingNavCollapse() {
        if (!sectionFloatingNav || !sectionFloatingNav.classList.contains("is-visible") || window.innerWidth <= 768) {
            return;
        }

        clearFloatingNavIdleTimer();
        floatingNavIdleTimer = window.setTimeout(function () {
            setFloatingNavCollapsed(true);
        }, 800);
    }

    function wakeFloatingNav() {
        if (!sectionFloatingNav || !sectionFloatingNav.classList.contains("is-visible")) {
            return;
        }

        clearFloatingNavIdleTimer();
        setFloatingNavCollapsed(false);
    }

    function updateFloatingNavState() {
        if (!sectionFloatingNav) {
            return;
        }

        const currentSection = getCurrentSection();
        const currentId = currentSection ? currentSection.id : "";
        const activeId = pendingFloatingNavSectionId || currentId;
        const shouldShow = hasEntered && (currentId === "projects" || currentId === "drawings" || currentId === "about");

        sectionFloatingNav.classList.toggle("is-visible", shouldShow);

        if (!shouldShow) {
            setFloatingNavCollapsed(false);
            clearFloatingNavIdleTimer();
        } else {
            if (window.innerWidth <= 768) {
                setFloatingNavCollapsed(false);
                clearFloatingNavIdleTimer();
            } else {
                scheduleFloatingNavCollapse();
            }
        }

        sectionFloatingLinks.forEach(function (link) {
            const isActive = link.dataset.sectionLink === activeId;
            link.classList.toggle("is-active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
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

        const drawingsSection = document.getElementById("drawings");

        if (drawingsSection) {
            drawingsSection.classList.toggle("is-active", isSectionInViewport(drawingsSection));
        }
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
        const entryThreshold = window.innerHeight * 0.94;
        return rect.top < entryThreshold && rect.bottom > 0;
    }

    function unlockPage(name) {
        hasEntered = true;
        html.classList.remove("is-locked");
        body.classList.remove("is-locked");
        resetHeroFlowState();
        updateFloatingNavState();
    }

    setupDrawingsTitleAnimation();
    setupSubtitleWaveAnimation();
    updateButtonState();
    updateSubtitle();
    preloadProjectDetailImages();
    buildDrawingsLoop();
    updateDrawingsCarousel();
    requestDrawingsStackMotion();
    window.setTimeout(function () {
        if (heroContent) {
            heroContent.classList.add("is-intro-ready");
        }

        if (subtitle) {
            subtitle.classList.remove("is-waving");
            void subtitle.offsetWidth;
            subtitle.classList.add("is-waving");
        }
    }, heroIntroDelay);
    window.setTimeout(markDescriptionRevealComplete, descriptionRevealDelay + descriptionRevealDuration + 2000);

    if (nameInput) {
        nameInput.addEventListener("input", function () {
            updateButtonState();
            updateSubtitle();
        });
    }

    if (enterForm) {
        enterForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const enteredName = nameInput ? formatDisplayName(nameInput.value).trim() : "";

            if (nameInput) {
                nameInput.value = enteredName;
            }

            if (enteredName === "") {
                updateButtonState();
                return;
            }

            if (!isDescriptionRevealComplete) {
                return;
            }

            if (heroEnteredName) {
                heroEnteredName.textContent = enteredName;
            }
            if (heroSentenceName) {
                heroSentenceName.textContent = enteredName;
            }
            unlockPage(enteredName);

            if (isMobileHeroMode()) {
                setHeroPhase(HERO_PHASES.MORPHED);
                heroState.isStoryUnlocked = true;
                heroState.isAwaitingAutoScroll = true;
                scheduleHeroTimer("autoScroll", 900, function () {
                    const projectsSection = document.getElementById("projects");

                    if (projectsSection) {
                        smoothScrollToSection(projectsSection);
                    }
                });
                return;
            }

            setHeroPhase(HERO_PHASES.ENTERING);

            scheduleHeroTimer("morph", 2140, function () {
                setHeroPhase(HERO_PHASES.MORPHED);

                scheduleHeroTimer("unlock", 1100, function () {
                    heroState.isStoryUnlocked = true;
                });
            });
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
            pendingFloatingNavSectionId = targetId;
            updateFloatingNavState();
            wakeFloatingNav();
            smoothScrollToSection(targetSection);
        });
    });

    function applyProjectFilters() {
        let visibleCount = 0;

        projectCards.forEach(function (card, index) {
            const category = card.dataset.category;
            const yearText = card.dataset.year || "";
            const detail = projectDetails[index];
            const typology = ((detail && detail.typology) || "").toLowerCase();
            const matchesCategory = activeCategoryFilter === "all" || category === activeCategoryFilter;
            const matchesYear = activeYearFilter === "all" || yearText.indexOf(activeYearFilter) !== -1;
            const matchesTypology = activeTypologyFilter === "all" || typology === activeTypologyFilter;
            const shouldShow = matchesCategory && matchesYear && matchesTypology;
            card.style.display = shouldShow ? "" : "none";

            if (shouldShow) {
                visibleCount += 1;
            }
        });

        if (projectEmptyState) {
            projectEmptyState.classList.toggle("is-visible", visibleCount === 0);
        }
    }

    function clearTimeFilterAutoCloseTimer() {
        if (timeFilterAutoCloseTimer) {
            window.clearTimeout(timeFilterAutoCloseTimer);
            timeFilterAutoCloseTimer = null;
        }
    }

    function scheduleTimeFilterAutoClose() {
        if (!timeFilterPanel || !timeFilterToggle || !timeFilterPanel.classList.contains("is-open")) {
            return;
        }

        clearTimeFilterAutoCloseTimer();
        timeFilterAutoCloseTimer = window.setTimeout(function () {
            if (!timeFilterPanel.matches(":hover") && !timeFilterToggle.matches(":hover")) {
                setTimeFilterPanelOpen(false);
            }
        }, 1500);
    }

    function setTimeFilterPanelOpen(isOpen) {
        if (!timeFilterPanel || !timeFilterToggle) {
            return;
        }

        clearTimeFilterAutoCloseTimer();
        timeFilterPanel.classList.toggle("is-open", isOpen);
        timeFilterPanel.setAttribute("aria-hidden", String(!isOpen));
        timeFilterToggle.setAttribute("aria-expanded", String(isOpen));

        if (isOpen) {
            scheduleTimeFilterAutoClose();
        }
    }

    function clearTypologyFilterAutoCloseTimer() {
        if (typologyFilterAutoCloseTimer) {
            window.clearTimeout(typologyFilterAutoCloseTimer);
            typologyFilterAutoCloseTimer = null;
        }
    }

    function scheduleTypologyFilterAutoClose() {
        if (!typologyFilterPanel || !typologyFilterToggle || !typologyFilterPanel.classList.contains("is-open")) {
            return;
        }

        clearTypologyFilterAutoCloseTimer();
        typologyFilterAutoCloseTimer = window.setTimeout(function () {
            if (!typologyFilterPanel.matches(":hover") && !typologyFilterToggle.matches(":hover")) {
                setTypologyFilterPanelOpen(false);
            }
        }, 1500);
    }

    function setTypologyFilterPanelOpen(isOpen) {
        if (!typologyFilterPanel || !typologyFilterToggle) {
            return;
        }

        clearTypologyFilterAutoCloseTimer();
        typologyFilterPanel.classList.toggle("is-open", isOpen);
        typologyFilterPanel.setAttribute("aria-hidden", String(!isOpen));
        typologyFilterToggle.setAttribute("aria-expanded", String(isOpen));

        if (isOpen) {
            scheduleTypologyFilterAutoClose();
        }
    }

    function syncFilterPanelOffsets() {
        [
            [timeFilterToggle, timeFilterPanel],
            [typologyFilterToggle, typologyFilterPanel]
        ].forEach(function (entry) {
            const toggle = entry[0];
            const panel = entry[1];

            if (!toggle || !panel || !panel.parentElement) {
                return;
            }

            const panelParentRect = panel.parentElement.getBoundingClientRect();
            const toggleRect = toggle.getBoundingClientRect();
            const offset = Math.max(toggleRect.left - panelParentRect.left, 0);
            panel.style.setProperty("--filter-panel-offset", offset.toFixed(1) + "px");
        });
    }

    function formatCategory(category) {
        return (category || "").replace(/^\w/, function (match) {
            return match.toUpperCase();
        });
    }

    function setActiveTimeFilter(value) {
        activeYearFilter = value || "all";

        timeFilterOptions.forEach(function (item) {
            const itemValue = item.dataset.yearFilter || "all";
            item.classList.toggle("is-active", itemValue === activeYearFilter);
        });
    }

    function setActiveTypologyFilter(value) {
        activeTypologyFilter = value || "all";

        typologyFilterOptions.forEach(function (item) {
            const itemValue = item.dataset.typologyFilter || "all";
            item.classList.toggle("is-active", itemValue === activeTypologyFilter);
        });
    }

    function resetSecondaryProjectFilters() {
        setActiveTimeFilter("all");
        setActiveTypologyFilter("all");
        setTimeFilterPanelOpen(false);
        setTypologyFilterPanelOpen(false);
    }

    projectCards.forEach(function (card, index) {
        const detail = projectDetails[index];
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
            '<p class="project-list-typology">' + (detail ? detail.typology : (location ? location.textContent : "")) + "</p>" +
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

    if (projectGrid) {
        projectEmptyState = document.createElement("p");
        projectEmptyState.className = "project-empty-state";
        projectEmptyState.textContent = "More works are continuously being updated. Please check back soon.";
        projectGrid.insertAdjacentElement("afterend", projectEmptyState);
    }

    if (drawingsTrack) {
        drawingsTrack.addEventListener("click", function (event) {
            const card = event.target.closest(".drawings-card");
            const image = card ? card.querySelector(".drawings-image") : null;

            if (!card || !image) {
                return;
            }

            openDrawingsDetail(image.getAttribute("src"), image.getAttribute("alt"), card);
        });

        drawingsTrack.addEventListener("keydown", function (event) {
            const card = event.target.closest(".drawings-card");
            const image = card ? card.querySelector(".drawings-image") : null;

            if (!card || !image) {
                return;
            }

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openDrawingsDetail(image.getAttribute("src"), image.getAttribute("alt"), card);
            }
        });
    }

    categoryLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            const filter = link.dataset.filter;

            categoryLinks.forEach(function (item) {
                item.classList.remove("is-active");
            });

            link.classList.add("is-active");
            activeCategoryFilter = filter;

            if (filter === "all") {
                resetSecondaryProjectFilters();
            }

            applyProjectFilters();
        });
    });

    if (timeFilterToggle && timeFilterPanel) {
        timeFilterToggle.addEventListener("click", function () {
            const willOpen = !timeFilterPanel.classList.contains("is-open");
            setTimeFilterPanelOpen(willOpen);
        });

        timeFilterToggle.addEventListener("mouseenter", clearTimeFilterAutoCloseTimer);
        timeFilterToggle.addEventListener("mouseleave", scheduleTimeFilterAutoClose);
        timeFilterPanel.addEventListener("mouseenter", clearTimeFilterAutoCloseTimer);
        timeFilterPanel.addEventListener("mouseleave", scheduleTimeFilterAutoClose);
    }

    if (typologyFilterToggle && typologyFilterPanel) {
        typologyFilterToggle.addEventListener("click", function () {
            const willOpen = !typologyFilterPanel.classList.contains("is-open");
            setTypologyFilterPanelOpen(willOpen);
        });

        typologyFilterToggle.addEventListener("mouseenter", clearTypologyFilterAutoCloseTimer);
        typologyFilterToggle.addEventListener("mouseleave", scheduleTypologyFilterAutoClose);
        typologyFilterPanel.addEventListener("mouseenter", clearTypologyFilterAutoCloseTimer);
        typologyFilterPanel.addEventListener("mouseleave", scheduleTypologyFilterAutoClose);
    }

    timeFilterOptions.forEach(function (option) {
        option.addEventListener("click", function () {
            setActiveTimeFilter(option.dataset.yearFilter || "all");
            applyProjectFilters();
            scheduleTimeFilterAutoClose();
        });
    });

    typologyFilterOptions.forEach(function (option) {
        option.addEventListener("click", function () {
            setActiveTypologyFilter(option.dataset.typologyFilter || "all");
            applyProjectFilters();
            scheduleTypologyFilterAutoClose();
        });
    });

    document.addEventListener("click", function (event) {
        if (!timeFilterPanel || !timeFilterToggle) {
            if (typologyFilterPanel && typologyFilterToggle && !typologyFilterPanel.contains(event.target) && !typologyFilterToggle.contains(event.target)) {
                setTypologyFilterPanelOpen(false);
            }

            return;
        }

        if (timeFilterPanel.contains(event.target) || timeFilterToggle.contains(event.target)) {
            if (typologyFilterPanel && typologyFilterToggle && !typologyFilterPanel.contains(event.target) && !typologyFilterToggle.contains(event.target)) {
                setTypologyFilterPanelOpen(false);
            }

            return;
        }

        setTimeFilterPanelOpen(false);

        if (typologyFilterPanel && typologyFilterToggle && !typologyFilterPanel.contains(event.target) && !typologyFilterToggle.contains(event.target)) {
            setTypologyFilterPanelOpen(false);
        }
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

    syncFilterPanelOffsets();

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

    if (projectDetailGalleryToggle) {
        projectDetailGalleryToggle.addEventListener("click", function () {
            const isGalleryMode = projectDetailShell ? !projectDetailShell.classList.contains("is-gallery-mode") : false;
            triggerOneShotButtonScroll(projectDetailGalleryToggle, 500);
            setProjectGalleryMode(isGalleryMode);
        });
    }

    if (projectDetailReadmore) {
        projectDetailReadmore.addEventListener("click", function () {
            const copy = projectDetailReadmore.closest(".project-detail-copy");
            const isExpanded = copy ? !copy.classList.contains("is-expanded") : false;
            triggerOneShotButtonScroll(projectDetailReadmore, 680);
            setProjectDetailExpanded(isExpanded);
        });
    }

    if (projectDetailPrevImage) {
        projectDetailPrevImage.addEventListener("click", function () {
            setProjectGalleryImage(currentProjectGalleryImageIndex - 1);
        });
    }

    if (projectDetailNextImage) {
        projectDetailNextImage.addEventListener("click", function () {
            setProjectGalleryImage(currentProjectGalleryImageIndex + 1);
        });
    }

    if (drawingsDetailClose) {
        drawingsDetailClose.addEventListener("click", closeDrawingsDetail);
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && projectDetailOverlay && projectDetailOverlay.classList.contains("is-visible")) {
            closeProjectDetail();
        }

        if (event.key === "Escape" && drawingsDetailOverlay && drawingsDetailOverlay.classList.contains("is-visible")) {
            closeDrawingsDetail();
        }
    });

    if (drawingsTrack) {
        const syncDrawingsCardAccessibility = function () {
            drawingsTrack.querySelectorAll(".drawings-card").forEach(function (card) {
                card.setAttribute("role", "button");
                card.setAttribute("tabindex", "0");
            });
        };

        syncDrawingsCardAccessibility();
        const originalBuildDrawingsLoop = buildDrawingsLoop;
        buildDrawingsLoop = function () {
            originalBuildDrawingsLoop();
            syncDrawingsCardAccessibility();
        };
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

    if (sectionFloatingNav) {
        sectionFloatingNav.addEventListener("pointerenter", function () {
            isPointerOverFloatingNav = true;
            wakeFloatingNav();
        });
        sectionFloatingNav.addEventListener("pointermove", wakeFloatingNav);
        sectionFloatingNav.addEventListener("focusin", wakeFloatingNav);
        sectionFloatingNav.addEventListener("pointerleave", function () {
            isPointerOverFloatingNav = false;
            scheduleFloatingNavCollapse();
        });
        sectionFloatingNav.addEventListener("focusout", function () {
            window.setTimeout(function () {
                if (sectionFloatingNav && !sectionFloatingNav.contains(document.activeElement)) {
                    scheduleFloatingNavCollapse();
                }
            }, 0);
        });
    }

    window.addEventListener("scroll", updateSectionReturnVisibility, { passive: true });
    window.addEventListener("scroll", function () {
        updateFloatingNavState();
        requestDrawingsStackMotion();
        if (isPointerOverFloatingNav) {
            wakeFloatingNav();
        }
    }, { passive: true });
    window.addEventListener("wheel", function (event) {
        if (isHeroScrollLocked()) {
            event.preventDefault();
            return;
        }

        if (scrubHeroStory(event.deltaY)) {
            event.preventDefault();
            return;
        }

        wakeFloatingNav();
    }, { passive: false });
    window.addEventListener("touchstart", function (event) {
        if (!isHeroStoryActive() || !event.touches.length) {
            heroTouchStartY = null;
            return;
        }

        heroTouchStartY = event.touches[0].clientY;
    }, { passive: true });
    window.addEventListener("touchmove", function (event) {
        if (isHeroScrollLocked()) {
            event.preventDefault();
            return;
        }

        if (heroTouchStartY === null || !event.touches.length) {
            return;
        }

        const currentY = event.touches[0].clientY;
        const deltaY = heroTouchStartY - currentY;

        if (scrubHeroStory(deltaY)) {
            event.preventDefault();
            heroTouchStartY = currentY;
        }
    }, { passive: false });
    window.addEventListener("touchend", function () {
        heroTouchStartY = null;
    }, { passive: true });
    window.addEventListener("scroll", requestSectionStackMotion, { passive: true });
    window.addEventListener("resize", updateSectionReturnVisibility);
    window.addEventListener("resize", function () {
        updateFloatingNavState();
    });
    window.addEventListener("resize", function () {
        buildDrawingsLoop();
        updateDrawingsCarousel();
        requestDrawingsStackMotion();
        updateSectionStackMotion();
        syncFilterPanelOffsets();

        if (projectDetailShell && projectDetailShell.classList.contains("is-gallery-mode")) {
            renderProjectGalleryMode();
        }
    });
    updateSectionReturnVisibility();
    updateFloatingNavState();
    updateSectionStackMotion();
});
