# EduPath AI 🎓

**AI-powered college project idea generator and roadmap planner**

A modern web application that helps students generate tailored academic project ideas with detailed execution roadmaps using Google's Gemini AI.

---

## Features ✨

- **AI-Generated Project Ideas** - Get 3 original, industry-relevant project suggestions
- **Detailed Roadmaps** - Week-by-week execution plans with tasks and milestones
- **7 Engineering Branches** - CSE, ECE, EEE, MECH, CIVIL, CHEM, METAL
- **Tech Stack Recommendations** - Curated technology suggestions for each project
- **Export Roadmaps** - Download individual project roadmaps as PDF
- **Modern UI/UX** - Clean, academic-tech design with smooth animations

---

## Quick Start 🚀

1. **Open the application**
   ```bash
   # Option 1: Use Python's built-in server
   python3 -m http.server 8080
   
   # Option 2: Use Node.js http-server
   npx http-server -p 8080
   
   # Option 3: Open index.html directly in browser
   open index.html
   ```

2. **Configure API Key**
   - Open `app.js`
   - Replace `YOUR_GEMINI_API_KEY` with your actual Gemini API key
   - Get a free key at: https://makersuite.google.com/app/apikey

3. **Use the application**
   - Select your engineering branch
   - Choose year of study
   - Enter your interests/domain
   - Set project duration
   - Generate AI roadmaps!

---

## File Structure 📁

```
edupath-ai/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── app.js          # JavaScript logic and API calls
└── README.md       # This file
```

---

## Technology Stack 💻

- **Frontend**: Pure HTML, CSS, JavaScript (Vanilla)
- **AI**: Google Gemini API
- **Styling**: Custom CSS with modern animations
- **No frameworks** - Lightweight and fast!

---

## Configuration ⚙️

### API Key Setup

Edit `app.js` and update the API key:

```javascript
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
```

### Customization

- **Colors**: Modify CSS variables in `styles.css`
- **AI Prompt**: Edit the prompt in `app.js` → `generateProjects()`
- **Duration Range**: Update the slider in `index.html`

---

## Features in Detail 📋

### 1. Smart Project Generation
- Uses Gemini AI to generate original project ideas
- Tailored to your branch, year, and interests
- Industry-relevant and academically appropriate

### 2. Detailed Roadmaps
- Week-by-week breakdown
- Clear task descriptions
- Icon-based timeline visualization

### 3. Export Functionality
- Export individual roadmaps
- Print-ready format
- Clean PDF output

### 4. Modern UX
- App-like screen transitions
- Smooth animations
- Responsive design
- Loading states with progress messages

---

## Browser Support 🌐

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with ES6+ support

---

## API Rate Limits ⚠️

Google Gemini API free tier:
- 60 requests per minute
- Daily quota limits apply

For production use, consider implementing:
- Rate limiting
- Error handling
- Caching responses

---

## Future Enhancements 💡

- [ ] Dark mode toggle
- [ ] Save favorite projects
- [ ] Share roadmaps via link
- [ ] Project filtering by tech stack
- [ ] User accounts and history
- [ ] AI-generated project images
- [ ] PDF export with custom branding

---

## License 📄

MIT License - Feel free to use and modify for your needs!

---

## Credits 👏

Built with ❤️ for students struggling with project ideas

**Technologies:**
- Google Gemini AI
- Vanilla JavaScript
- Modern CSS3

---

## Support 🤝

For issues or questions:
1. Check API key configuration
2. Verify internet connection
3. Check browser console for errors
4. Ensure Gemini API quota is available

---

**Happy Project Planning! 🎉**
