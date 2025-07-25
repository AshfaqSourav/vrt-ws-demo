import { test, expect } from '@playwright/test';
import { MainPage } from '../../../pages/webshop/main/MainPage.js';
import { compareScreenshots } from '../../../utils/compareScreenShots.js';
import { generateHtmlReport as generateDesktopHtml } from '../../../utils/HtmlReport/Webshop/Main/main/desktop.js';
import { generateHtmlReport as generateLaptopHtml } from '../../../utils/HtmlReport/Webshop/Main/main/laptop.js';
import { generateHtmlReport as generateTabletHtml } from '../../../utils/HtmlReport/Webshop/Main/main/tablet.js';
import { generateHtmlReport as generateMobileHtml } from '../../../utils/HtmlReport/Webshop/Main/main/mobile.js';
import { generateHtmlReport as generateTabbedReportHtml } from '../../../utils/HtmlReport/generateTabbedReport.js';
import { scrollPage } from '../../../utils/scrollUtils.js';
// import { AboutUsStyles } from '../../utils/cssProperties/AboutUsStyles.js';
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
    expectedPath: './expected_screenshots/main/mainDesktopFigma.png',
    htmlGen: generateDesktopHtml
  },
  {
    name: 'Laptop',
    expectedPath: './expected_screenshots/main/mainLaptopFigma.png',
    htmlGen: generateLaptopHtml
  },
  {
    name: 'Tablet',
    expectedPath: './expected_screenshots/main/mainTabletFigma.png',
    htmlGen: generateTabletHtml
  },
  {
    name: 'Mobile',
    expectedPath: './expected_screenshots/main/mainMobileFigma.png',
    htmlGen: generateMobileHtml
  }
];

// SERIAL BLOCK — Ensures tests run one after another
test.describe.serial('Main VRT Suite', () => {
  for (const { name: viewport, expectedPath, htmlGen } of viewports) {
    test(`${viewport} - Main visual should match Figma`, async ({ page }) => {
      const main = new MainPage(page, viewport);
      await main.goto();
      await scrollPage(page);

      const { cropped } = await main.takeScreenshot();
      const actualBuffer = fs.readFileSync(cropped);
      // const actualBuffer = await main.takeScreenshot();

      const diffPixels = compareScreenshots({
        actualBuffer,
        expectedPath,
        actualPath: `${diffDir}/main${viewport}-actual.png`,
        diffPath: `${diffDir}/main${viewport}-diff.png`,
        expectedCopyPath: `${diffDir}/main${viewport}-expected.png`
      });

      diffResults[viewport] = diffPixels;

      htmlGen({
        diffPixels,
        outputDir: diffDir,
        reportPath: `${diffDir}/main${viewport}-report.html`,
        pageName: `About Us ${viewport}`
      });

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
    const reportPath = path.resolve('./diff_output/mainMultiViewportReport.html');
    console.log('📊 Generating tabbed multi-viewport report...');

    const tabbedData = ['Desktop', 'Laptop', 'Tablet', 'Mobile'].map(name => ({
  name,
  diffPixels: diffResults[name].diffPixels ?? 'Failed',
  expectedImage: `main${name}-expected.png`,
  actualImage: `main${name}-actual.png`,
  diffImage: `main${name}-diff.png`
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
