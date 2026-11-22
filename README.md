# WealthPulse — Everyday Money, Elevated

A modern, high-conversion personal finance and educational platform with **interactive calculators, live simulators, AI financial guidance, multi-currency support, complete legal/trust architecture, and full Google AdSense monetization readiness**.

---

## 🎨 Brand Identity & Design System: Premium White SaaS

The platform features a clean, professional **White Theme** tailored for high credibility, accessibility, and trustworthy financial education:
- **Brand Name:** WealthPulse
- **Brand Emblem:** Modern geometric SVG icon combining financial growth bars and a vital pulse wave in Navy Blue (`#0f172a`), Emerald Green (`#059669`), and Electric Blue (`#2563eb`).
- **Primary Background:** Clean White (`#ffffff`) with subtle light-grey section contrasts (`#f8fafc`).
- **Typography:** Dark navy / charcoal text (`#0f172a`, `#334155`) for optimal readability and accessibility.
- **Accents:** Electric Blue (`#2563eb`) as the primary interactive accent, paired with Soft Emerald Green (`#059669`), Amber (`#f59e0b`), and Purple (`#7c3aed`) for category distinctions.
- **Containers & Elevation:** Subtle shadows (`shadow-sm`, `shadow-2xs`), rounded cards (`rounded-2xl`, `rounded-3xl`), and crisp slate borders (`border-slate-200/80`).

---

## 💰 Google AdSense Monetization Architecture

Dedicated, non-intrusive advertisement placements are integrated into the article masterclasses and homepage hubs, strictly adhering to Google Publisher Policies:
- Clearly demarcated containers labeled with an uppercase `"ADVERTISEMENT"` micro-label.
- Light-grey background (`bg-slate-50`) with rounded borders so ads never blend deceptively with editorial content.
- Unique element IDs for every placement.

### Ad Placements & Unique IDs

| Page / Section | Placement Description | Recommended Unit Size | Unique Container ID |
| :--- | :--- | :--- | :--- |
| **Homepage** | Top leaderboard between Hero and Categories | 728x90 Leaderboard / Responsive | `home-ad-slot-banner` |
| **Homepage** | Divider banner between Categories and Tools | In-Feed Responsive Banner | `home-ad-slot-hub` |
| **Article Pages** | Top banner below the guide title & metadata | 728x90 Leaderboard / Responsive | `[page]-ad-slot-top-banner` |
| **Article Pages** | In-article native ad after the first 2–3 paragraphs | Native In-Article Fluid | `[page]-ad-slot-in-article-1` |
| **Article Pages** | Right-hand sidebar rectangle (Desktop only) | 300x250 Medium Rectangle | `[page]-ad-slot-sidebar` |
| **Article Pages** | Mid-article native ad between key sections | Native In-Article Fluid | `[page]-ad-slot-in-article-2` |
| **Article Pages** | Bottom banner before related navigation | 728x90 Leaderboard / Responsive | `[page]-ad-slot-bottom-banner` |

### How to Activate Google AdSense Once Approved

When you receive your official Google AdSense publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`) and Ad Unit slot IDs (`XXXXXXXXXX`), open the HTML files and replace the placeholder comments inside the ad containers:

```html
<!-- Example: Top Leaderboard Unit -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

Add the Google AdSense script tag inside the `<head>` of your pages:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

---

## 📁 Multi-Page Platform Architecture

```
financial-platform/
├── favicon.svg                  # WealthPulse brand SVG favicon
├── index.html                   # Homepage (Hero, Search, 5 Hubs, Featured Tools, Ad Placements, Masterclasses)
├── calculators.html             # Standalone Suite of 4 Interactive Financial Calculators & Simulators
├── about.html                   # About WealthPulse, Mission, Editorial Principles & Standards
├── contact.html                 # Dedicated Contact Page (Form with validation, honeypot, direct desk emails)
├── privacy-policy.html          # AdSense-Compliant Privacy Policy (Google DART cookies, DAA/NAI opt-outs, CCPA/GDPR)
├── terms.html                   # Terms & Conditions (Computational simulation scope, user agreement, IP)
├── disclaimer.html              # Dedicated Financial Disclaimer (Educational scope, non-fiduciary disclosure)
├── editorial-policy.html        # Editorial Standards (E-E-A-T research methodology, fact-checking, correction policy)
├── cookie-policy.html           # Dedicated Cookie Policy (Essential storage, analytics, managing AdSense cookies)
├── affiliate-disclosure.html    # FTC-Compliant Affiliate & Advertising Transparency Disclosure
├── app.js                       # Reactive calculation engine, Chart.js visuals, Copilot logic
├── README.md                    # Platform documentation & AdSense integration guide
└── guides/
    ├── personal-finance-101.html      # Order of Operations (with 5 AdSense placements & references)
    ├── budgeting-methods.html         # Budgeting Comparison (with 5 AdSense placements & references)
    ├── emergency-fund.html            # Emergency Fund Strategies (with 5 AdSense placements & references)
    ├── debt-payoff-strategies.html    # Debt Avalanche vs Snowball (with 5 AdSense placements & references)
    └── credit-scores.html             # The FICO Playbook & AZEO (with 5 AdSense placements & references)
```

