// Project data that will be used by both index.html and projects.html
// Categories are Machine-Learning , Deep-Learning , NLP , Computer-Vision , Web-Apps
const projectsData = [
    {
        id: 1,
        title: "Breast Cancer Prediction",
        description: "A Flask-based web application for predicting breast cancer (benign or malignant) using a trained machine learning model. Users input clinical features (e.g., clump thickness, cell size) through a responsive HTML interface. The model, trained on the Wisconsin Breast Cancer Dataset using scikit-learn Logistic Regression, delivers accurate real-time predictions.",
        image: "../static/images/projects/project1.webp",
        categories: ["machine-learning", "web-app"],
        tags: [
            { icon: "fab fa-python", name: "Python" },
            { icon: "fas fa-flask", name: "Flask" },
            { icon: "fas fa-chart-bar", name: "Machine Learning" },
            { icon: "fas fa-database", name: "Scikit-learn" },
            { icon: "fas fa-heartbeat", name: "Breast Cancer Prediction" }
        ],
        liveUrl: "https://breast-cancer-prediction-with-logistic.onrender.com/", // Live URL available
        githubUrl: "https://github.com/ShubhamAIML/Breast-Cancer-Prediction-with-Logistic-Regression",
        featured: true
    },
    {
        id: 2,
        title: "AI Symptom Checker",
        description: "Developed a machine learning-based web application that predicts possible diseases based on user-input symptoms. Utilized classification algorithms to provide fast and accurate predictions.",
        image: "../static/images/projects/project2.webp",
        categories: ["machine-learning", "web-app"],
        tags: [
            { icon: "fas fa-stethoscope", name: "Healthcare" },
            { icon: "fas fa-brain", name: "Machine Learning" },
            { icon: "fas fa-flask", name: "Flask" },
            { icon: "fas fa-laptop-medical", name: "Symptom Prediction" }
        ],
        liveUrl: "https://ai-symptom-checker-mji4.onrender.com/",
        githubUrl: "https://github.com/ShubhamAIML/AI-Symptom-Checker",
        featured: true
    },
    {
        id: 3,
        title: "Heart Disease Prediction",
        description: "A Flask-based machine learning web application that predicts the risk of heart disease using clinical parameters such as age, blood pressure, cholesterol levels, and more. Aims to support early diagnosis and medical awareness.",
        image: "../static/images/projects/project3.webp",
        categories: ["machine-learning", "web-app"],
        tags: [
            { icon: "fas fa-heartbeat", name: "Heart Disease" },
            { icon: "fas fa-brain", name: "Machine Learning" },
            { icon: "fas fa-flask", name: "Flask" },
            { icon: "fas fa-notes-medical", name: "Health Analytics" }
        ],
        liveUrl: "https://heart-disease-prediction-ujuq.onrender.com/", // Live URL available
        githubUrl: "https://github.com/ShubhamAIML/Heart-Disease-Prediction",
        featured: true
    },
    {
        id: 4,
        title: "Learning Portal",
        description: "A Flask-powered educational web platform designed to host and deliver interactive learning content such as tutorials and notes. It supports personalized learning paths and user progress tracking.",
        image: "../static/images/projects/project4.webp",
        categories: ["web-app"],
        tags: [
            { icon: "fas fa-book", name: "Education" },
            { icon: "fas fa-flask", name: "Flask" },
            { icon: "fas fa-chalkboard-teacher", name: "Learning Platform" },
            { icon: "fas fa-graduation-cap", name: "E-Learning" }
        ],
        liveUrl: "https://learning-portal-ol9v.onrender.com/", // Live URL available
        githubUrl: "https://github.com/ShubhamAIML/Learning-Portal",
        featured: true
    },
    {
        id: 5,
        title: "AI Resume Grader",
        description: "An AI-based tool that evaluates resumes, scores them for ATS compatibility, and suggests improvements.",
        image: "../static/images/projects/project5.webp",
        categories: ["Web-Apps", "Machine-Learning"],
        tags: [
            { icon: "fas fa-robot", name: "AI" },
            { icon: "fas fa-file-alt", name: "Resume Analysis" },
            { icon: "fas fa-language", name: "NLP" }
        ],
        liveUrl: "https://ai-resume-grader-3upq.onrender.com/", // No live URL
        githubUrl: "https://github.com/ShubhamAIML/AI-Resume-Grader", // No GitHub URL
        featured: true
    },
    {
        id: 6,
        title: "Recommendation Engine",
        description: "Built a content-based and collaborative filtering recommendation engine for a streaming platform to enhance user experience.",
        image: "../static/images/projects/Temp.webp",
        categories: ["machine-learning", "web-app"],
        tags: [
            { icon: "fas fa-thumbs-up", name: "Recommendation" },
            { icon: "fas fa-cogs", name: "scikit-learn" },
            { icon: "fas fa-flask", name: "Flask" }
        ],
        liveUrl: "", // Live URL available
        githubUrl: "",
        featured: false
    },
    {
        id: 7,
        title: "Fast2Apply",
        description: "An informational website built using WordPress that helps users easily discover and understand various government schemes. It offers simplified scheme details, eligibility guidelines, and step-by-step application processes.",
        image: "../static/images/projects/Project7.webp",
        categories: ["web-app"],
        tags: [
            { icon: "fas fa-university", name: "Govt. Schemes" },
            { icon: "fab fa-wordpress", name: "WordPress" },
            { icon: "fas fa-code", name: "PHP" },
            { icon: "fas fa-magic", name: "Elementor" }, 	
            { icon: "fas fa-palette", name: "UI/UX Design" }
        ],
        liveUrl: "https://fast2apply.com/", // Live URL available
        githubUrl: "", // No GitHub URL
        featured: false
    },
    {
        id: 8,
        title: "Image Classification App",
        description: "Developed a web application that uses deep learning to classify images into various categories with high accuracy and minimal latency.",
        image: "../static/images/projects/Temp.webp",
        categories: ["computer-vision", "web-app"],
        tags: [
            { icon: "fas fa-eye", name: "Computer Vision" },
            { icon: "fas fa-flask", name: "Flask" },
            { icon: "fas fa-fire", name: "PyTorch" }
        ],
        liveUrl: "", // No live URL
        githubUrl: "",
        featured: false
    },
    {
        id: 9,
        title: "Fraud Detection System",
        description: "Implemented a real-time fraud detection system for financial transactions using anomaly detection and ensemble learning techniques.",
        image: "../static/images/projects/Temp.webp",
        categories: ["deep-learning", "machine-learning"],
        tags: [
            { icon: "fas fa-shield-alt", name: "Security" },
            { icon: "fas fa-cogs", name: "Ensemble Learning" },
            { icon: "fas fa-chart-line", name: "Time Series" }
        ],
        liveUrl: "", // Live URL available
        githubUrl: "",
        featured: false
    }
];

// Function to create project card HTML
function createProjectCard(project) {
    const categoriesAttr = project.categories.join(' ');
    const tagsHTML = project.tags.map(tag => 
        `<span class="project-tag"><i class="${tag.icon}"></i> ${tag.name}</span>`
    ).join('');
    
    // Only show Live button if liveUrl exists
    const liveButtonHTML = project.liveUrl ? 
        `<a href="${project.liveUrl}" target="_blank" class="live-link"><span class="live-dot"></span> Live</a>` : '';
    
    // Only show GitHub button if githubUrl exists
    const githubButtonHTML = project.githubUrl ? 
        `<a href="${project.githubUrl}" target="_blank" class="github-link"><i class="fab fa-github"></i> GitHub</a>` : '';
    
    return `
    <div class="project-card" data-category="${categoriesAttr}" data-aos="fade-up" data-aos-duration="1000">
        <div class="project-image">
            <img src="${project.image}" alt="${project.title}" class="project-img">
        </div>
        <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tags">
                ${tagsHTML}
            </div>
            <div class="project-links">
                ${liveButtonHTML}
                ${githubButtonHTML}
            </div>
        </div>
    </div>
    `;
}

