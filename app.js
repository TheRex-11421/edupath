// EduPath AI - JavaScript Logic and AI Integration

// Configuration - Replace with your actual Google Gemini API key
const GEMINI_API_KEY = 'AIzaSyC6YufwSV1TnYCw--8ofNwolGrQ5-v4dvc'; // Configured with user's API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

// DOM Elements
const projectForm = document.getElementById('projectForm');
const durationSlider = document.getElementById('duration');
const durationValue = document.getElementById('durationValue');
const loadingOverlay = document.getElementById('loadingOverlay');
const resultsSection = document.getElementById('results');
const resultsContainer = document.getElementById('resultsContainer');

// Screen elements
const homeScreen = document.getElementById('home');
const parametersScreen = document.getElementById('parameters');
const howItWorksScreen = document.getElementById('how-it-works'); // Fixed: was 'howItWorks'
const resultsScreen = document.getElementById('results');

// App State Management - Single screen at a time
let currentScreen = 'home';

function showScreen(screenName) {
    // Hide all screens
    homeScreen.style.display = 'none';
    parametersScreen.style.display = 'none';
    howItWorksScreen.style.display = 'none';
    resultsScreen.style.display = 'none';

    // Show requested screen
    currentScreen = screenName;
    switch (screenName) {
        case 'home':
            homeScreen.style.display = 'block';
            break;
        case 'parameters':
            parametersScreen.style.display = 'block';
            break;
        case 'howItWorks':
            howItWorksScreen.style.display = 'block';
            break;
        case 'results':
            resultsScreen.style.display = 'block';
            break;
        case 'roadmap-detail':
            const roadmapDetailScreen = document.getElementById('roadmap-detail');
            roadmapDetailScreen.style.display = 'block';
            break;
    }

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'instant' });
}

// Update duration value display
durationSlider.addEventListener('input', (e) => {
    durationValue.textContent = e.target.value;
});

// Initialize app - show home screen only
document.addEventListener('DOMContentLoaded', () => {
    showScreen('home');
});

// Form submission handler - IMPROVED
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect form data
    const formData = {
        branch: document.getElementById('branch').value,
        year: document.getElementById('year').value,
        interest: document.getElementById('interest').value,
        duration: document.getElementById('duration').value
    };

    // Validate form
    if (!formData.branch || !formData.year || !formData.interest) {
        alert('Please fill in all required fields');
        return;
    }

    // Disable form to prevent multiple submissions
    const submitButton = projectForm.querySelector('.btn-generate');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Generating...';
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';

    // Show loading overlay with animated status
    loadingOverlay.classList.add('active');
    const loadingText = document.getElementById('loadingText');

    // Cycle through loading messages
    const loadingMessages = [
        'Analyzing your inputs...',
        'Generating tailored projects...',
        'Finalizing roadmaps...'
    ];
    let messageIndex = 0;
    loadingText.textContent = loadingMessages[0];

    const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        loadingText.textContent = loadingMessages[messageIndex];
    }, 2500);

    try {
        // Generate projects using REAL AI (no mock fallback)
        const projects = await generateProjects(formData);

        // Display results
        displayResults(projects);

        // Hide loading and show results screen
        clearInterval(messageInterval);
        loadingOverlay.classList.remove('active');
        showScreen('results');

    } catch (error) {
        console.error('Error generating projects:', error);
        clearInterval(messageInterval);
        loadingOverlay.classList.remove('active');

        // Show detailed error message
        alert(`❌ Error: ${error.message}\n\nPlease try again or check your API key configuration.`);
    } finally {
        // Re-enable form
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
    }
});

// Generate projects using Google Gemini API - ALWAYS USES REAL AI
async function generateProjects(formData) {
    // Check if API key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        throw new Error('Gemini API key is not configured. Please add your API key in app.js');
    }

    // Construct academic prompt for AI
    const prompt = constructPrompt(formData);

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4096,
                }
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        // Parse AI response into structured projects
        return parseAIResponse(aiResponse, formData);

    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error(`Failed to generate projects: ${error.message}. Please check your API key and internet connection.`);
    }
}

