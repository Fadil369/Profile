# Elfadil's Portfolio Setup Guide

This portfolio showcases Dr. Mohamed El Fadil's work in Healthcare AI, built using the al-folio Jekyll theme with custom BrainSAIT branding.

## 🎨 Design Features

### BrainSAIT Color Scheme

The portfolio uses a professional healthcare AI color palette:

- **Primary Blue** (#114AB1): Trust & Intelligence
- **Teal Blue** (#6793AC): Innovation
- **Orange** (#FF6B01): Energy & Action
- **Gold** (#ECC232): Excellence
- **Light Blue** (#B3DEEF): Clarity

### Visual Effects

- **Glassmorphism**: Frosted glass effect on cards and navigation
- **Mesh Gradient**: Dynamic multi-color gradient background
- **Smooth Animations**: Hover effects and transitions throughout

## 🚀 Local Development

### Prerequisites

- Docker and Docker Compose
- Git

### Running Locally with Docker

1. **Clone the repository**

   ```bash
   git clone https://github.com/Fadil369/Profile.git
   cd Profile
   ```

2. **Start the development server**

   ```bash
   docker compose up
   ```

3. **Access the site**

   - Open http://localhost:8080 in your browser
   - Live reload is enabled - changes will reflect automatically

4. **Stop the server**
   ```bash
   docker compose down
   ```

### Using Docker Slim (Faster)

For faster builds without optional features:

```bash
docker compose -f docker-compose-slim.yml up
```

## 📦 Project Structure

```
Profile/
├── _config.yml              # Main site configuration
├── _data/
│   ├── projects.yml         # Project data
│   ├── skills.yml           # Technical skills
│   ├── cv.yml              # CV/Resume content
│   ├── repositories.yml     # GitHub repos to display
│   └── socials.yml         # Social media links
├── _pages/
│   ├── about.md            # Home/About page
│   ├── projects.md         # Projects listing
│   ├── cv.md               # CV page
│   └── repositories.md     # GitHub repos page
├── _projects/              # Individual project pages
│   ├── 1_project.md        # BrainSAIT Healthcare AI
│   ├── 2_project.md        # LINC Agent
│   ├── 3_project.md        # Neural Cloud Portal
│   └── 4_project.md        # PyHeart & PyBrain
├── _sass/
│   └── _custom.scss        # BrainSAIT custom styles
└── assets/
    └── css/
        └── main.scss       # Main stylesheet (imports custom)
```

## 🎯 Content Management

### Adding a New Project

1. **Create project data** in `_data/projects.yml`:

   ```yaml
   - name: Project Name
     description: Brief description
     technologies:
       - Tech 1
       - Tech 2
     features:
       - Feature 1
       - Feature 2
     github: https://github.com/username/repo
     status: Active
     year: 2024
   ```

2. **Create project page** in `_projects/`:

   ```markdown
   ---
   layout: page
   title: Project Name
   description: Short description
   img: assets/img/image.jpg
   importance: 1
   category: healthcare
   github: https://github.com/username/repo
   ---

   ## Project details here
   ```

### Updating Skills

Edit `_data/skills.yml`:

```yaml
categories:
  - name: Category Name
    skills:
      - name: Skill Name
        level: Expert
```

### Modifying Personal Information

1. **Basic Info**: Edit `_config.yml`

   - Name, title, description
   - URL and baseurl
   - Contact information

2. **CV/Resume**: Edit `_data/cv.yml`

   - Experience
   - Education
   - Awards

3. **Social Links**: Edit `_data/socials.yml`
   - GitHub, LinkedIn, email
   - Custom social links

## 🌐 Deployment

### Automatic Deployment (GitHub Pages)

The portfolio automatically deploys when you push to the `main` or `master` branch.

1. **Ensure GitHub Pages is enabled** in repository settings:

   - Go to Settings > Pages
   - Source: GitHub Actions
   - The deploy.yml workflow will handle the build

2. **Push changes**:

   ```bash
   git add .
   git commit -m "Update portfolio"
   git push origin main
   ```

3. **Access your site**:
   - Default URL: `https://fadil369.github.io/Profile/`
   - Custom domain: Configure in repository settings

### Custom Domain Setup

1. **Add CNAME file** to the root:

   ```bash
   echo "yourdomain.com" > CNAME
   ```

2. **Configure DNS** at your domain provider:

   - Add A records pointing to GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Or add CNAME record: `fadil369.github.io`

3. **Update \_config.yml**:

   ```yaml
   url: https://yourdomain.com
   baseurl: ""
   ```

4. **Enable HTTPS** in GitHub Pages settings

## 🎨 Customizing the Design

### Changing Colors

Edit `_sass/_custom.scss` to modify the color scheme:

```scss
$brainsait-primary: #114ab1; // Your primary color
$brainsait-secondary: #6793ac; // Your secondary color
$brainsait-accent: #ff6b01; // Accent color
```

### Modifying Glassmorphism Effect

Adjust the glassmorphism mixin in `_sass/_custom.scss`:

```scss
@mixin glassmorphism {
  background: rgba(255, 255, 255, 0.1); // Transparency
  backdrop-filter: blur(10px); // Blur amount
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Changing Mesh Gradient

Modify the mesh gradient in `_sass/_custom.scss`:

```scss
body::before {
  opacity: 0.05; // Adjust visibility
  background: radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.1) 0px, transparent 50%);
  // Add or remove gradients...
}
```

## 🔧 Maintenance

### Updating Dependencies

1. **Update Docker image**:

   ```yaml
   # In docker-compose.yml
   image: amirpourmand/al-folio:v0.14.7 # Update version
   ```

2. **Update Ruby gems**:

   ```bash
   docker compose run jekyll bundle update
   ```

3. **Rebuild**:
   ```bash
   docker compose build --no-cache
   ```

### Troubleshooting

**Problem**: Site not building

- Check GitHub Actions logs in the Actions tab
- Ensure all YAML files are valid
- Verify all image paths exist

**Problem**: Styles not applying

- Clear browser cache
- Check `assets/css/main.scss` imports `_custom`
- Verify SCSS syntax in custom files

**Problem**: Docker container fails

- Check Docker logs: `docker compose logs`
- Ensure ports 8080 and 35729 are available
- Try rebuilding: `docker compose build --no-cache`

## 📚 Resources

- [al-folio Documentation](https://github.com/alshedivat/al-folio)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [BrainSAIT Website](https://www.brainsait.io)

## 📝 License

This portfolio is built on the [al-folio](https://github.com/alshedivat/al-folio) theme, which is licensed under MIT.

## 🤝 Contributing

This is a personal portfolio, but suggestions for improvements are welcome! Feel free to:

- Open an issue for bugs or suggestions
- Submit a pull request for improvements
- Share your own al-folio customizations

---

**Built with ❤️ using Jekyll and al-folio**
