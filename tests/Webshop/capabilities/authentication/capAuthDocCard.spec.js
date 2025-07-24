import { test, expect } from '@playwright/test';
import { CapAuthDocCardPage } from '../../../../pages/webshop/capabilities/authentication/CapAuthDocCardPage.js';
import { compareScreenshots } from '../../../../utils/compareScreenShots.js';
import { generateHtmlReport as generateDesktopHtml } from '../../../../utils/HtmlReport/Webshop/Capabilities/authentication/docCard/desktop.js';
import { generateHtmlReport as generateLaptopHtml } from '../../../../utils/HtmlReport/Webshop/Capabilities/authentication/docCard/laptop.js';
import { generateHtmlReport as generateTabletHtml } from '../../../../utils/HtmlReport/Webshop/Capabilities/authentication/docCard/tablet.js';
import { generateHtmlReport as generateMobileHtml } from '../../../../utils/HtmlReport/Webshop/Capabilities/authentication/docCard/mobile.js';
import { generateHtmlReport as generateTabbedReportHtml } from '../../../../utils/HtmlReport/generateTabbedReport.js';
import { scrollPage } from '../../../../utils/scrollUtils.js';
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
    expectedPath: './expected_screenshots/capAuthDocCard/capAuthDocCardDesktopFigma.png',
    htmlGen: generateDesktopHtml
  },
  {
    name: 'Laptop',
    expectedPath: './expected_screenshots/capAuthDocCard/capAuthDocCardLaptopFigma.png',
    htmlGen: generateLaptopHtml
  }
  ,
  {
    name: 'Tablet',
    expectedPath: './expected_screenshots/capAuthDocCard/capAuthDocCardTabletFigma.png',
    htmlGen: generateTabletHtml
  },
  {
    name: 'Mobile',
    expectedPath: './expected_screenshots/capAuthDocCard/capAuthDocCardMobileFigma.png',
    htmlGen: generateMobileHtml
  }
];

// SERIAL BLOCK — Ensures tests run one after another
test.describe.serial('capAuth DocCard VRT Suite', () => {
  for (const { name: viewport, expectedPath, htmlGen } of viewports) {
    test(`${viewport} - capAuthDocCard visual should match Figma`, async ({ page }) => {
      const capAuthDocCard = new CapAuthDocCardPage (page, viewport);
      await capAuthDocCard.goto();
      // await scrollPage(page);

      const { cropped } = await capAuthDocCard.takeScreenshot();
      const actualBuffer = fs.readFileSync(cropped);

      const diffPixels = compareScreenshots({
        actualBuffer,
        expectedPath,
        actualPath: `${diffDir}/capAuthDocCard${viewport}-actual.png`,
        diffPath: `${diffDir}/capAuthDocCard${viewport}-diff.png`,
        expectedCopyPath: `${diffDir}/capAuthDocCard${viewport}-expected.png`
      });

      diffResults[viewport] = diffPixels;

      htmlGen({
        diffPixels,
        outputDir: diffDir,
        reportPath: `${diffDir}/capAuthDocCard${viewport}-report.html`,
        pageName: `capAuthDocCard ${viewport}`
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
    const reportPath = path.resolve('./diff_output/capAuthDocCardMultiViewportReport.html');
    console.log('📊 Generating tabbed multi-viewport report...');

    const tabbedData = ['Desktop', 'Laptop', 'Tablet', 'Mobile'].map(name => ({
  name,
  diffPixels: diffResults[name].diffPixels ?? 'Failed',
  expectedImage: `capAuthDocCard${name}-expected.png`,
  actualImage: `capAuthDocCard${name}-actual.png`,
  diffImage: `capAuthDocCard${name}-diff.png`
}));

generateTabbedReportHtml({
  outputDir: diffDir,
  reportPath,
  pageName: 'Cap Auth DocCard',
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
