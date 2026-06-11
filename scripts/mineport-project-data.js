function createProjectDetail(title, location, typology, category, year, description, image, images, galleryImages, fullDescription) {
    return {
        title: title,
        location: location,
        typology: typology,
        category: category,
        year: year,
        description: description,
        images: images || Array(10).fill(image),
        galleryImages: galleryImages || images || Array(10).fill(image),
        fullDescription: fullDescription || ""
    };
}

const project1DetailImages = ["1.jpg", "1-2.jpg", "2.jpg", "2-1.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "12.jpg", "13.jpg"].map(function (imageName) {
    return "../assets/images/projects/project1/detail/" + imageName + "?v=1";
});

const project1GalleryImages = ["0.jpg", "1.jpg", "1-1.jpg", "1-2.jpg", "1-3.jpg", "1-4.jpg", "2-1.jpg", "2-2.jpg", "2-3.jpg", "2-4.jpg", "2-5.jpg", "2-6.jpg", "2-7.jpg", "3-1.jpg", "3-2.jpg", "3-3.jpg", "3-4.jpg", "3-5.jpg", "3-6.jpg", "3-7.jpg", "3-8.jpg", "3-9.jpg", "4-1.jpg", "4-2.jpg", "4-3.jpg", "4-4.jpg", "4-5.jpg", "4-6.jpg", "4-7.jpg", "4-8.jpg", "5-1.jpg", "5-2.jpg", "5-3.jpg", "5-4.jpg", "5-5.jpg", "5-6.jpg", "5-7.jpg"].map(function (imageName) {
    return "../assets/images/projects/project1/gallery/" + imageName + "?v=1";
});

const project1Description = [
    "This project creates a multifunctional workshop for a school, replacing isolated studios with a more open and collective spatial structure.",
    "Expanded indoor and outdoor public areas turn the building into a vessel for interaction, exchange, and unexpected creative reactions among students."
];

const project1FullDescription = "Instead of separating making, discussion, and circulation into fixed zones, the proposal allows these activities to overlap throughout the building. Studio work can spill into shared areas, informal critiques can happen along circulation paths, and outdoor spaces become part of the daily rhythm of learning rather than leftover space around the building.\n\nThis arrangement encourages students to encounter work outside their own discipline and to understand creativity as something that grows through contact. The architecture supports moments of watching, joining, pausing, and exchanging, so the school environment becomes more fluid and socially active.\n\nBy treating the workshop as a living container for unpredictable interaction, the project values process as much as finished work. Its spatial organization is designed to make collaboration feel natural, allowing different ideas, routines, and personalities to meet and generate new possibilities.";

const project3DetailImages = ["1.jpg", "2.jpg", "2-1.jpg", "2-2.jpg", "2-3.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg"].map(function (imageName) {
    return "../assets/images/projects/project3/detail/" + imageName + "?v=1";
});

const project3GalleryImages = ["1.jpg", "1-2.jpg", "1-3.jpg", "1-4.jpg", "2-1.jpg", "3-1.jpg", "3-2.jpg", "3-3.jpg", "3-3-1.jpg", "3-3-2.jpg", "3-3-3.jpg", "3-3-4.jpg", "3-3-5.jpg", "3-3-6.jpg", "3-4.jpg", "3-5.jpg", "3-6.jpg", "3-7.jpg", "3-8.jpg", "3-9.jpg", "3-10.jpg", "3-11.jpg", "3-12.jpg", "3-13.jpg", "3-14.jpg", "4-1.jpg", "4-2.jpg", "4-3.jpg", "4-4.jpg", "4-5.jpg", "4-6.jpg", "4-7.jpg", "4-8.jpg", "4-9.jpg", "4-11.jpg", "5-1.jpg"].map(function (imageName) {
    return "../assets/images/projects/project3/gallery/" + imageName + "?v=1";
});

const project3Description = [
    "A church should be more than a place of worship; it should become part of daily life and the surrounding community.",
    "The project explores how spaces for gathering, learning, support, and reflection can create a more open and welcoming spiritual environment."
];

const project3FullDescription = "The proposal rethinks sacred space as something that can remain active beyond ceremony. Flexible rooms, learning areas, social spaces, and support programs allow the building to serve different groups at different times, creating a more continuous relationship between spiritual practice and ordinary routines.\n\nLight, material, threshold, and circulation are used to shape a gradual transition from public openness to quieter moments of reflection. Rather than relying only on symbolic form, the atmosphere is built through proportion, pause, and carefully framed movement.\n\nThrough this expanded role, the church becomes a generous civic presence as well as a spiritual one. It offers places for care, conversation, guidance, and cultural exchange, helping the building strengthen social bonds while remaining calm, accessible, and emotionally grounded.";

