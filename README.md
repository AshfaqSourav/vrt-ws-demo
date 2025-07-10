# 🎯 Visual Regression Testing Framework

This project provides a fully automated **visual regression testing pipeline** using:

- ✅ [Playwright](https://playwright.dev/) for browser automation
- ✅ Screenshots from your **live web app**
- ✅ Baseline UI designs exported directly from **Figma**
- 🧪 Pixel-by-pixel comparison with a beautifully generated HTML report

---
## 🌟 New Features

- Masking support: Compare selected areas by masking specific locators
- optional cropElement: Crop only selected elements if specified
- Auto-crop white margins: Automatically trims empty space after margins
- Locator-based comparison: Use any selector to compare with expected Figma design
- Figma frame block export: Nodes (blocks) from a inner frame can now be exported automatically
- CSS property check: Validate specific CSS properties of a locator
- Optimized test specs: Removed redundancy in spec.js for cleaner logic
- Enhanced HTML report: Now displays pixel differences across multiple viewports

---

## 🚀 Existing Features

- Pull baseline screenshots directly via Figma API
- Capture actual screenshots from production pages
- Auto-crop and diff to align dimensions
- HTML report with side-by-side Expected / Actual / Diff comparison
- Scroll-to-bottom support to ensure full content rendering
- Modular structure for easy reuse across pages, modules, and devices

⚠️ Limitation:
If a top component mismatches, it can misalign all components below it — making debugging difficult until the top section is fixed.

---

## 📦 Prerequisites

Make sure you have the following installed:

- [Node.js v18+, preferred to use v20.17.0](https://nodejs.org/en/download/)
- Git
- A Figma personal access token (for downloading design baselines) and you should have page export permission

---

## 🔧 Project Setup

After cloning the repo:

```bash
git clone https://github.com/AshfaqSourav/vrt-ws-demo.git
cd playwright-visual-regression

```Install dependencies
npm install

```Install Playwright browsers:
npx playwright install
#  npm install -g cors-anywhere //for bypass cors error

```Add .env file
npm install dotenv
Add a file with .env
Add FIGMA_TOKEN ,FIGMA_FILE_KEY,URL

```Run a Visual Test
npx playwright test

``` open the HTML report directly after test run:
start diff_output/report.html     # On Windows
open diff_output/report.html      # On macOS

npx playwright test "./tests/visualTry/aboutUs.spec.js"

📂 Folder Structure

playwright-visual-regression/
├── figma/                        # Download baseline from Figma
│   └── download.ts
│
├── pages/                        # Page Object Models (e.g. TestPage)
│   └── PaystationPage.ts
│
├── tests/visual/                # Playwright test specs
│   └── paystation.spec.ts
│
├── utils/                       # Reusable helpers
│   ├── common/scrollUtils.ts   # Page scroll logic
│   ├── compareScreenshots.ts   # Core pixel comparison logic
│   └── report/products/...     # HTML report templates per product/module
│
├── expected_screenshots/       # Baseline images from Figma
│
├── diff_output/                # Diff results, actuals, HTML report


## 🧪 How to Add a New Module (e.g., Checkout Page)

Follow these steps to integrate and test a new module against Figma designs:

---

### 🔧 1. Setup Environment

## Create a `.env` file (if it doesn’t exist already) in the project root and add:

```env
FIGMA_TOKEN=your_figma_access_token
FIGMA_FILE_KEY=your_figma_file_key
BASE_URL=https://your-app-url.com

## 🎨 2. Add Baseline Frame in Figma
Open your module frame in Figma (e.g., Checkout).
Copy the fileKey and nodeId from the URL.

```Update the figma.config.ts file:

nodes: {
  paystation: '5214:24158',
  checkout: '7319:12653' // ← Add new module here
};

## 📸 3. Download Baseline Screenshot
Run the following command to pull the baseline image from Figma:

```npm run figma:download
📁 Output: expected_screenshots/checkout/baseline.png

##🧭 4. Add Page Slug
In the pages/ directory:

Create or update a file like checkout.ts
Define navigation, rendering logic, and slug routing

##🧱 5. Create Page Object (Optional)
If the module requires custom actions or reusable locators:

Add a new file in pageObjects/ (e.g., CheckoutPage.ts)
Define helper methods or locators

##🧪 6. Write the Test Spec
In the tests/ or specs/ folder:

Add a file like checkout.spec.js
Follow the pattern of existing tests to compare actual vs. expected screenshots
Use utilities like compareScreenshots() for visual diffing

##📊 7. Update HTML Report (Optional)
To enhance viewport-specific diff reporting:

Edit the utils/htmlReport logic
The generated report will show pixel differences across viewports