// Construct structured academic prompt - DEMANDS ORIGINAL IDEAS ONLY
function constructPrompt(formData) {
    return `
You are an expert academic advisor for ${formData.branch} engineering students.

CRITICAL RULES (NON-NEGOTIABLE):
- DO NOT reuse common academic project ideas
- DO NOT generate chatbots, recommendation systems, CRUD apps, or dashboards
- DO NOT use generic phrases like "smart system", "AI-based solution", or "automation tool"

TASK:
Generate EXACTLY 3 ORIGINAL, INDUSTRY-RELEVANT project ideas.

INPUT CONSTRAINTS:
- Branch: ${formData.branch}
- Year: ${formData.year}
- Core Interest Area: "${formData.interest}"
- Project Duration: ${formData.duration} weeks

DIVERSITY REQUIREMENTS:
- Each project MUST solve a DIFFERENT real-world problem
- Each project MUST use a DIFFERENT technical approach
- Each project MUST target a DIFFERENT application domain
- Ideas must be realistic for a student project, not research papers

OUTPUT FORMAT (STRICT — DO NOT DEVIATE):
Return ONLY valid JSON. No markdown code blocks, no backticks, just pure JSON:

{
  "projects": [
    {
      "title": "Project Name",
      "description": "Brief 2-sentence description",
      "techStack": ["tech1", "tech2", "tech3", "tech4"],
      "keywords": ["keyword1", "keyword2"],
      "roadmap": [
        {"week": 1, "task": "Short task (max 8 words)", "icon": "📊"},
        {"week": 2, "task": "Short task (max 8 words)", "icon": "🤖"}
      ]
    }
  ]
}

CRITICAL FORMATTING RULES:
- Return PURE JSON (no \`\`\`json wrapper)
- Exactly 3 projects in the array
- Exactly ${formData.duration} roadmap items per project
- Each task description: MAX 8 words (be concise!)
- Use emojis: 📊 🤖 🔧 ⚙️ 🔌 ☁️ 🔗 🧪 📋 🎯 💡 🚀
- Tech stack: specific tools only (e.g., "TensorFlow", not "AI")

Generate ORIGINAL content only.
`;
}

