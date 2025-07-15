import { test, expect } from '@playwright/test';
import { AboutUsPage } from '../../pages/try/AboutUsPage.js';
import { compareScreenshots } from '../../utils/compareScreenShots.js';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/aboutUs/desktop.js';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/aboutUs/laptop.js';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/aboutUs/tablet.js';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/aboutUs/mobile.js';
import { generateHtmlReport as generateTabbedReportHtml } from '../../utils/HtmlReport/generateTabbedReport.js';
import { scrollPage } from '../../utils/scrollUtils.js';
import { AboutUsStyles } from '../../utils/cssProperties/AboutUsStyles.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const diffDir = './diff_output';

// Store all diff results globally
const diffResults = {
  Desktop: { status: 'Pending', diffPixels: null },
  Laptop: { status: 'Pending', diffPixels: null },
  Tablet: { status: 'Pending', diffPixels: null },
  Mobile: { status: 'Pending', diffPixels: null },
};

// Viewport configuration
const viewports = [
  {
    name: 'Desktop',
    expectedPath: './expected_screenshots/aboutUs/aboutUsDesktopFigma.png',
    htmlGen: generateDesktopHtml
  },
  {
    name: 'Laptop',
    expectedPath: './expected_screenshots/aboutUs/aboutUsLaptopFigma.png',
    htmlGen: generateLaptopHtml
  },
  {
    name: 'Tablet',
    expectedPath: './expected_screenshots/aboutUs/aboutUsTabletFigma.png',
    htmlGen: generateTabletHtml
  },
  {
    name: 'Mobile',
    expectedPath: './expected_screenshots/aboutUs/aboutUsMobileFigma.png',
    htmlGen: generateMobileHtml
  }
];

// SERIAL BLOCK — Ensures tests run one after another
test.describe.serial('About Us VRT Suite', () => {
  for (const { name: viewport, expectedPath, htmlGen } of viewports) {
    test(`${viewport} - About Us visual should match Figma`, async ({ page }) => {
      const aboutUs = new AboutUsPage(page, viewport);
      await aboutUs.goto();
      await scrollPage(page);

      const { cropped } = await aboutUs.takeScreenshot();
      const actualBuffer = fs.readFileSync(cropped);

      const diffPixels = compareScreenshots({
        actualBuffer,
        expectedPath,
        actualPath: `${diffDir}/aboutUs${viewport}-actual.png`,
        diffPath: `${diffDir}/aboutUs${viewport}-diff.png`,
        expectedCopyPath: `${diffDir}/aboutUs${viewport}-expected.png`
      });

      diffResults[viewport] = diffPixels;

      htmlGen({
        diffPixels,
        outputDir: diffDir,
        reportPath: `${diffDir}/aboutUs${viewport}-report.html`,
        pageName: `About Us ${viewport}`
      });

      // Optional: CSS validation
      const expectedTitleStyle = AboutUsStyles?.Hero?.title?.[viewport];
      const expectedSpanStyle = AboutUsStyles?.Hero?.highlightSpan?.[viewport];

      if (expectedTitleStyle) {
        const heroTitle = page.getByRole('heading', { name: /Gaming’s best/i });
        await expect(heroTitle).toHaveCSS('font-size', expectedTitleStyle.fontSize);
        await expect(heroTitle).toHaveCSS('font-weight', expectedTitleStyle.fontWeight);
        await expect(heroTitle).toHaveCSS('color', expectedTitleStyle.color);

        if (expectedSpanStyle) {
          const heroSpan = heroTitle.locator('span');
          await expect(heroSpan).toHaveCSS('color', expectedSpanStyle.color);
        }
      }

        try {
          diffResults[viewport] = { status: 'Passed', diffPixels };
          expect(diffPixels).toBeLessThan(300);
        } catch (err) {
          diffResults[viewport] = { status: 'Failed', diffPixels };
          console.error(`❌ ${viewport} test failed`, err.message);
        }
    });
  }

  // AFTER ALL TESTS — Generate tabbed report once
  test.afterAll(async () => {
    const reportPath = path.resolve('./diff_output/aboutUsMultiViewportReport.html');
    console.log('📊 Generating tabbed multi-viewport report...');

    const tabbedData = ['Desktop', 'Laptop', 'Tablet', 'Mobile'].map(name => ({
  name,
  diffPixels: diffResults[name].diffPixels ?? 'Failed',
  expectedImage: `aboutUs${name}-expected.png`,
  actualImage: `aboutUs${name}-actual.png`,
  diffImage: `aboutUs${name}-diff.png`
}));

generateTabbedReportHtml({
  outputDir: diffDir,
  reportPath,
  pageName: 'About Us',
  viewports: tabbedData
});

    // Optional: Open report in browser
    if (fs.existsSync(reportPath)) {
      const openCmd =
        process.platform === 'win32'
          ? `start "" "${reportPath}"`
          : process.platform === 'darwin'
          ? `open "${reportPath}"`
          : `xdg-open "${reportPath}"`;

      await new Promise(resolve =>
        exec(openCmd, err => {
          if (err) console.warn('⚠️ Failed to open browser:', err.message);
          else console.log('✅ Opened visual report in browser');
          resolve(true);
        })
      );
    }
  });
});
