function createProjectDetail(title, location, typology, category, year, description, image) {
    return {
        title: title,
        location: location,
        typology: typology,
        category: category,
        year: year,
        description: description,
        images: Array(10).fill(image)
    };
}

window.MINEPORT_PROJECT_DETAIL_DATA = [
    createProjectDetail("Double Interaction", "Taipei, Taiwan", "Education", "Architecture", "2024 Summer", ["A spatial study shaped by shifting views, layered circulation, and a quiet exchange between structure and movement.", "The project is conceived as a sequence of measured moments where public openness and intimate pause can coexist."], "../assets/images/projects/project1/card/project1.jpg"),
    createProjectDetail("Euphoria", "Senior Center", "Residential", "Architecture", "2023 Fall", ["An atmospheric proposal focused on warmth, memory, and collective rhythm within a shared interior setting.", "Material contrast and soft transitions are used to create a sense of dignity, comfort, and calm energy."], "../assets/images/projects/project2/card/project2.jpg"),
    createProjectDetail("Light, Stone, Hope", "Taipei, Taiwan", "Religious", "Architecture", "2024 Fall", ["A design composition where light and material weight are balanced to produce a restrained but emotional field.", "The visual language stays minimal while allowing texture, shadow, and proportion to carry the narrative."], "../assets/images/projects/project3/card/project3.jpg"),
    createProjectDetail("Stone Horizon House", "Los Angeles, USA", "Residential", "Architecture", "2024 Spring", ["A residential concept framed by long horizons, low silhouettes, and a measured relationship between land and enclosure.", "The project explores how stillness can be expressed through geometry, light, and carefully edited material transitions."], "../assets/images/projects/project4/card/project4.jpg"),
    createProjectDetail("Stone Horizon House", "Los Angeles, USA", "Culture", "Architecture", "2023 Winter", ["An interior-forward reading of the project that focuses on tactile surfaces, tone, and a disciplined editing of detail.", "Furniture, openings, and circulation are treated as part of one continuous visual composition."], "../assets/images/projects/project5/card/project5.jpg"),
    createProjectDetail("Stone Horizon House", "Los Angeles, USA", "Education", "Architecture", "2025 Summer", ["This version extends the project into a more image-driven exploration of atmosphere and narrative framing.", "The result is less about object and more about mood, pacing, and emotional resonance."], "../assets/images/projects/project6/card/project6.jpg"),
    createProjectDetail("Stone Horizon House", "Los Angeles, USA", "Residential", "Architecture", "2024 Winter", ["A study in structural calm and horizontal emphasis, using massing to build quiet tension against the landscape.", "Its design language moves between solidity and openness without becoming heavy."], "../assets/images/projects/project7/card/project7.jpg"),
    createProjectDetail("Stone Horizon House", "Los Angeles, USA", "Culture", "Architecture", "2025 Fall", ["A visual narrative built from fragments of landscape, form, and silhouette rather than a single fixed object.", "The imagery focuses on atmosphere, contrast, and the emotional pacing of each frame."], "../assets/images/projects/project8/card/project8.jpg"),
    createProjectDetail("Stone Horizon House", "Los Angeles, USA", "Culture", "Architecture", "2026 Summer", ["A design exercise in compositional order, highlighting how proportion and alignment can carry visual clarity.", "Small shifts in edge, rhythm, and material tone shape the overall reading of the space."], "../assets/images/projects/project9/card/project9.jpg"),
    createProjectDetail("Stone Horizon House", "Los Angeles, USA", "Residential", "Architecture", "2020-2024", ["An updated architectural proposal that refines the dialogue between envelope, light, and circulation.", "The project privileges spatial atmosphere over statement, allowing experience to unfold gradually."], "../assets/images/projects/project4/card/project4.jpg"),
    createProjectDetail("Stone Horizon House", "Los Angeles, USA", "Education", "Design", "2019-2026", ["A spatial design proposal centered on editing, restraint, and the visual weight of each surface condition.", "The composition seeks balance between tactile intimacy and overall formal control."], "../assets/images/projects/project5/card/project5.jpg"),
    createProjectDetail("Stone Horizon House", "Los Angeles, USA", "Religious", "Architecture", "2018-2022", ["A project told through image sequences that emphasize mood, tempo, and the relationship between figure and background.", "It turns architecture into an emotional frame rather than a static object."], "../assets/images/projects/project6/card/project6.jpg")
];