const project5GalleryImages = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "8-1.jpg", "8-2.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg", "21.jpg", "22.jpg", "23.jpg", "24.jpg", "25.jpg", "26.jpg", "27.jpg", "28.jpg"].map(function (imageName) {
    return "../assets/images/projects/project5/gallery/" + imageName + "?v=1";
});

const project5DetailImages = ["1.jpg", "2.jpg", "8-2.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "21.jpg", "22.jpg", "25.jpg", "26.jpg", "27.jpg", "28.jpg"].map(function (imageName) {
    return "../assets/images/projects/project5/detail/" + imageName + "?v=1";
});

const project5Description = [
    "Scene of Sense is developed as an architectural proposal rooted in atmosphere, spatial sequence, and material restraint.",
    "The project begins with a close reading of movement, pause, and the emotional rhythm produced between enclosure and openness."
];

const project5FullDescription = "Rather than treating form as a singular object, the project is organized as a series of linked moments, where threshold, proportion, light, and visual compression gradually shape the experience of the whole. The intention is to create a setting that feels measured and quiet, while still carrying emotional depth through contrast, texture, and pacing.\n\nAcross the proposal, surfaces are edited carefully so that each junction, opening, and transition contributes to a more continuous architectural narrative. Light is used not only to illuminate the space, but also to structure attention, soften boundaries, and clarify the hierarchy between public and intimate zones.\n\nMaterial choices are imagined as part of the same composition, allowing weight, reflection, shadow, and tactile presence to work together instead of competing for emphasis. In this way, Scene of Sense becomes less a static formal statement and more a carefully paced environment, where each movement reveals another layer of spatial character, visual stillness, and lived atmosphere over time.";

const project6GalleryImages = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "5-1.jpg", "6.jpg", "6-1.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg", "21.jpg", "22.jpg", "23.jpg", "24.jpg", "25.jpg", "26.jpg", "27.jpg", "28.jpg", "29.jpg"].map(function (imageName) {
    return "../assets/images/projects/project6/gallery/" + imageName + "?v=1";
});

const project6DetailImages = ["1.jpg", "2.jpg", "5.jpg", "5-1.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg", "24.jpg", "25.jpg", "27.jpg", "28.jpg", "29.jpg"].map(function (imageName) {
    return "../assets/images/projects/project6/detail/" + imageName + "?v=1";
});

const project6FullDescription = "The proposal examines how architecture can support an interdisciplinary research environment where technological experimentation, human-centered design, and biomedical innovation are brought into closer relationship. Rather than treating laboratories as isolated technical rooms, the project considers them as active spaces for exchange, observation, collaboration, and shared discovery.\n\nDifferent research activities require different degrees of openness, privacy, flexibility, and technical control, so the spatial organization responds to changing forms of scientific work. Laboratory spaces, collaborative learning areas, circulation, and shared public zones are arranged to encourage both focused research and informal interdisciplinary interaction.\n\nThrough this approach, the project rethinks the conventional laboratory typology as a more adaptive and communicative architectural framework. The lab becomes not only a place for scientific production, but also a spatial interface between emerging technology, design thinking, education, and contemporary social challenges.";

const project6Description = [
    "This campus proposal, derived from a previous design, explores the integration of interaction design and biomedical engineering.",
    "It focuses on spatial innovation, conceptual transformation, and laboratory scales that respond to evolving societal needs."
];