---

## ⚖️ Essential Legal & Trust Pages (8 Total)

Google AdSense and search quality raters (E-E-A-T) require high transparency for financial content. WealthPulse provides dedicated pages for every trust requirement:
1. **About Us (`about.html`):** The WealthPulse mission, empirical principles, and research collective.
2. **Contact Us (`contact.html`):** Direct contact form with client-side validation, anti-spam honeypot, response time commitment, and direct desk email addresses.
3. **Privacy Policy (`privacy-policy.html`):** Fully compliant with Google Publisher Policies, disclosing log files, cookies, Google DoubleClick DART cookies, DAA / NAI opt-out links, CCPA, and GDPR rights.
4. **Terms and Conditions (`terms.html`):** Clear terms of service covering acceptable use, calculator simulation accuracy limits, and intellectual property.
5. **Financial Disclaimer (`disclaimer.html`):** Prominent disclosure that WealthPulse is a financial education platform, not a registered investment advisor or CPA.
6. **Editorial Policy (`editorial-policy.html`):** Research methodology, reliance on primary government data (Federal Reserve, IRS, CFPB), fact-checking protocols, and public correction policy.
7. **Cookie Policy (`cookie-policy.html`):** Complete breakdown of essential storage vs. advertising cookies and browser-specific instructions for managing cookies.
8. **Affiliate Disclosure (`affiliate-disclosure.html`):** FTC-compliant transparency explaining display advertising and potential affiliate links with zero extra cost to users.

---

## 🧮 Interactive Financial Calculators Suite

1. **50/30/20 Smart Budget Calculator:** Interactive slider/number input that dynamically calculates Needs (50%), Wants (30%), and Savings/Debt (20%) with a live Chart.js donut chart and CSV export.
2. **Compound Interest & Wealth Simulator:** Projects monthly contributions over 1 to 40 years with customizable return rates (1% to 15%) and visual Chart.js balance accumulation bar chart.
3. **Debt Snowball vs. Avalanche Simulator:** Side-by-side comparison of total interest paid, payoff timeline, and exact monetary savings between the mathematical Avalanche method and the psychological Snowball method.
4. **Emergency Fund Target Planner:** Calculates 3-month basic and 6-month full safety net targets based on monthly expenses, tracks current savings progress, and calculates months to completion.
5. **60-Second Financial Health Checkup:** Interactive 4-question diagnostic quiz assessing emergency buffers, debt levels, budget tracking, and retirement contributions, producing an instant score and custom action plan.

---

## 🚀 How to Run Locally

Because this platform is built with modern, zero-dependency static architecture (Tailwind CSS CDN, Chart.js CDN, Lucide Icons, and Vanilla JavaScript):

1. **Directly in Browser:** Double-click [index.html](file:///C:/Users/Sujeet%20Gaur/.gemini/antigravity/scratch/financial-platform/index.html) to open in Chrome, Edge, or Firefox.
2. **With VS Code Live Server:** Right-click `index.html` and click "Open with Live Server".

---

## 🌐 Instant 1-Click Free Deployment

Deploy in under 60 seconds with zero hosting costs:
- **Cloudflare Pages:** Connect your GitHub repo or drag-and-drop the `financial-platform` folder.
- **GitHub Pages:** Push to a GitHub repository and turn on Pages in repository settings.
- **Vercel / Netlify:** Drag and drop the `financial-platform` folder directly into the web dashboard.