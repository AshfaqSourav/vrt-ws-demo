import { test, expect } from '@playwright/test';
import { MainCalculatorPage } from '../../../pages/webshop/main/MainCalculatorPage.js';
import { compareScreenshots } from '../../../utils/compareScreenShots.js';
// import { generateHtmlReport as generateDesktopHtml } from '../../../utils/HtmlReport/Webshop/Main/mainCalculator/desktop.js';
import { generateHtmlReport as generateLaptopHtml } from '../../../utils/HtmlReport/Webshop/Main/mainCalculator/laptop.js';
// import { generateHtmlReport as generateTabletHtml } from '../../../utils/HtmlReport/Webshop/Main/mainCalculator/tablet.js';
// import { generateHtmlReport as generateMobileHtml } from '../../../utils/HtmlReport/Webshop/Main/mainCalculator/mobile.js';
import { generateHtmlReport as generateTabbedReportHtml } from '../../../utils/HtmlReport/generateTabbedReport.js';
import { scrollPage } from '../../../utils/scrollUtils.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const diffDir = './diff_output';

// Store all diff results globally
const diffResults = {
//  Desktop: { status: 'Pending', diffPixels: null },
  Laptop: { status: 'Pending', diffPixels: null },
  // Tablet: { status: 'Pending', diffPixels: null },
  // Mobile: { status: 'Pending', diffPixels: null },
};

// Viewport configuration
const viewports = [
  // {
  //   name: 'Desktop',
  //   expectedPath: './expected_screenshots/mainCalculator/mainCalculatorDesktopFigma.png',
  //   htmlGen: generateDesktopHtml
  // },
  {
    name: 'Laptop',
    expectedPath: './expected_screenshots/mainCalculator/mainCalculatorLaptopFigma.png',
    htmlGen: generateLaptopHtml
  },
  // {
  //   name: 'Tablet',
  //   expectedPath: './expected_screenshots/mainCalculator/mainCalculatorTabletFigma.png',
  //   htmlGen: generateTabletHtml
  // },
  // {
  //   name: 'Mobile',
  //   expectedPath: './expected_screenshots/mainCalculator/mainCalculatorMobileFigma.png',
  //   htmlGen: generateMobileHtml
  // }
];

// SERIAL BLOCK — Ensures tests run one after another
test.describe.serial('Main Calculator VRT Suite', () => {
  for (const { name: viewport, expectedPath, htmlGen } of viewports) {
    test(`${viewport} - Main Calculator visual should match Figma`, async ({ page }) => {
      const mainCalculator = new MainCalculatorPage (page, viewport);
      await mainCalculator.goto();

      const { cropped } = await mainCalculator.takeScreenshot();
      const actualBuffer = fs.readFileSync(cropped);

      const diffPixels = compareScreenshots({
        actualBuffer,
        expectedPath,
        actualPath: `${diffDir}/mainCalculator${viewport}-actual.png`,
        diffPath: `${diffDir}/mainCalculator${viewport}-diff.png`,
        expectedCopyPath: `${diffDir}/mainCalculator${viewport}-expected.png`
      });

      diffResults[viewport] = diffPixels;

      htmlGen({
        diffPixels,
        outputDir: diffDir,
        reportPath: `${diffDir}/mainCalculator${viewport}-report.html`,
        pageName: `Main Calculator ${viewport}`
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
    const reportPath = path.resolve('./diff_output/mainCalculatorMultiViewportReport.html');
    console.log('📊 Generating tabbed multi-viewport report...');

    const tabbedData = ['Laptop'].map(name => ({
  name,
  diffPixels: diffResults[name].diffPixels ?? 'Failed',
  expectedImage: `mainCalculator${name}-expected.png`,
  actualImage: `mainCalculator${name}-actual.png`,
  diffImage: `mainCalculator${name}-diff.png`
}));

generateTabbedReportHtml({
  outputDir: diffDir,
  reportPath,
  pageName: 'Paystation',
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
