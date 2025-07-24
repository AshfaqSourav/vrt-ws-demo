import { test, expect } from '@playwright/test';
import { MainLogoGardenPage } from '../../../pages/webshop/main/MainLogoGardenPage.js';
import { compareScreenshots } from '../../../utils/compareScreenShots.js';
import { generateHtmlReport as generateDesktopHtml } from '../../../utils/HtmlReport/Webshop/Main/mainLogoGarden/desktop.js';
import { generateHtmlReport as generateLaptopHtml } from '../../../utils/HtmlReport/Webshop/Main/mainLogoGarden/laptop.js';
import { generateHtmlReport as generateTabletHtml } from '../../../utils/HtmlReport/Webshop/Main/mainLogoGarden/tablet.js';
import { generateHtmlReport as generateMobileHtml } from '../../../utils/HtmlReport/Webshop/Main/mainLogoGarden/mobile.js';
import { generateHtmlReport as generateTabbedReportHtml } from '../../../utils/HtmlReport/generateTabbedReport.js';
import { scrollPage } from '../../../utils/scrollUtils.js';
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
    expectedPath: './expected_screenshots/mainLogoGarden/mainLogoGardenDesktopFigma.png',
    htmlGen: generateDesktopHtml
  },
  {
    name: 'Laptop',
    expectedPath: './expected_screenshots/mainLogoGarden/mainLogoGardenLaptopFigma.png',
    htmlGen: generateLaptopHtml
  }
  ,
  {
    name: 'Tablet',
    expectedPath: './expected_screenshots/mainLogoGarden/mainLogoGardenTabletFigma.png',
    htmlGen: generateTabletHtml
  },
  {
    name: 'Mobile',
    expectedPath: './expected_screenshots/mainLogoGarden/mainLogoGardenMobileFigma.png',
    htmlGen: generateMobileHtml
  }
];

// SERIAL BLOCK — Ensures tests run one after another
test.describe.serial('Main LogoGarden VRT Suite', () => {
  for (const { name: viewport, expectedPath, htmlGen } of viewports) {
    test(`${viewport} - Main LogoGarden visual should match Figma`, async ({ page }) => {
      const mainLogoGarden = new MainLogoGardenPage (page, viewport);
      await mainLogoGarden.goto();
      await scrollPage(page);

      const { cropped } = await mainLogoGarden.takeScreenshot();
      const actualBuffer = fs.readFileSync(cropped);

      const diffPixels = compareScreenshots({
        actualBuffer,
        expectedPath,
        actualPath: `${diffDir}/mainLogoGarden${viewport}-actual.png`,
        diffPath: `${diffDir}/mainLogoGarden${viewport}-diff.png`,
        expectedCopyPath: `${diffDir}/mainLogoGarden${viewport}-expected.png`
      });

      diffResults[viewport] = diffPixels;

      htmlGen({
        diffPixels,
        outputDir: diffDir,
        reportPath: `${diffDir}/mainLogoGarden${viewport}-report.html`,
        pageName: `Main LogoGarden ${viewport}`
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
    const reportPath = path.resolve('./diff_output/mainLogoGardenMultiViewportReport.html');
    console.log('📊 Generating tabbed multi-viewport report...');

    const tabbedData = ['Desktop', 'Laptop', 'Tablet', 'Mobile'].map(name => ({
  name,
  diffPixels: diffResults[name].diffPixels ?? 'Failed',
  expectedImage: `mainLogoGarden${name}-expected.png`,
  actualImage: `mainLogoGarden${name}-actual.png`,
  diffImage: `mainLogoGarden${name}-diff.png`
}));

generateTabbedReportHtml({
  outputDir: diffDir,
  reportPath,
  pageName: 'Main LogoGarden',
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
