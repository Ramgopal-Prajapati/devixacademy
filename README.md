# DeviX Academy — Technology & AI Training Website

**Tagline:** Learn. Build. Innovate. Lead.

A modular, responsive, high-performance static website built with HTML5, CSS3, ES6+ Vanilla JavaScript, Bootstrap 5, GSAP + ScrollTrigger, Swiper.js, AOS, and Lenis.

---

## Folder Structure

```text
/devix-academy
├── assets/
│   ├── documents/            # Place optional program syllabus PDFs here
│   ├── icons/                # Brand SVG logo mark & favicon
│   ├── images/
│   │   ├── collage/          # Interactive draggable collage images (.webp)
│   │   ├── gallery/          # Events & training masonry gallery (.webp)
│   │   ├── programs/         # Program card artwork (.webp)
│   │   ├── reviews/          # Student review avatars (.webp)
│   │   └── team/             # Lead Trainer portrait (trainer-lead.webp)
│   └── videos/               # Optional local MP4 reels
├── css/
│   ├── animations.css        # Keyframes & prefers-reduced-motion accessibility rules
│   ├── responsive.css        # Breakpoint rules (360px, 390px, 768px, 1024px, 1440px)
│   └── style.css             # Core design system, glassmorphism, timeline & components
├── js/
│   ├── animations.js         # Lenis smooth scroll, neural particle canvas, counters, GSAP
│   ├── config.js             # Central configuration (Web3Forms key, WhatsApp, Email, Address)
│   ├── data.js               # Programs, modules, industries, timeline, mentor, reviews & FAQs
│   ├── forms.js              # Form validation, honeypot spam guard & Web3Forms submission
│   ├── interactions.js       # Draggable collage, Earth/Cosmos canvases, timeline & gallery
│   └── main.js               # Navigation, dropdowns, dynamic rendering & modal logic
├── pages/
│   ├── about.html            # About DeviX Academy, Mission/Vision & Draggable Collage
│   ├── contact.html          # Enquiries, Internship Applications, WhatsApp & FAQs
│   ├── corporate-training.html # Enterprise Tracks, Industry Solutions & Proposal Form
│   ├── privacy-policy.html   # Privacy Policy template
│   ├── programs.html         # Full Filterable Program Directory & Curriculum Modals
│   └── terms.html            # Terms & Conditions template
├── index.html                # Full flagship homepage
├── robots.txt                # Search crawler instructions
├── sitemap.xml               # XML sitemap (update domain before deployment)
└── README.md                 # Setup, configuration & deployment guide
```

---

## How to Run Locally

Because this is a pure HTML/CSS/JavaScript static site, you do not need any bundler or build step. Run it over a local HTTP server (recommended so relative paths and Web3Forms `fetch` requests behave like production):

### Option 1: Python Built-in Server
```bash
cd devix-academy
python -m http.server 8080
```
Open `http://localhost:8080/` in your browser.

### Option 2: Node.js (`npx serve`)
```bash
cd devix-academy
npx serve .
```

### Option 3: VS Code Live Server
Open the `devix-academy` folder in VS Code and click **Go Live**.

---

## How to Configure Web3Forms (Enquiry Emails)

All enquiry, corporate training, and internship forms submit directly to `https://api.web3forms.com/submit`.

1. Go to [https://web3forms.com/](https://web3forms.com/) and enter the academy's official receiving email address to create a free **Access Key**.
2. Open `js/config.js` and locate:
   ```js
   web3forms: {
     endpoint: "https://api.web3forms.com/submit",
     accessKey: "YOUR_WEB3FORMS_ACCESS_KEY",
     fromName: "DeviX Academy Website"
   }
   ```
3. Replace `"YOUR_WEB3FORMS_ACCESS_KEY"` with your real key from the Web3Forms dashboard.
4. No other file needs to be edited — `js/forms.js` reads `window.DEVIX_CONFIG.web3forms` automatically across every page.

> **Security Note:** Never pretend a form succeeded if the key is unconfigured or if the API fails. Until you replace `YOUR_WEB3FORMS_ACCESS_KEY`, submitting a validated form shows a clear setup prompt and a one-click WhatsApp fallback.

---

## How to Update the WhatsApp Number

1. Open `js/config.js`.
2. Update both display and international (`91` + 10 digits) values:
   ```js
   whatsapp: {
     displayNumber: "+91 97535 28324",
     rawNumber: "919753528324",
     defaultMessage: "Hello DeviX Academy, I want to know about your technology and AI training programs."
   }
   ```
3. Header icons, floating WhatsApp pulse buttons, enquiry fallback buttons, and footer contact links update automatically on every page.

---

## How to Change Website Content

Most dynamic sections are centralized in **`js/data.js`** so you can edit them without touching HTML markup:

- **Statistics (`DEVIX_DATA.stats`)**: Update metrics and `note` labels as verified cohort milestones grow.
- **Partners (`DEVIX_DATA.partners`)**: Customize ecosystem collaborations, academic partners, and enterprise training tracks.
- **Programs & Brochures (`DEVIX_DATA.programs`)**: Edit course overviews, tool stacks, 6-module syllabi, capstone projects, or set `brochureUrl: "assets/documents/your-file.pdf"` once PDFs are placed in `/assets/documents/`.
- **Industries (`DEVIX_DATA.industries`)**: Customize use cases and recommended program slugs per sector.
- **Lead Mentor (`DEVIX_DATA.trainers`)**: Manage Lead Technical Trainer profile (`Ramgopal Prajapati — Ram Sir`), expertise tags, portrait, and verified links.
- **Testimonials (`DEVIX_DATA.testimonials`)**: Curate verified learner reviews and rounded avatar images (`assets/images/reviews/`).
- **FAQs (`DEVIX_DATA.faqs`)**: Add or edit questions and answers.

---

## How to Replace Images

All images are stored in WebP format under `/assets/images/`:

- **Hero Visual**: `assets/images/hero-ai-lab.webp`
- **Corporate Banner**: `assets/images/corporate-upskilling.webp`
- **Program Cards**: `assets/images/programs/prog-*.webp`
- **Interactive Collage**: `assets/images/collage/collage-*.webp`
- **Lead Mentor Portrait**: `assets/images/team/trainer-lead.webp`
- **Reviewer Portraits**: `assets/images/reviews/reviewer-*.webp`
- **Events Gallery**: `assets/images/gallery/gallery-*.webp`

Simply overwrite any file using the same filename (recommended `.webp` format for fast Core Web Vitals), or add new files and update their paths in `js/data.js`.

---

## How to Deploy

Before going live:
1. Replace `"https://devixacademy.example"` across `canonical` meta tags, `sitemap.xml`, `robots.txt`, and `js/config.js` with your real HTTPS domain.
2. Configure your real Web3Forms Access Key in `js/config.js`.
3. Verify `ramsirdevix@gmail.com`, Indore/live cohort address, and social links in `js/config.js` and `index.html` / `/pages/*.html` footers.

Deploy the `/devix-academy` folder directly to any static hosting provider:
- **Netlify / Vercel / Cloudflare Pages**: Drag-and-drop or connect your repository with root set to `/devix-academy` (no build command needed).
- **GitHub Pages**: Push contents to a branch and enable Pages from `/root`.
- **cPanel / Shared Hosting / Nginx / Apache**: Upload all files inside `/devix-academy` to `public_html/` or your web root with HTTPS enabled.
