document.addEventListener("DOMContentLoaded", function () {
    const html = document.documentElement;
    const body = document.body;
    const enterForm = document.getElementById("enterForm");
    const nameInput = document.getElementById("name");
    const enterButton = document.getElementById("enterButton");
    const hero = document.querySelector(".hero");
    const heroContent = document.querySelector(".content");
    const heroVisual = document.getElementById("heroVisual");
    const heroMainImages = document.querySelectorAll(".hero-main-image");
    const heroEnteredName = document.getElementById("heroEnteredName");
    const heroSentenceName = document.getElementById("heroSentenceName");
    const title = document.querySelector(".title");
    const subtitle = document.getElementById("subtitle");
    const viewToggle = document.getElementById("viewToggle");
    const timeFilterToggle = document.getElementById("timeFilterToggle");
    const timeFilterPanel = document.getElementById("timeFilterPanel");
    const typologyFilterToggle = document.getElementById("typologyFilterToggle");
    const typologyFilterPanel = document.getElementById("typologyFilterPanel");
    const timeFilterOptions = timeFilterPanel
        ? timeFilterPanel.querySelectorAll(".time-filter-option")
        : [];
    const typologyFilterOptions = typologyFilterPanel
        ? typologyFilterPanel.querySelectorAll(".typology-filter-option")
        : [];
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
    const sectionFloatingHighlight = document.getElementById("sectionFloatingHighlight");
    const sectionFloatingLinks = document.querySelectorAll(".section-floating-link");
    const contactSection = document.getElementById("contact");
    const contactDotField = document.getElementById("contactDotField");
    const cursorFollower = document.getElementById("cursorFollower");
    const aboutInfoToggles = document.querySelectorAll(".about-info-toggle");
    const sectionNavs = document.querySelectorAll(".section-floating-nav");
    const sectionLinks = document.querySelectorAll('a[href^="#"]');
    const protectedLinks = document.querySelectorAll('a[href="#projects"], a[href="#drawings"], a[href="#about"], a[href="#contact"]');
    const stackedSections = document.querySelectorAll(".drawings-section, .about-section, .contact-section");
    const categoryLinks = document.querySelectorAll(".category-link");
    const projectCards = document.querySelectorAll(".project-card");
    const defaultSubtitleText = "welcome to my portfolio.";
    const heroIntroDelay = 2000;
    const descriptionRevealDelay = 2000;
    const descriptionRevealDuration = 4200;
    const scrollDuration = 1600;
    const subtitleEnterAnimationDuration = 760;
    const projectImageBatchSize = 5;
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
    let inertiaScrollFrame = null;
    let inertiaScrollTargetY = 0;
    let inertiaScrollCurrentY = 0;
    let isInertiaScrollAnimating = false;
    let hasPlayedFirstTypedAnimation = false;
    let isDescriptionRevealComplete = false;
    let lastFocusedProjectCard = null;
    let lastFocusedDrawingCard = null;
    let projectDetailCloseTimer = null;
    let currentProjectDetailIndex = -1;
    let currentProjectDetailImages = [];
    let currentProjectDetailRenderedCount = 0;
    let currentProjectDetailTargetCount = 0;
    let currentProjectGalleryImages = [];
    let currentProjectGalleryImageIndex = 0;
    let currentProjectGalleryStageIndex = 0;
    let drawingsDetailCloseTimer = null;
    let currentDrawingsDetailIndex = -1;
    let isSectionStackTicking = false;
    let isDrawingsStackTicking = false;
    let activeCategoryFilter = "all";
    let activeYearFilter = "all";
    let activeTypologyFilter = "all";
    let submittedDisplayName = "";
    let timeFilterAutoCloseTimer = null;
    let typologyFilterAutoCloseTimer = null;
    let timeFilterCloseTimer = null;
    let typologyFilterCloseTimer = null;
    let pendingFloatingNavSectionId = "";
    let floatingNavIdleTimer = null;
    let floatingNavJellyTimer = null;
    let isPointerOverFloatingNav = false;
    let heroTouchStartY = null;
    let contactDotFrame = null;
    let isContactDotVisible = false;
    let contactDots = [];
    const contactDotPointer = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        isActive: false
    };
    const heroState = {
        phase: HERO_PHASES.IDLE,
        progress: 0,
        isStoryUnlocked: false,
        isAwaitingAutoScroll: false
    };
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nonDesktopScrollQuery = window.matchMedia("(hover: none), (pointer: coarse), (max-width: 1024px)");
    const inertiaScrollSettings = {
        lerp: 0.018,
        wheelMultiplier: 1.12,
        settleDistance: 0.2
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

        if (detail.fullDescription) {
            return detail.fullDescription;
        }

        return detail.title + " is developed as a long-form " + detail.category.toLowerCase() + " proposal rooted in atmosphere, spatial sequence, and material restraint. Set in " + detail.location + ", the work begins with a close reading of movement, pause, and the emotional rhythm produced between enclosure and openness. Rather than treating form as a singular object, the project is organized as a series of linked moments, where threshold, proportion, light, and visual compression gradually shape the experience of the whole. The intention is to create a setting that feels measured and quiet, but still carries strong emotional depth through contrast, texture, and pacing. " +
            "Across the proposal, surfaces are edited carefully so that each junction, opening, and transition contributes to a more continuous architectural narrative. Light is not only used to illuminate the space, but also to structure attention, soften boundaries, and clarify the hierarchy between public and intimate zones. Material choices are imagined as part of the same composition, allowing weight, reflection, shadow, and tactile presence to work together instead of competing for emphasis. " +
            "The result is a project that values calm over spectacle and precision over excess. It aims to feel immersive without becoming heavy, and expressive without losing discipline. In this way, " + detail.title + " becomes less a static formal statement and more a carefully paced environment, where each movement reveals another layer of spatial character, visual stillness, and lived atmosphere over time.";
    }

    function escapeAttribute(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function getPreviewImageSrc(imageSrc) {
        return String(imageSrc || "")
            .split("?")[0]
            .replace("../assets/images/", "../assets/images/previews/")
            .replace(/\.[^/.]+$/, ".jpg") + "?v=2";
    }

    function getPreviewImageStyle(imageSrc) {
        const previewSrc = encodeURI(getPreviewImageSrc(imageSrc)).replace(/'/g, "%27");
        return "--preview-image: url('" + previewSrc + "');";
    }

    function markProgressiveImageLoaded(image) {
        const wrapper = image.closest(".project-detail-gallery-item, .project-detail-gallery-stage-slide");

        if (wrapper) {
            wrapper.classList.add("is-loaded");
        }
    }

    function setupProgressiveImage(image) {
        if (!image) {
            return;
        }

        if (image.complete && image.naturalWidth > 0) {
            markProgressiveImageLoaded(image);
            return;
        }

        image.addEventListener("load", function () {
            markProgressiveImageLoaded(image);
        }, { once: true });
    }

    function appendProjectDetailImage(imageIndex) {
        const detail = projectDetails[currentProjectDetailIndex];
        const imageSrc = currentProjectDetailImages[imageIndex];
        const figure = document.createElement("figure");
        const image = document.createElement("img");

        figure.className = "project-detail-gallery-item";
        figure.setAttribute("style", getPreviewImageStyle(imageSrc) + " transition-delay:" + ((imageIndex % projectImageBatchSize) * 28) + "ms");
        image.className = "project-detail-gallery-image";
        image.src = imageSrc;
        image.alt = (detail ? detail.title : "Project") + " image " + (imageIndex + 1);
        image.loading = "eager";
        image.decoding = "async";
        image.draggable = false;
        image.addEventListener("click", blockProjectDetailImageNavigation);
        figure.appendChild(image);
        projectDetailGallery.appendChild(figure);
        setupProgressiveImage(image);

        image.addEventListener("error", function () {
            markProgressiveImageLoaded(image);
        }, { once: true });
    }

    function appendNextProjectDetailImages() {
        if (!projectDetailGallery) {
            return;
        }

        while (
            currentProjectDetailRenderedCount < currentProjectDetailTargetCount &&
            currentProjectDetailRenderedCount < currentProjectDetailImages.length
        ) {
            appendProjectDetailImage(currentProjectDetailRenderedCount);
            currentProjectDetailRenderedCount += 1;
        }
    }

    function requestProjectDetailImages(targetCount) {
        const nextTargetCount = Math.min(targetCount, currentProjectDetailImages.length);

        if (nextTargetCount <= currentProjectDetailTargetCount) {
            return;
        }

        currentProjectDetailTargetCount = nextTargetCount;
        appendNextProjectDetailImages();
    }

    function loadMoreProjectDetailImages() {
        requestProjectDetailImages(currentProjectDetailTargetCount + projectImageBatchSize);
    }

    function maybeLoadMoreProjectDetailImages() {
        if (!projectDetailGallery || currentProjectDetailTargetCount >= currentProjectDetailImages.length) {
            return;
        }

        const scrollContainer = isMobileHeroMode() && projectDetailShell
            ? projectDetailShell
            : projectDetailGallery;
        const remainingScroll = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight;

        if (remainingScroll < 900) {
            loadMoreProjectDetailImages();
        }
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
        if (!projectDetailStageTrack) {
            return;
        }

        if (!currentProjectGalleryImages.length) {
            projectDetailStageTrack.innerHTML = "";
            return;
        }

        const stageImages = currentProjectGalleryImages.length > 1
            ? [currentProjectGalleryImages[currentProjectGalleryImages.length - 1]].concat(currentProjectGalleryImages, currentProjectGalleryImages[0])
            : currentProjectGalleryImages.slice();

        const existingStageImages = Array.from(projectDetailStageTrack.querySelectorAll(".project-detail-gallery-stage-image"));
        const stageImagesChanged = existingStageImages.length !== stageImages.length || existingStageImages.some(function (image, imageIndex) {
            return image.getAttribute("src") !== stageImages[imageIndex];
        });

        if (stageImagesChanged) {
            projectDetailStageTrack.innerHTML = stageImages.map(function (imageSrc, imageIndex) {
                const isClone = currentProjectGalleryImages.length > 1 && (imageIndex === 0 || imageIndex === stageImages.length - 1);
                const realImageIndex = currentProjectGalleryImages.length > 1
                    ? (imageIndex === 0 ? currentProjectGalleryImages.length - 1 : (imageIndex === stageImages.length - 1 ? 0 : imageIndex - 1))
                    : imageIndex;
                const altText = isClone ? "" : (projectDetailTitle ? projectDetailTitle.textContent + " gallery image " + (realImageIndex + 1) : "");
                const hiddenAttribute = isClone ? ' aria-hidden="true"' : "";
                return '<div class="project-detail-gallery-stage-slide"' + hiddenAttribute + ' style="' + escapeAttribute(getPreviewImageStyle(imageSrc)) + '"><img class="project-detail-gallery-stage-image" src="' + escapeAttribute(imageSrc) + '" alt="' + escapeAttribute(altText) + '" loading="eager" decoding="async" draggable="false"></div>';
            }).join("");
            projectDetailStageTrack.querySelectorAll(".project-detail-gallery-stage-image").forEach(function (image) {
                setupProgressiveImage(image);
                image.addEventListener("click", blockProjectDetailImageNavigation);
                if (image.complete) {
                    applyProjectGalleryStageImageRatio(image);
                    return;
                }

                image.addEventListener("load", function () {
                    applyProjectGalleryStageImageRatio(image);
                    renderProjectGalleryMode();
                }, { once: true });
            });
        }

        const images = Array.from(projectDetailStageTrack.querySelectorAll(".project-detail-gallery-stage-image"));
        const viewport = projectDetailStageTrack.parentElement;

        if (!images.length || !viewport) {
            return;
        }

        images.forEach(applyProjectGalleryStageImageRatio);

        const activeStageIndex = currentProjectGalleryImages.length > 1 ? currentProjectGalleryStageIndex + 1 : currentProjectGalleryStageIndex;
        const slides = Array.from(projectDetailStageTrack.querySelectorAll(".project-detail-gallery-stage-slide"));
        const activeSlide = slides[activeStageIndex] || slides[0];
        const activeImageCenter = activeSlide.offsetLeft + (activeSlide.getBoundingClientRect().width / 2);
        const viewportCenter = viewport.getBoundingClientRect().width / 2;
        const translateX = (viewportCenter - activeImageCenter);

        projectDetailStageTrack.style.transform = "translateX(" + translateX + "px)";
    }

    function setProjectGalleryImage(index) {
        if (!currentProjectGalleryImages.length) {
            return;
        }

        const lastIndex = currentProjectGalleryImages.length - 1;
        currentProjectGalleryStageIndex = index;
        currentProjectGalleryImageIndex = index < 0 ? lastIndex : (index > lastIndex ? 0 : index);
        renderProjectGalleryMode();
    }

    function shiftProjectGalleryImage(direction) {
        setProjectGalleryImage(currentProjectGalleryImageIndex + direction);
    }

    function settleProjectGalleryLoop() {
        if (!projectDetailStageTrack || currentProjectGalleryImages.length < 2) {
            return;
        }

        const lastIndex = currentProjectGalleryImages.length - 1;
        let settledStageIndex = currentProjectGalleryStageIndex;

        if (currentProjectGalleryStageIndex < 0) {
            settledStageIndex = lastIndex;
        } else if (currentProjectGalleryStageIndex > lastIndex) {
            settledStageIndex = 0;
        }

        if (settledStageIndex === currentProjectGalleryStageIndex) {
            return;
        }

        currentProjectGalleryStageIndex = settledStageIndex;
        projectDetailStageTrack.style.transition = "none";
        renderProjectGalleryMode();
        void projectDetailStageTrack.offsetWidth;
        projectDetailStageTrack.style.transition = "";
    }

    function setProjectGalleryMode(isGalleryMode) {
        if (!projectDetailShell || !projectDetailGalleryMode || !projectDetailGalleryToggle) {
            return;
        }

        if (isMobileHeroMode() && isGalleryMode) {
            return;
        }

        projectDetailShell.classList.toggle("is-gallery-mode", isGalleryMode);
        projectDetailGalleryMode.setAttribute("aria-hidden", String(!isGalleryMode));
        projectDetailGalleryToggle.classList.toggle("is-active", isGalleryMode);
        projectDetailGalleryToggle.setAttribute("aria-pressed", String(isGalleryMode));
        setButtonText(projectDetailGalleryToggle, isGalleryMode ? "Detail" : "Gallery", ".project-detail-badge-text", "project-detail-badge-text");

        if (isGalleryMode) {
            scheduleProjectGalleryModeRender();
        }
    }

    function applyProjectGalleryStageImageRatio(image) {
        if (!image) {
            return;
        }

        image.style.width = "";
    }

    function refreshProjectGalleryImageRatios() {
        if (projectDetailStageTrack) {
            projectDetailStageTrack.querySelectorAll(".project-detail-gallery-stage-image").forEach(applyProjectGalleryStageImageRatio);
        }
    }

    function scheduleProjectGalleryModeRender() {
        renderProjectGalleryMode();

        window.requestAnimationFrame(function () {
            renderProjectGalleryMode();

            window.requestAnimationFrame(function () {
                renderProjectGalleryMode();
            });
        });

        window.setTimeout(renderProjectGalleryMode, 360);
    }

    function blockProjectDetailImageNavigation(event) {
        event.preventDefault();
        event.stopPropagation();
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

        enterButton.disabled = hasEntered || nameInput.value.trim() === "";
    }

    function sanitizeDisplayName(value) {
        return (value || "")
            .replace(/\s{2,}/g, " ")
            .replace(/^\s+/, "");
    }

    function formatDisplayName(value) {
        return sanitizeDisplayName(value)
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

    function revealHeroMainImage() {
        if (!hero) {
            return;
        }

        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
                hero.classList.add("is-main-image-ready");
            });
        });
    }

    function preloadHeroMainImage() {
        if (!hero) {
            return;
        }

        const images = Array.from(heroMainImages);

        if (!images.length) {
            revealHeroMainImage();
            return;
        }

        Promise.all(images.map(function (image) {
            return new Promise(function (resolve, reject) {
                function decodeImage() {
                    if (image.decode) {
                        image.decode().then(resolve).catch(resolve);
                        return;
                    }

                    resolve();
                }

                if (image.complete && image.naturalWidth > 0) {
                    decodeImage();
                    return;
                }

                image.addEventListener("load", decodeImage, { once: true });
                image.addEventListener("error", reject, { once: true });
            });
        })).then(revealHeroMainImage).catch(function () {
            hero.classList.add("is-main-image-unavailable");
        });
    }

    function wrapWaveText(text, startIndex) {
        return Array.from(text).map(function (char, offset) {
            const safeChar = char === " " ? "&nbsp;" : char;
            return '<span class="drawings-title-char" style="--char-index:' + (startIndex + offset) + '">' + safeChar + "</span>";
        }).join("");
    }

    const heroScrambleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const heroScrambleTimers = new WeakMap();

    function scrambleHeroText(element, text, options) {
        if (!element || !text) {
            return;
        }

        const existingTimer = heroScrambleTimers.get(element);

        if (existingTimer) {
            window.clearInterval(existingTimer);
        }

        const duration = options && options.duration ? options.duration : 0.8;
        const speed = options && options.speed ? options.speed : 0.04;
        const characters = options && options.characters ? options.characters : heroScrambleCharacters;
        const steps = Math.max(1, Math.round(duration / speed));
        let step = 0;

        element.textContent = text;
        element.classList.add("is-scrambling");

        const timer = window.setInterval(function () {
            let scrambled = "";
            const progress = step / steps;

            for (let index = 0; index < text.length; index += 1) {
                if (text[index] === " ") {
                    scrambled += " ";
                    continue;
                }

                if (progress * text.length > index) {
                    scrambled += text[index];
                } else {
                    scrambled += characters[Math.floor(Math.random() * characters.length)];
                }
            }

            element.textContent = scrambled;
            step += 1;

            if (step > steps) {
                window.clearInterval(timer);
                heroScrambleTimers.delete(element);
                element.textContent = text;
                element.classList.remove("is-scrambling");
            }
        }, speed * 1000);

        heroScrambleTimers.set(element, timer);
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

    function setupSubtitleScrambleAnimation() {
        if (!subtitle || subtitle.hasAttribute("data-scramble-ready")) {
            return;
        }

        const subtitleText = defaultSubtitleText;
        subtitle.setAttribute("data-scramble-ready", "true");
        subtitle.setAttribute("aria-label", subtitleText);
        subtitle.textContent = subtitleText;

    }

    function setupDescriptionScrambleAnimation() {
        const descriptionCopies = document.querySelectorAll(".description-copy");

        descriptionCopies.forEach(function (copy) {
            if (copy.hasAttribute("data-scramble-ready")) {
                return;
            }

            const descriptionText = copy.textContent.trim();
            copy.setAttribute("data-scramble-ready", "true");
            copy.setAttribute("aria-label", descriptionText);
            copy.textContent = descriptionText;
        });
    }

    function triggerHeroTextScramble() {
        const descriptionCopy = document.querySelector(".description-copy:not([aria-hidden='true'])");

        if (subtitle) {
            scrambleHeroText(subtitle, defaultSubtitleText, {
                duration: 2.2,
                speed: 0.055
            });
        }

        if (descriptionCopy) {
            scrambleHeroText(descriptionCopy, descriptionCopy.getAttribute("aria-label") || descriptionCopy.textContent.trim(), {
                duration: 2.6,
                speed: 0.055
            });
        }
    }

    function updateSubtitle() {
        if (!nameInput || !subtitle) {
            return;
        }

        if (hasEntered) {
            if (submittedDisplayName !== "" && nameInput.value !== submittedDisplayName) {
                nameInput.value = submittedDisplayName;
            }
            return;
        }

        const enteredName = formatDisplayName(nameInput.value).trim();
        const subtitleText = defaultSubtitleText;
        const heroNameText = enteredName === "" ? "Guest" : enteredName;

        if (!hasPlayedFirstTypedAnimation) {
            setupSubtitleScrambleAnimation();
            hasPlayedFirstTypedAnimation = true;
        }

        if (heroEnteredName) {
            heroEnteredName.textContent = heroNameText;
        }

        if (heroSentenceName) {
            heroSentenceName.textContent = heroNameText;
        }

    }

    function setupContactDotField() {
        if (!contactSection || !contactDotField) {
            return;
        }

        const context = contactDotField.getContext("2d");

        if (!context) {
            return;
        }

        function buildContactDots() {
            const rect = contactSection.getBoundingClientRect();
            const width = Math.max(1, Math.round(rect.width));
            const height = Math.max(1, Math.round(contactSection.offsetHeight));
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            const spacing = window.innerWidth <= 768 ? 10 : 8;
            const offset = spacing / 2;

            contactDotField.width = Math.round(width * pixelRatio);
            contactDotField.height = Math.round(height * pixelRatio);
            contactDotField.style.width = width + "px";
            contactDotField.style.height = height + "px";
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            contactDots = [];

            for (let y = offset; y < height; y += spacing) {
                for (let x = offset; x < width; x += spacing) {
                    contactDots.push({
                        x: x,
                        y: y
                    });
                }
            }

            contactDotPointer.x = width * 0.68;
            contactDotPointer.y = height * 0.46;
            contactDotPointer.targetX = contactDotPointer.x;
            contactDotPointer.targetY = contactDotPointer.y;
            contactDotPointer.isActive = false;
            drawContactDots();
        }

        function drawContactDots() {
            const width = contactDotField.width / Math.min(window.devicePixelRatio || 1, 2);
            const height = contactDotField.height / Math.min(window.devicePixelRatio || 1, 2);
            const influenceX = window.innerWidth <= 768 ? 170 : 320;
            const influenceY = window.innerWidth <= 768 ? 130 : 230;
            const baseRadius = window.innerWidth <= 768 ? 0.76 : 0.82;
            const maxRadius = window.innerWidth <= 768 ? 1.0 : 1.45;

            context.clearRect(0, 0, width, height);
            context.fillStyle = "#111111";

            contactDots.forEach(function (dot) {
                let radius = baseRadius;

                if (contactDotPointer.isActive) {
                    const normalizedX = (dot.x - contactDotPointer.x) / influenceX;
                    const normalizedY = (dot.y - contactDotPointer.y) / influenceY;
                    const distance = Math.sqrt((normalizedX * normalizedX) + (normalizedY * normalizedY));
                    const falloff = Math.max(0, 1 - distance);
                    const easedFalloff = Math.pow(falloff, 1.55);
                    radius += easedFalloff * maxRadius;
                }

                context.beginPath();
                context.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
                context.fill();
            });
        }

        function animateContactDots() {
            const ease = contactDotPointer.isActive ? 0.16 : 0.055;

            contactDotPointer.x += (contactDotPointer.targetX - contactDotPointer.x) * ease;
            contactDotPointer.y += (contactDotPointer.targetY - contactDotPointer.y) * ease;
            drawContactDots();

            if (isContactDotVisible && !reducedMotionQuery.matches) {
                contactDotFrame = window.requestAnimationFrame(animateContactDots);
            } else {
                contactDotFrame = null;
            }
        }

        function requestContactDotAnimation() {
            if (contactDotFrame || reducedMotionQuery.matches) {
                drawContactDots();
                return;
            }

            contactDotFrame = window.requestAnimationFrame(animateContactDots);
        }

        contactSection.addEventListener("pointermove", function (event) {
            const rect = contactSection.getBoundingClientRect();

            contactDotPointer.targetX = event.clientX - rect.left;
            contactDotPointer.targetY = event.clientY - rect.top;
            contactDotPointer.isActive = true;
            requestContactDotAnimation();
        }, { passive: true });

        contactSection.addEventListener("pointerleave", function () {
            contactDotPointer.isActive = false;
            drawContactDots();
        });

        if ("IntersectionObserver" in window) {
            const contactObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    isContactDotVisible = entry.isIntersecting;

                    if (isContactDotVisible) {
                        requestContactDotAnimation();
                    }
                });
            }, { threshold: 0.08 });

            contactObserver.observe(contactSection);
        } else {
            isContactDotVisible = true;
        }

        buildContactDots();
        window.addEventListener("resize", buildContactDots);
    }

    function setupCursorFollower() {
        if (!cursorFollower) {
            return;
        }

        const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
        const interactiveSelector = [
            "a[href]",
            "button:not([disabled])",
            "input:not([disabled])",
            "textarea:not([disabled])",
            "select:not([disabled])",
            "summary",
            "[role='button']",
            "[tabindex]:not([tabindex='-1'])",
            "[data-detail-close]",
            "[data-drawings-detail-close]",
            ".project-card",
            ".drawings-card",
            ".about-frame-link"
        ].join(", ");
        let idleTimer = null;
        let cursorFrame = null;
        let isEnabled = false;
        const cursorPosition = {
            x: -120,
            y: -120,
            targetX: -120,
            targetY: -120,
            hasMoved: false
        };

        function renderCursorFollower() {
            cursorFollower.style.setProperty("--cursor-x", cursorPosition.x + "px");
            cursorFollower.style.setProperty("--cursor-y", cursorPosition.y + "px");
        }

        function animateCursorFollower() {
            if (!isEnabled) {
                cursorFrame = null;
                return;
            }

            const ease = cursorFollower.classList.contains("is-interactive") ? 0.085 : 0.06;
            const deltaX = cursorPosition.targetX - cursorPosition.x;
            const deltaY = cursorPosition.targetY - cursorPosition.y;

            cursorPosition.x += deltaX * ease;
            cursorPosition.y += deltaY * ease;
            renderCursorFollower();

            if (Math.abs(deltaX) > 0.08 || Math.abs(deltaY) > 0.08) {
                cursorFrame = window.requestAnimationFrame(animateCursorFollower);
                return;
            }

            cursorPosition.x = cursorPosition.targetX;
            cursorPosition.y = cursorPosition.targetY;
            renderCursorFollower();
            cursorFrame = null;
        }

        function requestCursorAnimation() {
            if (!cursorFrame) {
                cursorFrame = window.requestAnimationFrame(animateCursorFollower);
            }
        }

        function isCursorHintAllowed() {
            const currentSection = getCurrentSection();
            return hasEntered && currentSection && currentSection.id === "home";
        }

        function setIdleTimer() {
            window.clearTimeout(idleTimer);
            cursorFollower.classList.toggle("is-idle", isCursorHintAllowed());
        }

        function getInteractiveElement(x, y) {
            const target = document.elementFromPoint(x, y);

            if (!target || target === cursorFollower) {
                return null;
            }

            return target.closest(interactiveSelector);
        }

        function syncInteractiveState(x, y) {
            const interactiveElement = getInteractiveElement(x, y);

            cursorFollower.classList.toggle("is-interactive", Boolean(interactiveElement));
        }

        function handlePointerMove(event) {
            if (!isEnabled || event.pointerType === "touch") {
                return;
            }

            cursorPosition.targetX = event.clientX;
            cursorPosition.targetY = event.clientY;

            if (!cursorPosition.hasMoved) {
                cursorPosition.x = event.clientX;
                cursorPosition.y = event.clientY;
                cursorPosition.hasMoved = true;
                renderCursorFollower();
            }

            cursorFollower.classList.add("is-active");
            syncInteractiveState(event.clientX, event.clientY);
            requestCursorAnimation();
            setIdleTimer();
        }

        function handleCursorScroll() {
            if (!isEnabled) {
                return;
            }

            setIdleTimer();
        }

        function handleEnteredStateChange() {
            if (!isEnabled || !cursorPosition.hasMoved) {
                return;
            }

            setIdleTimer();
        }

        function hideCursorFollower(event) {
            if (event && event.relatedTarget) {
                return;
            }

            cursorFollower.classList.remove("is-active", "is-idle", "is-interactive");
            window.clearTimeout(idleTimer);
            if (cursorFrame) {
                window.cancelAnimationFrame(cursorFrame);
                cursorFrame = null;
            }
            cursorPosition.hasMoved = false;
        }

        function syncCursorAvailability() {
            isEnabled = finePointerQuery.matches;
            body.classList.toggle("has-custom-cursor", isEnabled);

            if (!isEnabled) {
                hideCursorFollower();
            }
        }

        syncCursorAvailability();
        document.addEventListener("pointermove", handlePointerMove, { passive: true });
        document.addEventListener("pointerout", hideCursorFollower);
        document.addEventListener("portfolio:entered", handleEnteredStateChange);
        window.addEventListener("scroll", handleCursorScroll, { passive: true });
        window.addEventListener("wheel", handleCursorScroll, { passive: true });

        if (typeof finePointerQuery.addEventListener === "function") {
            finePointerQuery.addEventListener("change", syncCursorAvailability);
        } else if (typeof finePointerQuery.addListener === "function") {
            finePointerQuery.addListener(syncCursorAvailability);
        }
    }

    function resetMobileHeroViewport() {
        if (!isMobileHeroMode()) {
            return;
        }

        if (document.activeElement && typeof document.activeElement.blur === "function") {
            document.activeElement.blur();
        }

        if (hero) {
            hero.scrollIntoView({ block: "start", inline: "nearest" });
        }

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });

        [0, 90, 260].forEach(function (delay) {
            window.setTimeout(function () {
                if (hero) {
                    hero.scrollIntoView({ block: "start", inline: "nearest" });
                }

                window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            }, delay);
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
        const detail = projectDetails[index];

        if (!detail || !projectDetailOverlay) {
            return;
        }

        cancelInertiaScroll();

        lastFocusedProjectCard = sourceCard || null;
        currentProjectDetailIndex = index;
        currentProjectDetailImages = detail.images.slice();
        currentProjectDetailRenderedCount = 0;
        currentProjectDetailTargetCount = 0;
        currentProjectGalleryImages = (detail.galleryImages || detail.images).slice();
        currentProjectGalleryImageIndex = 0;
        currentProjectGalleryStageIndex = 0;
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
        projectDetailGallery.innerHTML = "";
        requestProjectDetailImages(projectImageBatchSize);
        setProjectDetailExpanded(false);
        setProjectGalleryMode(false);
        renderProjectGalleryMode();

        if (projectDetailCloseTimer) {
            window.clearTimeout(projectDetailCloseTimer);
            projectDetailCloseTimer = null;
        }

        projectDetailOverlay.classList.remove("is-active", "is-closing");
        projectDetailOverlay.classList.add("is-visible");
        projectDetailOverlay.setAttribute("aria-hidden", "false");
        body.classList.add("is-project-detail-open");
        if (projectDetailShell) {
            projectDetailShell.scrollTop = 0;
        }
        projectDetailGallery.scrollTop = 0;

        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
                projectDetailOverlay.classList.add("is-active");
                refreshProjectGalleryImageRatios();
                renderProjectGalleryMode();
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

        const lockedPageY = window.scrollY;
        cancelInertiaScroll();
        projectDetailOverlay.classList.remove("is-active");
        projectDetailOverlay.classList.add("is-closing");
        projectDetailOverlay.setAttribute("aria-hidden", "true");
        projectDetailCloseTimer = window.setTimeout(function () {
            window.scrollTo(0, lockedPageY);
            projectDetailOverlay.classList.remove("is-visible", "is-closing");
            body.classList.remove("is-project-detail-open");
            currentProjectDetailIndex = -1;
            currentProjectDetailImages = [];
            currentProjectDetailRenderedCount = 0;
            currentProjectDetailTargetCount = 0;
            currentProjectGalleryImages = [];
            currentProjectGalleryImageIndex = 0;
            currentProjectGalleryStageIndex = 0;
            setProjectGalleryMode(false);
            setProjectDetailExpanded(false);
            projectDetailCloseTimer = null;

            if (lastFocusedProjectCard) {
                lastFocusedProjectCard.focus({ preventScroll: true });
                window.scrollTo(0, lockedPageY);
            }

            syncInertiaScrollPosition();
        }, 240);
    }

    function openDrawingsDetail(imageSource, imageAlt, sourceCard) {
        if (!drawingsDetailOverlay || !drawingsDetailImage || !imageSource) {
            return;
        }

        lastFocusedDrawingCard = sourceCard || null;
        currentDrawingsDetailIndex = sourceCard && drawingsTrack
            ? Array.from(drawingsTrack.querySelectorAll(".drawings-card")).indexOf(sourceCard)
            : -1;
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
            currentDrawingsDetailIndex = -1;
            drawingsDetailCloseTimer = null;

            if (lastFocusedDrawingCard && window.innerWidth > 768) {
                lastFocusedDrawingCard.focus({ preventScroll: true });
            }
        }, 320);
    }

    function setDrawingsDetailImage(index) {
        if (!drawingsTrack || !drawingsDetailImage) {
            return;
        }

        const cards = Array.from(drawingsTrack.querySelectorAll(".drawings-card"));

        if (!cards.length) {
            return;
        }

        const lastIndex = cards.length - 1;
        const nextIndex = index < 0 ? lastIndex : (index > lastIndex ? 0 : index);
        const nextCard = cards[nextIndex];
        const nextImage = nextCard ? nextCard.querySelector(".drawings-image") : null;

        if (!nextImage) {
            return;
        }

        currentDrawingsDetailIndex = nextIndex;
        lastFocusedDrawingCard = nextCard;
        drawingsDetailImage.src = nextImage.getAttribute("src");
        drawingsDetailImage.alt = nextImage.getAttribute("alt") || "";
    }

    function shiftDrawingsDetailImage(direction) {
        setDrawingsDetailImage(currentDrawingsDetailIndex + direction);
    }

    function preloadProjectDetailImages() {
        const uniqueImages = Array.from(new Set(projectDetails.flatMap(function (detail) {
            return detail.images.slice(0, 1);
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

    function getMaxPageScroll() {
        return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    function clampPageScroll(value) {
        return Math.max(0, Math.min(value, getMaxPageScroll()));
    }

    function syncInertiaScrollPosition() {
        inertiaScrollCurrentY = window.scrollY;
        inertiaScrollTargetY = window.scrollY;
    }

    function cancelInertiaScroll() {
        if (inertiaScrollFrame) {
            window.cancelAnimationFrame(inertiaScrollFrame);
            inertiaScrollFrame = null;
        }

        isInertiaScrollAnimating = false;
        syncInertiaScrollPosition();
    }

    function isScrollableElement(element) {
        if (!element || element === document.body || element === document.documentElement) {
            return false;
        }

        const styles = window.getComputedStyle(element);
        const overflowY = styles.overflowY;
        const canScrollY = overflowY === "auto" || overflowY === "scroll";

        return canScrollY && element.scrollHeight > element.clientHeight + 1;
    }

    function hasScrollableAncestor(element) {
        let node = element;

        while (node && node !== document.body && node !== document.documentElement) {
            if (isScrollableElement(node)) {
                return true;
            }

            node = node.parentElement;
        }

        return false;
    }

    function shouldUseInertiaScroll(event) {
        if (!hasEntered || reducedMotionQuery.matches || nonDesktopScrollQuery.matches) {
            return false;
        }

        if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey) {
            return false;
        }

        if (body.classList.contains("is-project-detail-open") || isHeroStoryActive() || isHeroScrollLocked()) {
            return false;
        }

        if (event.target && hasScrollableAncestor(event.target)) {
            return false;
        }

        return true;
    }

    function shouldBlockBackgroundScroll(event) {
        return body.classList.contains("is-project-detail-open") &&
            !(event.target && hasScrollableAncestor(event.target));
    }

    function getNormalizedWheelDeltaY(event) {
        if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
            return event.deltaY * 16;
        }

        if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
            return event.deltaY * window.innerHeight;
        }

        return event.deltaY;
    }

    function stepInertiaScroll() {
        const distance = inertiaScrollTargetY - inertiaScrollCurrentY;

        if (Math.abs(distance) <= inertiaScrollSettings.settleDistance) {
            inertiaScrollCurrentY = inertiaScrollTargetY;
            window.scrollTo(0, inertiaScrollCurrentY);
            inertiaScrollFrame = null;
            isInertiaScrollAnimating = false;
            return;
        }

        inertiaScrollCurrentY += distance * inertiaScrollSettings.lerp;
        window.scrollTo(0, inertiaScrollCurrentY);
        inertiaScrollFrame = window.requestAnimationFrame(stepInertiaScroll);
    }

    function handleInertiaWheel(event) {
        if (!shouldUseInertiaScroll(event)) {
            return false;
        }

        if (activeScrollFrame) {
            window.cancelAnimationFrame(activeScrollFrame);
            activeScrollFrame = null;
            heroState.isAwaitingAutoScroll = false;
            pendingFloatingNavSectionId = "";
        }

        if (!isInertiaScrollAnimating) {
            syncInertiaScrollPosition();
        }

        event.preventDefault();
        wakeFloatingNav();
        inertiaScrollTargetY = clampPageScroll(inertiaScrollTargetY + (getNormalizedWheelDeltaY(event) * inertiaScrollSettings.wheelMultiplier));

        if (!inertiaScrollFrame) {
            isInertiaScrollAnimating = true;
            inertiaScrollFrame = window.requestAnimationFrame(stepInertiaScroll);
        }

        return true;
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
        cancelInertiaScroll();

        const destinationY = clampPageScroll(targetY);
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
                syncInertiaScrollPosition();
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

        const currentSection = getCurrentSection();
        const shouldShow = !!currentSection && currentSection.id === "contact";
        sectionReturn.classList.toggle("is-visible", shouldShow);
    }

    function clearFloatingNavJellyTimer() {
        if (floatingNavJellyTimer) {
            window.clearTimeout(floatingNavJellyTimer);
            floatingNavJellyTimer = null;
        }
    }

    function setFloatingNavJellyTarget(targetLink, options) {
        if (!sectionFloatingNav || !sectionFloatingHighlight || !targetLink) {
            return;
        }

        if (sectionFloatingNav.classList.contains("is-collapsed")) {
            sectionFloatingNav.classList.remove("has-jelly-target", "is-jelly-moving");
            return;
        }

        const navRect = sectionFloatingNav.getBoundingClientRect();
        const linkRect = targetLink.getBoundingClientRect();
        const isImmediate = !!(options && options.immediate);
        const highlightX = linkRect.left - navRect.left;
        const highlightY = linkRect.top - navRect.top;
        const glowX = ((highlightX + (linkRect.width / 2)) / Math.max(navRect.width, 1)) * 100;

        sectionFloatingNav.style.setProperty("--nav-highlight-x", highlightX + "px");
        sectionFloatingNav.style.setProperty("--nav-highlight-y", highlightY + "px");
        sectionFloatingNav.style.setProperty("--nav-highlight-width", linkRect.width + "px");
        sectionFloatingNav.style.setProperty("--nav-highlight-height", linkRect.height + "px");
        sectionFloatingNav.style.setProperty("--nav-glow-x", glowX + "%");
        sectionFloatingNav.style.setProperty("--nav-highlight-scale-x", isImmediate ? "1" : "1.18");
        sectionFloatingNav.style.setProperty("--nav-highlight-scale-y", isImmediate ? "1" : "0.92");
        sectionFloatingNav.classList.add("has-jelly-target");

        clearFloatingNavJellyTimer();

        if (isImmediate || reducedMotionQuery.matches) {
            sectionFloatingNav.classList.remove("is-jelly-moving");
            sectionFloatingNav.style.setProperty("--nav-highlight-scale-x", "1");
            sectionFloatingNav.style.setProperty("--nav-highlight-scale-y", "1");
            return;
        }

        sectionFloatingNav.classList.add("is-jelly-moving");
        floatingNavJellyTimer = window.setTimeout(function () {
            sectionFloatingNav.classList.remove("is-jelly-moving");
            sectionFloatingNav.style.setProperty("--nav-highlight-scale-x", "1");
            sectionFloatingNav.style.setProperty("--nav-highlight-scale-y", "1");
            floatingNavJellyTimer = null;
        }, 340);
    }

    function syncFloatingNavJelly(options) {
        if (!sectionFloatingNav || !sectionFloatingHighlight) {
            return;
        }

        const activeLink = Array.from(sectionFloatingLinks).find(function (link) {
            return link.classList.contains("is-active");
        });

        if (!activeLink || !sectionFloatingNav.classList.contains("is-visible") || sectionFloatingNav.classList.contains("is-collapsed")) {
            sectionFloatingNav.classList.remove("has-jelly-target", "is-jelly-moving");
            return;
        }

        setFloatingNavJellyTarget(activeLink, options);
    }

    function clearFloatingNavJellyState() {
        if (!sectionFloatingNav) {
            return;
        }

        clearFloatingNavJellyTimer();
        sectionFloatingNav.classList.remove("has-jelly-target", "is-jelly-moving");
        sectionFloatingNav.style.setProperty("--nav-highlight-scale-x", "1");
        sectionFloatingNav.style.setProperty("--nav-highlight-scale-y", "1");
    }

    function setFloatingNavCollapsed(isCollapsed) {
        if (!sectionFloatingNav) {
            return;
        }

        if (window.innerWidth <= 768) {
            sectionFloatingNav.classList.remove("is-collapsed");
            return;
        }

        if (isCollapsed) {
            clearFloatingNavJellyState();
        }

        sectionFloatingNav.classList.toggle("is-collapsed", isCollapsed);

        if (!isCollapsed) {
            syncFloatingNavJelly({ immediate: true });
        }
    }

    function shouldWakeFloatingNavOnScroll() {
        if (!sectionFloatingNav || !sectionFloatingNav.classList.contains("is-visible")) {
            return false;
        }

        return window.innerWidth > 768 && window.innerWidth <= 1080;
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

        syncFloatingNavJelly({ immediate: true });
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
        submittedDisplayName = name;
        html.classList.remove("is-locked");
        body.classList.remove("is-locked");
        resetHeroFlowState();
        updateFloatingNavState();
        document.dispatchEvent(new CustomEvent("portfolio:entered"));
    }

    function lockEnterForm(name) {
        submittedDisplayName = name;

        if (nameInput) {
            nameInput.value = name;
            nameInput.blur();
            nameInput.readOnly = true;
            nameInput.disabled = true;
            nameInput.setAttribute("aria-disabled", "true");
        }

        if (enterButton) {
            enterButton.disabled = true;
            enterButton.setAttribute("aria-disabled", "true");
        }
    }

    function submitEnterForm() {
        if (hasEntered) {
            return;
        }

        const enteredName = nameInput ? formatDisplayName(nameInput.value).trim() : "";

        if (nameInput) {
            nameInput.value = enteredName;
        }

        resetMobileHeroViewport();

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
        lockEnterForm(enteredName);
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
    }

    setupDrawingsTitleAnimation();
    setupSubtitleScrambleAnimation();
    setupDescriptionScrambleAnimation();
    preloadHeroMainImage();
    updateButtonState();
    updateSubtitle();
    setupContactDotField();
    setupCursorFollower();
    preloadProjectDetailImages();
    buildDrawingsLoop();
    updateDrawingsCarousel();
    requestDrawingsStackMotion();
    window.setTimeout(function () {
        if (heroContent) {
            heroContent.classList.add("is-intro-ready");
        }

        triggerHeroTextScramble();
    }, heroIntroDelay);
    window.setTimeout(markDescriptionRevealComplete, descriptionRevealDelay + descriptionRevealDuration + 2000);

    if (nameInput) {
        nameInput.addEventListener("input", function () {
            updateButtonState();
            updateSubtitle();
        });

        nameInput.addEventListener("keydown", function (event) {
            if (event.key !== "Enter" || event.isComposing || !isMobileHeroMode()) {
                return;
            }

            event.preventDefault();
            submitEnterForm();
        });
    }

    if (enterForm) {
        enterForm.addEventListener("submit", function (event) {
            event.preventDefault();
            submitEnterForm();
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

    function clearTimeFilterCloseTimer() {
        if (timeFilterCloseTimer) {
            window.clearTimeout(timeFilterCloseTimer);
            timeFilterCloseTimer = null;
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

    function setTimeFilterPanelOpen(isOpen, options) {
        if (!timeFilterPanel || !timeFilterToggle) {
            return;
        }

        const closeInstantly = !!(options && options.closeInstantly);
        clearTimeFilterAutoCloseTimer();
        clearTimeFilterCloseTimer();

        if (isOpen && typologyFilterPanel && typologyFilterPanel.classList.contains("is-open")) {
            setTypologyFilterPanelOpen(false, { closeInstantly: true });
        }

        if (isOpen) {
            timeFilterPanel.classList.remove("is-closing");
            timeFilterPanel.classList.add("is-open");
            timeFilterPanel.setAttribute("aria-hidden", "false");
        } else if (timeFilterPanel.classList.contains("is-open") || timeFilterPanel.classList.contains("is-closing")) {
            if (closeInstantly) {
                timeFilterPanel.classList.remove("is-open", "is-closing");
                timeFilterPanel.setAttribute("aria-hidden", "true");
            } else {
            timeFilterPanel.classList.remove("is-open");
            timeFilterPanel.classList.add("is-closing");
            timeFilterPanel.setAttribute("aria-hidden", "true");
            timeFilterCloseTimer = window.setTimeout(function () {
                timeFilterPanel.classList.remove("is-closing");
                timeFilterCloseTimer = null;
            }, 560);
            }
        }

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

    function clearTypologyFilterCloseTimer() {
        if (typologyFilterCloseTimer) {
            window.clearTimeout(typologyFilterCloseTimer);
            typologyFilterCloseTimer = null;
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

    function setTypologyFilterPanelOpen(isOpen, options) {
        if (!typologyFilterPanel || !typologyFilterToggle) {
            return;
        }

        const closeInstantly = !!(options && options.closeInstantly);
        clearTypologyFilterAutoCloseTimer();
        clearTypologyFilterCloseTimer();

        if (isOpen && timeFilterPanel && timeFilterPanel.classList.contains("is-open")) {
            setTimeFilterPanelOpen(false, { closeInstantly: true });
        }

        if (isOpen) {
            typologyFilterPanel.classList.remove("is-closing");
            typologyFilterPanel.classList.add("is-open");
            typologyFilterPanel.setAttribute("aria-hidden", "false");
        } else if (typologyFilterPanel.classList.contains("is-open") || typologyFilterPanel.classList.contains("is-closing")) {
            if (closeInstantly) {
                typologyFilterPanel.classList.remove("is-open", "is-closing");
                typologyFilterPanel.setAttribute("aria-hidden", "true");
            } else {
            typologyFilterPanel.classList.remove("is-open");
            typologyFilterPanel.classList.add("is-closing");
            typologyFilterPanel.setAttribute("aria-hidden", "true");
            typologyFilterCloseTimer = window.setTimeout(function () {
                typologyFilterPanel.classList.remove("is-closing");
                typologyFilterCloseTimer = null;
            }, 560);
            }
        }

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
            setTimeFilterPanelOpen(willOpen, { closeInstantly: !willOpen });
        });

        timeFilterToggle.addEventListener("mouseenter", clearTimeFilterAutoCloseTimer);
        timeFilterToggle.addEventListener("mouseleave", scheduleTimeFilterAutoClose);
        timeFilterPanel.addEventListener("mouseenter", clearTimeFilterAutoCloseTimer);
        timeFilterPanel.addEventListener("mouseleave", scheduleTimeFilterAutoClose);
    }

    if (typologyFilterToggle && typologyFilterPanel) {
        typologyFilterToggle.addEventListener("click", function () {
            const willOpen = !typologyFilterPanel.classList.contains("is-open");
            setTypologyFilterPanelOpen(willOpen, { closeInstantly: !willOpen });
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
            if (isMobileHeroMode()) {
                setProjectGalleryMode(false);
                return;
            }

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
            shiftProjectGalleryImage(-1);
        });
        projectDetailPrevImage.addEventListener("dblclick", function (event) {
            event.preventDefault();
        });
    }

    if (projectDetailNextImage) {
        projectDetailNextImage.addEventListener("click", function () {
            shiftProjectGalleryImage(1);
        });
        projectDetailNextImage.addEventListener("dblclick", function (event) {
            event.preventDefault();
        });
    }

    if (projectDetailStageTrack) {
        projectDetailStageTrack.addEventListener("transitionend", function (event) {
            if (event.target === projectDetailStageTrack && event.propertyName === "transform") {
                settleProjectGalleryLoop();
            }
        });
    }

    if (projectDetailGallery) {
        projectDetailGallery.addEventListener("scroll", maybeLoadMoreProjectDetailImages, { passive: true });
    }

    if (projectDetailShell) {
        projectDetailShell.addEventListener("scroll", maybeLoadMoreProjectDetailImages, { passive: true });
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

        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            const direction = event.key === "ArrowLeft" ? -1 : 1;

            if (projectDetailShell && projectDetailShell.classList.contains("is-gallery-mode")) {
                event.preventDefault();
                shiftProjectGalleryImage(direction);
                return;
            }

            if (drawingsDetailOverlay && drawingsDetailOverlay.classList.contains("is-visible")) {
                event.preventDefault();
                shiftDrawingsDetailImage(direction);
            }
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
            syncFloatingNavJelly();
        });
        sectionFloatingNav.addEventListener("pointermove", wakeFloatingNav);
        sectionFloatingNav.addEventListener("focusin", wakeFloatingNav);
        sectionFloatingNav.addEventListener("pointerleave", function () {
            isPointerOverFloatingNav = false;
            clearFloatingNavJellyState();
            scheduleFloatingNavCollapse();
        });
        sectionFloatingNav.addEventListener("focusout", function () {
            window.setTimeout(function () {
                if (sectionFloatingNav && !sectionFloatingNav.contains(document.activeElement)) {
                    clearFloatingNavJellyState();
                    scheduleFloatingNavCollapse();
                }
            }, 0);
        });
    }

    sectionFloatingLinks.forEach(function (link) {
        link.addEventListener("pointerenter", function () {
            setFloatingNavJellyTarget(link);
        });
        link.addEventListener("focus", function () {
            setFloatingNavJellyTarget(link);
        });
    });

    window.addEventListener("scroll", updateSectionReturnVisibility, { passive: true });
    window.addEventListener("scroll", function () {
        updateFloatingNavState();
        requestDrawingsStackMotion();
        if (isPointerOverFloatingNav || shouldWakeFloatingNavOnScroll()) {
            wakeFloatingNav();
            scheduleFloatingNavCollapse();
        }
    }, { passive: true });
    window.addEventListener("wheel", function (event) {
        if (isHeroScrollLocked()) {
            event.preventDefault();
            return;
        }

        if (shouldBlockBackgroundScroll(event)) {
            event.preventDefault();
            return;
        }

        if (scrubHeroStory(event.deltaY)) {
            event.preventDefault();
            return;
        }

        if (handleInertiaWheel(event)) {
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

        if (shouldBlockBackgroundScroll(event)) {
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
    window.addEventListener("keydown", function (event) {
        if (event.key === "Home" || event.key === "End" || event.key === "PageUp" || event.key === "PageDown" || event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === " ") {
            cancelInertiaScroll();
        }
    }, { passive: true });
    window.addEventListener("scroll", requestSectionStackMotion, { passive: true });
    window.addEventListener("resize", updateSectionReturnVisibility);
    window.addEventListener("resize", function () {
        updateFloatingNavState();
        syncFloatingNavJelly({ immediate: true });
    });
    window.addEventListener("resize", function () {
        buildDrawingsLoop();
        updateDrawingsCarousel();
        requestDrawingsStackMotion();
        updateSectionStackMotion();
        syncFilterPanelOffsets();
        refreshProjectGalleryImageRatios();
        syncInertiaScrollPosition();

        if (projectDetailShell && projectDetailShell.classList.contains("is-gallery-mode")) {
            if (isMobileHeroMode()) {
                setProjectGalleryMode(false);
            } else {
                renderProjectGalleryMode();
            }
        }
    });
    updateSectionReturnVisibility();
    updateFloatingNavState();
    updateSectionStackMotion();
});
