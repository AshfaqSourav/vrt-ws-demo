import { test, expect } from '@playwright/test';
import { demoDefaultStrategyPage} from '../../pages/Demo/DemoDefaultStrategyPage.js';
import { compareScreenshots } from '../../utils/compareScreenShots.js';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/Demo/DemoDefaultStrategy/laptop.js';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/Demo/DemoDefaultStrategy/mobile.js';
import { generateHtmlReport as generateTabbedReportHtml } from '../../utils/HtmlReport/generateTabbedReport.js';
import { scrollPage } from '../../utils/scrollUtils.js';
//import { DemoFooterStyles } from '../../utils/cssProperties/Demo/DemoFooterStyles.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const diffDir = './diff_output';

// Store all diff results globally
const diffResults = {
  Laptop: { status: 'Pending', diffPixels: null },
  Mobile: { status: 'Pending', diffPixels: null },
};

// Viewport configuration
const viewports = [
  {
    name: 'Laptop',
    expectedPath: './expected_screenshots/demoDefaultStrategy/demoDefaultStrategyLaptopFigma.png',
    htmlGen: generateLaptopHtml
  },

  // {
  //   name: 'Mobile',
  //   expectedPath: './expected_screenshots/demoDefaultStrategy/demoDefaultStrategyMobileFigma.png',
  //   htmlGen: generateMobileHtml
  // }
];

// SERIAL BLOCK — Ensures tests run one after another
test.describe.serial('Demo Default Strategy VRT Suite', () => {
  for (const { name: viewport, expectedPath, htmlGen } of viewports) {
    test(`${viewport} - Demo Default Strategy visual should match Figma`, async ({ page }) => { 
      const demoDefaultS = new demoDefaultStrategyPage(page, viewport);
      await demoDefaultS.goto();
      await scrollPage(page);

      const { cropped } = await demoDefaultS.takeScreenshot();
      const actualBuffer = fs.readFileSync(cropped);

      const diffPixels = compareScreenshots({
        actualBuffer,
        expectedPath,
        actualPath: `${diffDir}/demoDefaultStrategy${viewport}-actual.png`,
        diffPath: `${diffDir}/demoDefaultStrategy${viewport}-diff.png`,
        expectedCopyPath: `${diffDir}/demoDefaultStrategy${viewport}-expected.png`
      });

      diffResults[viewport] = diffPixels;

      htmlGen({
        diffPixels,
        outputDir: diffDir,
        reportPath: `${diffDir}/demoDefaultStrategy${viewport}-report.html`,
        pageName: `Demo Default Strategy ${viewport}`
      });


// === Visual Diff (if any)
try {
  diffResults[viewport] = { status: 'Passed', diffPixels };
  expect(diffPixels).toBeLessThan(300);
} catch (err) {
  diffResults[viewport] = { status: 'Failed', diffPixels };
  console.error(`❌ ${viewport} test failed`, err.message);
}

// === Summary Log ===
for (const [vp, results] of Object.entries(testResults)) {
  console.log(`\n=== ✅❌ Test Summary for Viewport: ${vp} ===`);
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => r.passed === false).length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log(`\n--- ❌ Failed Details ---`);
    results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`[${r.element}] [${r.property}] — Received: "${r.received}", Expected: "${r.expected}"`);
      });
  }
};
    })
  }
  
    // AFTER ALL TESTS — Generate tabbed report once
  test.afterAll(async () => {
    const reportPath = path.resolve('./diff_output/demoFooterMultiViewportReport.html');
    console.log('📊 Generating tabbed multi-viewport report...');

    const tabbedData = ['Laptop'].map(name => ({
  name,
  diffPixels: diffResults[name].diffPixels ?? 'Failed',
  expectedImage: `demoDefaultStrategy${name}-expected.png`,
  actualImage: `demoDefaultStrategy${name}-actual.png`,
  diffImage: `demoDefaultStrategy${name}-diff.png`
}));

generateTabbedReportHtml({
  outputDir: diffDir,
  reportPath,
  pageName: 'Demo Default Strategy',
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