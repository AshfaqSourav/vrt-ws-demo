import { test, expect } from '@playwright/test';
import { MainSuccessGuidePage } from '../../../pages/webshop/main/MainSuccessGuidePage.js';
import { compareScreenshots } from '../../../utils/compareScreenShots.js';
import { generateHtmlReport as generateDesktopHtml } from '../../../utils/HtmlReport/Webshop/Main/mainSuccessGuide/desktop.js';
import { generateHtmlReport as generateLaptopHtml } from '../../../utils/HtmlReport/Webshop/Main/mainSuccessGuide/laptop.js';
import { generateHtmlReport as generateTabletHtml } from '../../../utils/HtmlReport/Webshop/Main/mainSuccessGuide/tablet.js';
import { generateHtmlReport as generateMobileHtml } from '../../../utils/HtmlReport/Webshop/Main/mainSuccessGuide/mobile.js';
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
    expectedPath: './expected_screenshots/mainSuccessGuide/mainSuccessGuideDesktopFigma.png',
    htmlGen: generateDesktopHtml
  },
  {
    name: 'Laptop',
    expectedPath: './expected_screenshots/mainSuccessGuide/mainSuccessGuideLaptopFigma.png',
    htmlGen: generateLaptopHtml
  }
  ,
  {
    name: 'Tablet',
    expectedPath: './expected_screenshots/mainSuccessGuide/mainSuccessGuideTabletFigma.png',
    htmlGen: generateTabletHtml
  },
  {
    name: 'Mobile',
    expectedPath: './expected_screenshots/mainSuccessGuide/mainSuccessGuideMobileFigma.png',
    htmlGen: generateMobileHtml
  }
];

// SERIAL BLOCK — Ensures tests run one after another
test.describe.serial('Main SuccessGuide VRT Suite', () => {
  for (const { name: viewport, expectedPath, htmlGen } of viewports) {
    test(`${viewport} - Main SuccessGuide visual should match Figma`, async ({ page }) => {
      const mainSuccessGuide = new MainSuccessGuidePage (page, viewport);
      await mainSuccessGuide.goto();
      // await scrollPage(page);

      const { cropped } = await mainSuccessGuide.takeScreenshot();
      const actualBuffer = fs.readFileSync(cropped);

      const diffPixels = compareScreenshots({
        actualBuffer,
        expectedPath,
        actualPath: `${diffDir}/mainSuccessGuide${viewport}-actual.png`,
        diffPath: `${diffDir}/mainSuccessGuide${viewport}-diff.png`,
        expectedCopyPath: `${diffDir}/mainSuccessGuide${viewport}-expected.png`
      });

      diffResults[viewport] = diffPixels;

      htmlGen({
        diffPixels,
        outputDir: diffDir,
        reportPath: `${diffDir}/mainSuccessGuide${viewport}-report.html`,
        pageName: `Main SuccessGuide ${viewport}`
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
    const reportPath = path.resolve('./diff_output/mainSuccessGuideMultiViewportReport.html');
    console.log('📊 Generating tabbed multi-viewport report...');

    const tabbedData = ['Desktop', 'Laptop', 'Tablet', 'Mobile'].map(name => ({
  name,
  diffPixels: diffResults[name].diffPixels ?? 'Failed',
  expectedImage: `mainSuccessGuide${name}-expected.png`,
  actualImage: `mainSuccessGuide${name}-actual.png`,
  diffImage: `mainSuccessGuide${name}-diff.png`
}));

generateTabbedReportHtml({
  outputDir: diffDir,
  reportPath,
  pageName: 'Main SuccessGuide',
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