// Parse AI response - STRICT VALIDATION
function parseAIResponse(aiResponse, formData) {
    try {
        // Clean response - remove markdown code blocks if present
        let cleanedResponse = aiResponse.trim();
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');

        // Extract JSON
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in AI response');
        }

        const parsed = JSON.parse(jsonMatch[0]);

        // Validate structure
        if (!parsed.projects || !Array.isArray(parsed.projects)) {
            throw new Error('Invalid response structure: missing projects array');
        }

        // Validate each project
        const validProjects = parsed.projects.filter(p =>
            p.title &&
            p.description &&
            Array.isArray(p.techStack) && p.techStack.length > 0 &&
            Array.isArray(p.roadmap) && p.roadmap.length > 0
        ).slice(0, 3);

        if (validProjects.length === 0) {
            throw new Error('No valid projects found in AI response');
        }

        // Add gradient colors for visual variety
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        ];

        return validProjects.map((project, index) => {
            // Generate dynamic image URL from keywords or interest
            const keywords = project.keywords || [formData.interest.toLowerCase().replace(/\s+/g, '-'), 'technology'];
            const imageQuery = keywords.join(',');
            const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(imageQuery)}`;

            return {
                ...project,
                imageGradient: gradients[index % gradients.length],
                imageUrl: imageUrl
            };
        });

    } catch (error) {
        console.error('Parsing error:', error);
        throw new Error(`Failed to parse AI response: ${error.message}`);
    }
}

// Generate mock project data (fallback)
function generateMockProjects(formData) {
    const projectTemplates = {
        'CSE': [
            {
                title: 'AI-Powered Campus Navigator',
                description: 'A mobile application that uses machine learning to provide real-time indoor navigation for the college campus based on user location and schedules.',
                techStack: ['Python', 'TensorFlow', 'React Native'],
                imageGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            },
            {
                title: 'IoT Dorm Energy Tracker',
                description: 'A smart monitoring system that uses IoT sensors to track and analyze energy consumption in student dormitories.',
                techStack: ['NodeJS', 'Arduino', 'React'],
                imageGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            },
            {
                title: 'Blockchain Student ID',
                description: 'A decentralized identity management system for verifiable student credentials using smart contracts.',
                techStack: ['Solidity', 'Ethereum', 'Web3.js'],
                imageGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            }
        ],
        'ECE': [
            {
                title: 'Smart Traffic Light System',
                description: 'An adaptive traffic control system using sensors and microcontrollers to optimize traffic flow based on real-time vehicle density.',
                techStack: ['Arduino', 'Python', 'IoT Sensors'],
                imageGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
            },
            {
                title: 'Voice-Controlled Home Automation',
                description: 'A wireless home automation system controlled via voice commands using speech recognition and IoT protocols.',
                techStack: ['Raspberry Pi', 'MQTT', 'Python'],
                imageGradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
            },
            {
                title: 'RFID Attendance System',
                description: 'An automated attendance tracking system using RFID technology with cloud database integration.',
                techStack: ['RFID', 'NodeMCU', 'Firebase'],
                imageGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
            }
        ],
        'EEE': [
            {
                title: 'Solar Power Optimization',
                description: 'A smart system to maximize solar panel efficiency through automatic sun-tracking and power management.',
                techStack: ['Arduino', 'MATLAB', 'Sensors'],
                imageGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
            },
            {
                title: 'Smart Grid Monitoring',
                description: 'A real-time power grid monitoring system with fault detection and load balancing capabilities.',
                techStack: ['PLC', 'SCADA', 'Python'],
                imageGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
            },
            {
                title: 'Wireless Power Transmission',
                description: 'An experimental setup demonstrating wireless electricity transfer using resonant inductive coupling principles.',
                techStack: ['Coil Design', 'Circuit Analysis', 'Oscilloscope'],
                imageGradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
            }
        ],
        'MECH': [
            {
                title: 'Autonomous Line-Following Robot',
                description: 'A self-navigating robot that follows predefined paths using sensors and motor control algorithms.',
                techStack: ['Arduino', 'IR Sensors', 'Motor Drivers'],
                imageGradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)'
            },
            {
                title: '3D-Printed Prosthetic Arm',
                description: 'Design and fabrication of a cost-effective prosthetic arm using 3D printing technology.',
                techStack: ['CAD', '3D Printing', 'Servo Motors'],
                imageGradient: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)'
            },
            {
                title: 'Solar Water Heater System',
                description: 'An efficient solar thermal system for water heating with automatic temperature control.',
                techStack: ['Thermodynamics', 'Arduino', 'Temp Sensors'],
                imageGradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
            }
        ]
    };

    // Select projects based on branch
    let selectedProjects = projectTemplates[formData.branch] || projectTemplates['CSE'];

    // Generate roadmap based on duration
    const duration = parseInt(formData.duration);

    return selectedProjects.map(project => ({
        ...project,
        roadmap: generateRoadmap(duration, project.title)
    }));
}

// Generate week-wise roadmap
function generateRoadmap(weeks, projectTitle) {
    const roadmapTemplates = [
        { task: 'Research & Dataset Collection', icon: '📊' },
        { task: 'Model Training & API Development', icon: '🤖' },
        { task: 'Frontend Integration & Testing', icon: '🔧' },
        { task: 'Hardware Prototyping', icon: '⚙️' },
        { task: 'Circuit Design & Setup', icon: '🔌' },
        { task: 'Cloud Dashboard Setup', icon: '☁️' },
        { task: 'System Integration', icon: '🔗' },
        { task: 'Testing & Debugging', icon: '🧪' },
        { task: 'Documentation & Deployment', icon: '📋' },
        { task: 'Final Presentation Prep', icon: '🎯' }
    ];

    const roadmap = [];
    const tasksPerWeek = Math.ceil(roadmapTemplates.length / weeks);

    for (let week = 1; week <= weeks; week++) {
        const taskIndex = Math.min(week - 1, roadmapTemplates.length - 1);
        const template = roadmapTemplates[taskIndex];

        roadmap.push({
            week: week,
            task: template.task,
            icon: template.icon
        });
    }

    return roadmap;
}

// Display results in the results section
// Store projects globally for roadmap viewing
let currentProjects = [];

// Display results and store projects
function displayResults(projects) {
    currentProjects = projects; // Store for later use
    resultsContainer.innerHTML = '';

    projects.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        resultsContainer.appendChild(projectCard);
    });
}

// Create individual project card
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const gradient = `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`;

    card.innerHTML = `
        <div class="project-image" style="background: ${gradient}"></div>
        <div class="project-content">
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                <span class="bookmark-icon">🔖</span>
            </div>
            
            <div class="project-tags">
                ${project.techStack.map(tech => `<span class="tag">${tech}</span>`).join('')}
            </div>
            
            <p class="project-description">${project.description}</p>
            
            <button class="roadmap-toggle" onclick="viewFullRoadmap(${index})">
                📋 View Full Roadmap
            </button>
        </div>
    `;

    return card;
}

// View full roadmap in dedicated screen
function viewFullRoadmap(index) {
    const project = currentProjects[index];
    const roadmapDetailContent = document.getElementById('roadmapDetailContent');

    roadmapDetailContent.innerHTML = `
        <div class="roadmap-detail-header">
            <h2 class="roadmap-detail-title">${project.title}</h2>
            
            <div class="project-tags roadmap-detail-tags">
                ${project.techStack.map(tech => `<span class="tag">${tech}</span>`).join('')}
            </div>
            
            <p class="roadmap-detail-description">${project.description}</p>
        </div>
        
        <h3 class="roadmap-detail-section-title">📅 Project Timeline</h3>
        
        <div class="roadmap-timeline">
            ${project.roadmap.map(week => `
                <div class="timeline-item">
                    <div class="timeline-icon">${week.icon || '📌'}</div>
                    <div class="timeline-content">
                        <div class="timeline-week">Week ${week.week}</div>
                        <div class="timeline-task">${week.task}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Store current project index for export
    window.currentRoadmapIndex = index;

    showScreen('roadmap-detail');
}

// Export current roadmap
function exportRoadmap() {
    const project = currentProjects[window.currentRoadmapIndex];

    // Create printable HTML content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${project.title} - Project Roadmap</title>
            <style>
                body {
                    font-family: 'Inter', -apple-system, sans-serif;
                    max-width: 800px;
                    margin: 40px auto;
                    padding: 20px;
                    color: #0f172a;
                }
                h1 {
                    color: #1e40af;
                    border-bottom: 3px solid #1e40af;
                    padding-bottom: 10px;
                }
                .tech-stack {
                    margin: 20px 0;
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .tech {
                    background: #dbeafe;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #1e40af;
                }
                .description {
                    margin: 20px 0;
                    line-height: 1.6;
                    font-size: 16px;
                }
                .timeline {
                    margin-top: 30px;
                }
                .week {
                    margin: 20px 0;
                    padding: 15px;
                    border-left: 4px solid #1e40af;
                    background: #f8fafc;
                }
                .week-number {
                    font-weight: 700;
                    color: #1e40af;
                    text-transform: uppercase;
                    font-size: 12px;
                }
                .week-task {
                    margin-top: 8px;
                    font-size: 16px;
                }
                @media print {
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>
            <h1>${project.title}</h1>
            
            <div class="tech-stack">
                ${project.techStack.map(tech => `<span class="tech">${tech}</span>`).join('')}
            </div>
            
            <div class="description">
                <strong>Project Description:</strong><br>
                ${project.description}
            </div>
            
            <div class="timeline">
                <h2>Project Timeline</h2>
                ${project.roadmap.map(week => `
                    <div class="week">
                        <div class="week-number">Week ${week.week}</div>
                        <div class="week-task">${week.task}</div>
                    </div>
                `).join('')}
            </div>
            
            <p style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 14px;">
                Generated by EduPath AI
            </p>
        </body>
        </html>
    `);

    printWindow.document.close();

    // Trigger print dialog after a short delay
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('EduPath AI initialized');
    console.log('To use AI generation, add your Google Gemini API key in app.js');
});