window.MINEPORT_PROJECT_DETAIL_DATA = [
    createProjectDetail("Double Interaction", "Campus workshop", "Education", "Architecture", "2024 Summer", project1Description, "../assets/images/projects/project1/card/project1.jpg", project1DetailImages, project1GalleryImages, project1FullDescription),
    createProjectDetail("Euphoria", "Senior Center", "Residential", "Architecture", "2023 Fall", ["Located in Toad Mountain, Taipei, this Senior Center uses dispersed volumes for resting, rehabilitation, social interaction, and reading, giving elderly users a freer and gentler daily rhythm."], "../assets/images/projects/project2/card/project2.jpg", ["1.jpg", "2-3.jpg", "2-4.jpg", "2-5.jpg", "2-6.png", "3.jpg", "4.jpg", "5.jpg", "5-1.jpg", "12.png", "13.png"].map(function (imageName) {
        return "../assets/images/projects/project2/detail/" + imageName + "?v=3";
    }), ["1.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.png", "12.png", "13.png", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.png", "21.jpg"].map(function (imageName) {
        return "../assets/images/projects/project2/gallery/" + imageName + "?v=11";
    }), "Following the slope and existing vegetation, the architecture creates a softer boundary between built space and landscape. Semi-outdoor corridors, courtyards, and shaded transitional areas allow movement to become part of the daily experience, giving users access to air, light, and greenery without relying on a single central hall.\n\nThe project emphasizes familiarity and legibility through variations in scale, openings, and materiality, helping residents recognize and navigate each area with ease. Communal spaces are balanced with quiet corners, supporting both social connection and moments of personal rest.\n\nUltimately, the senior center is imagined as a living community integrated with nature and everyday routines. Aging is treated not as a condition of isolation, but as a continuous experience supported by movement, care, and a gentle relationship with the surrounding environment."),
    createProjectDetail("Light, Stone, Hope", "Church", "Religious", "Architecture", "2024 Fall", project3Description, "../assets/images/projects/project3/card/project3.jpg", project3DetailImages, project3GalleryImages, project3FullDescription),
    createProjectDetail("Stone Horizon House", "Los Angeles, USA", "Residential", "Architecture", "2024 Spring", ["A residential concept framed by long horizons, low silhouettes, and a measured relationship between land and enclosure.", "The project explores how stillness can be expressed through geometry, light, and carefully edited material transitions."], "../assets/images/projects/project4/card/project4.jpg"),
    createProjectDetail("Scene of Sense", "Children's Theater", "Culture", "Architecture", "2023 Winter", project5Description, "../assets/images/projects/project5/card/project5.jpg", project5DetailImages, project5GalleryImages, project5FullDescription),
    createProjectDetail("Meditouch", "Interdisciplinary Lab", "Education", "Architecture", "2025 Summer", project6Description, "../assets/images/projects/project6/card/project6.jpg", project6DetailImages, project6GalleryImages, project6FullDescription),
    createProjectDetail("Kitchenless", "COLLECTIVE HOUSING", "Residential", "Architecture", "2024 Winter", ["This kitchenless social housing concept optimizes space and cost while encouraging community through shared kitchens.", "It responds to food delivery, meal services, and sustainability trends with a more affordable, resource-efficient model for urban living."], "../assets/images/projects/project7/card/project7.jpg", [1, 6, 7, 9, 10, 11, 12, 14, 18].map(function (imageNumber) {
        return "../assets/images/projects/project7/detail/" + imageNumber + ".jpg?v=1";
    }), ["1.jpg", "1-1.jpg", "1-2.jpg", "1-3.jpg", "1-4.jpg", "2.jpg", "3.jpg", "4.jpg", "4-1.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "11-1.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "16-1.jpg", "17.jpg", "18.jpg", "18-2.jpg", "18-3.jpg", "18-4.jpg", "19.jpg", "20.jpg"].map(function (imageName) {
        return "../assets/images/projects/project7/gallery/" + imageName + "?v=4";
    }), "Cooking is reimagined as a collective routine that can produce social contact as well as daily support. Shared food spaces become places where residents meet, exchange help, and build small rituals of community, while the private units remain compact, efficient, and easier to maintain.\n\nThe proposal also responds to changing urban habits, where delivery services, prepared meals, and shared facilities alter the role of the domestic kitchen. Instead of duplicating the same infrastructure in every unit, resources are concentrated into communal areas that can serve more people with greater flexibility.\n\nIn this model, housing becomes more than a collection of rooms. It operates as a resource-conscious living system that reduces cost, limits redundancy, and creates stronger social ties through the shared use of space."),
    createProjectDetail("Stone Horizon House", "Los Angeles, USA", "Culture", "Architecture", "2025 Fall", ["A visual narrative built from fragments of landscape, form, and silhouette rather than a single fixed object.", "The imagery focuses on atmosphere, contrast, and the emotional pacing of each frame."], "../assets/images/projects/project8/card/project8.jpg"),
    createProjectDetail("Stone Horizon House", "Los Angeles, USA", "Culture", "Architecture", "2026 Summer", ["A design exercise in compositional order, highlighting how proportion and alignment can carry visual clarity.", "Small shifts in edge, rhythm, and material tone shape the overall reading of the space."], "../assets/images/projects/project9/card/project9.jpg"),
    createProjectDetail("Stone Horizon House", "Los Angeles, USA", "Residential", "Architecture", "2020-2024", ["An updated architectural proposal that refines the dialogue between envelope, light, and circulation.", "The project privileges spatial atmosphere over statement, allowing experience to unfold gradually."], "../assets/images/projects/project4/card/project4.jpg"),
    createProjectDetail("Stone Horizon House", "Los Angeles, USA", "Education", "Design", "2019-2026", ["A spatial design proposal centered on editing, restraint, and the visual weight of each surface condition.", "The composition seeks balance between tactile intimacy and overall formal control."], "../assets/images/projects/project5/card/project5.jpg", project5DetailImages, project5GalleryImages),
    createProjectDetail("Meditouch", "Interdisciplinary Lab", "Religious", "Architecture", "2018-2022", project6Description, "../assets/images/projects/project6/card/project6.jpg", project6DetailImages, project6GalleryImages, project6FullDescription)
];
