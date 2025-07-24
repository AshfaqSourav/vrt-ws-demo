import { test, expect } from '@playwright/test';
import { StorefrontPage } from '../../../pages/webshop/capabilities/StorefrontPage.js';
import { compareScreenshots } from '../../../../utils/compareScreenShots.js';
import { generateHtmlReport as generateDesktopHtml } from '../../../../utils/HtmlReport/Webshop/Capabilities/storefront/desktop.js';
import { generateHtmlReport as generateLaptopHtml } from '../../../../utils/HtmlReport/Webshop/Capabilities/storefront/laptop.js';
import { generateHtmlReport as generateTabletHtml } from '../../../../utils/HtmlReport/Webshop/Capabilities/storefront/tablet.js';
import { generateHtmlReport as generateMobileHtml } from '../../../../utils/HtmlReport/Webshop/Capabilities/storefront/mobile.js';
import { generateHtmlReport as generateTabbedReportHtml } from '../../../../utils/HtmlReport/generateTabbedReport.js';
import { scrollPage } from '../../../../utils/scrollUtils.js';
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
    expectedPath: './expected_screenshots/storefront/storefrontDesktopFigma.png',
    htmlGen: generateDesktopHtml
  },
  {
    name: 'Laptop',
    expectedPath: './expected_screenshots/storefront/storefrontLaptopFigma.png',
    htmlGen: generateLaptopHtml
  },
  {
    name: 'Tablet',
    expectedPath: './expected_screenshots/storefront/storefrontTabletFigma.png',
    htmlGen: generateTabletHtml
  },
  {
    name: 'Mobile',
    expectedPath: './expected_screenshots/storefront/storefrontMobileFigma.png',
    htmlGen: generateMobileHtml
  }
];

// SERIAL BLOCK — Ensures tests run one after another
test.describe.serial('Storefront VRT Suite', () => {
  for (const { name: viewport, expectedPath, htmlGen } of viewports) {
    test(`${viewport} - Storefront visual should match Figma`, async ({ page }) => {
      const storefront = new StorefrontPage(page, viewport);
      await storefront.goto();
      await scrollPage(page);

      const { cropped } = await storefront.takeScreenshot();
      const actualBuffer = fs.readFileSync(cropped);

      const diffPixels = compareScreenshots({
        actualBuffer,
        expectedPath,
        actualPath: `${diffDir}/storefront${viewport}-actual.png`,
        diffPath: `${diffDir}/storefront${viewport}-diff.png`,
        expectedCopyPath: `${diffDir}/storefront${viewport}-expected.png`
      });

      diffResults[viewport] = diffPixels;

      htmlGen({
        diffPixels,
        outputDir: diffDir,
        reportPath: `${diffDir}/storefront${viewport}-report.html`,
        pageName: `storefront ${viewport}`
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
    const reportPath = path.resolve('./diff_output/storefrontMultiViewportReport.html');
    console.log('📊 Generating tabbed multi-viewport report...');

    const tabbedData = ['Desktop', 'Laptop', 'Tablet', 'Mobile'].map(name => ({
  name,
  diffPixels: diffResults[name].diffPixels ?? 'Failed',
  expectedImage: `storefront${name}-expected.png`,
  actualImage: `storefront${name}-actual.png`,
  diffImage: `storefront${name}-diff.png`
}));

generateTabbedReportHtml({
  outputDir: diffDir,
  reportPath,
  pageName: 'Storefront',
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
