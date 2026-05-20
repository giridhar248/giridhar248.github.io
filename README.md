# Giridhar Reddy Mekapothula — Portfolio

Live: <https://giridhar248.github.io/>

Personal portfolio. Vanilla HTML + Tailwind (Play CDN) + JS modules, no build step. Content in `data/*.json`.

## Local dev

```bash
python3 -m http.server 8000
# or: npx http-server -p 8000 -o
```

Then open <http://localhost:8000>.

## Test

```bash
node --test tests/scroll-progress.test.js tests/github-stats.test.js tests/command-palette.test.js
```

## Structure

```
assets/
  css/styles.css        — base tokens + reduced-motion fallback
  js/main.js            — content loaders + section renderers
  js/lib/*.js           — gradient-mesh, scroll-progress, scroll-reveal, marquee,
                          command-palette, github-stats, copy-email
  images/avatar.jpg     — hero photo
  images/logos/*.svg    — tech logos for the stack marquee
data/                   — JSON content
docs/superpowers/       — design spec + implementation plan
404.html                — custom 404
```

## Customize

Edit JSON in `data/`. No rebuild needed.

---

(Original template README below for reference.)

## 📁 Project Structure

```
portfolio-template/
├── assets/
│   ├── css/
│   │   └── styles.css          # All styling (customizable colors)
│   └── js/
│       └── main.js             # Dynamic content loading
├── data/
│   ├── profile.json            # Basic info & contact
│   ├── experience.json         # Work history
│   ├── skills.json             # Skills by category
│   ├── projects.json           # Project showcase
│   └── education.json          # Education & certifications
├── documents/
│   └── [Your_Resume.pdf]       # Place resume here
├── images/
│   └── projects/               # Project images
├── index.html                  # Main HTML file
├── .gitignore                  # Git ignore rules
└── package.json                # Project metadata
```

## 🚀 Quick Start

### 1. Copy the Template

```bash
cp -r portfolio-template my-portfolio
cd my-portfolio
```

### 2. Update Your Information

Edit the JSON files in the `data/` folder:

#### `data/profile.json`
```json
{
  "profile": {
    "name": "Your Name",
    "title": "Your Title"
  },
  "contact": {
    "email": "you@example.com",
    "githubUsername": "your-username"
  }
}
```

#### `data/experience.json`
Add your work experience with achievements and metrics.

#### `data/skills.json`
Organize your skills into categories with Font Awesome icons.

#### `data/projects.json`
Showcase your projects with descriptions and links.

#### `data/education.json`
Add degrees and certifications.

### 3. Add Your Resume

Place your PDF resume in the `documents/` folder and name it `Your_Name_Resume.pdf`

### 4. Customize Colors (Optional)

Edit `assets/css/styles.css` at the top:

```css
:root {
    --primary-color: #154D57;      /* Your primary color */
    --secondary-color: #B7A08B;    /* Your secondary color */
    --bg-primary: #FEFAF7;         /* Background color */
}
```

### 5. Test Locally

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Visit `http://localhost:8000` in your browser.

## 🌐 Deployment Options

### Option 1: GitHub Pages (Recommended)

1. Create a new repository named `your-username.github.io`
2. Push your code:
   ```bash
   git init
   git add -A
   git commit -m "Initial commit: My portfolio"
   git remote add origin https://github.com/your-username/your-username.github.io.git
   git branch -M main
   git push -u origin main
   ```
3. Enable GitHub Pages in Settings → Pages
4. Your site will be live at `https://your-username.github.io`

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your portfolio folder
3. Done! Your site is live

### Option 3: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

## 🎨 Customization Guide

### Changing Colors

All colors are defined as CSS variables in `assets/css/styles.css`:

```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    --accent-color: #your-color;
    --bg-primary: #your-color;
    /* ... more variables */
}
```

### Adding Sections

The template includes:
- Hero (Introduction)
- About
- Experience (Timeline)
- Skills (Grid)
- Projects (Cards)
- Education & Certifications
- Contact

To add more, edit `index.html` and add corresponding data in JSON files.

### Using Icons

This template uses [Font Awesome](https://fontawesome.com/icons) for icons.

Format: `fas fa-icon-name` (solid) or `fab fa-brand-name` (brands)

Examples:
- `fas fa-code` - Code icon
- `fas fa-users` - Users icon
- `fab fa-github` - GitHub logo
- `fas fa-chart-line` - Chart icon

### Hero Section Highlights

Edit the hero highlights in `index.html`:

```html
<div class="hero-highlights">
    <div class="highlight-item">
        <i class="fas fa-your-icon"></i>
        <span>Your Achievement</span>
    </div>
</div>
```

## 📊 Portfolio Sections Explained

### 1. Hero Section
- Your name and title
- Professional summary (2-3 sentences)
- Key achievement badges
- Call-to-action buttons

### 2. About Section
- Detailed bio
- Achievement statistics
- Professional strengths

### 3. Experience Section
- Timeline-based layout
- Company, title, dates
- Achievements with metrics
- Technologies used

### 4. Skills Section
- Organized by categories
- Icons for visual appeal
- Hover effects

### 5. Projects Section
- Project cards with images
- Tech stack badges
- Links to GitHub/demos

### 6. Education Section
- Degrees and institutions
- Certifications with issuers

### 7. Contact Section
- Contact information
- Contact form (demo)
- Social links

## 🛠️ Updating Content

All content is in JSON files - no HTML editing needed!

1. Edit the appropriate JSON file in `data/`
2. Refresh your browser
3. That's it!

## 📝 Best Practices

### Writing Achievements
✅ **Good:** "Increased user adoption by 18% through UX improvements"
❌ **Bad:** "Worked on improving user experience"

### Project Descriptions
- Focus on impact and results
- Mention technologies used
- Include metrics when possible
- Keep it concise (2-3 sentences)

### Skills Organization
- Group by category (Languages, Frameworks, Tools, etc.)
- Order by proficiency
- Don't overwhelm - quality over quantity

## 🎯 SEO Tips

Update in `index.html`:

```html
<meta name="description" content="Your description">
<meta name="keywords" content="your, keywords">
<title>Your Name | Your Title</title>
```

## 📱 Mobile Optimization

The template is mobile-first and fully responsive:
- Hamburger menu on small screens
- Stacked layouts for cards
- Touch-friendly buttons
- Optimized images

## 🆘 Troubleshooting

### Content Not Loading
- Check that JSON files are valid (use JSONLint.com)
- Ensure file paths are correct
- Check browser console for errors

### Styles Not Applying
- Clear browser cache
- Check CSS file path in `index.html`
- Verify CSS syntax

### Images Not Showing
- Use absolute paths for images
- Check file extensions (.jpg, .png, etc.)
- Ensure images are in the correct folder

## 🤝 Contributing

Found a bug or want to improve the template? Contributions are welcome!

## 📄 License

MIT License - Free to use for personal and commercial projects.

## 💡 Credits

Built with:
- HTML5 & CSS3
- Vanilla JavaScript
- Font Awesome Icons
- Lots of ☕ and 💻

---

**Happy Portfolio Building!** 🚀

For questions or support, create an issue or reach out!
