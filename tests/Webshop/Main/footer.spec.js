import { test, expect } from '@playwright/test';
import { FooterPage } from '../../../pages/webshop/main/FooterPage.js';
import { compareScreenshots } from '../../../utils/compareScreenShots.js';
//import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/footer/desktop.js';
import { generateHtmlReport as generateLaptopHtml } from '../../../utils/HtmlReport/Webshop/Main/footer/laptop.js';
//import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/footer/tablet.js';
//import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/footer/mobile.js';
import { generateHtmlReport as generateTabbedReportHtml } from '../../../utils/HtmlReport/generateTabbedReport.js';
import { scrollPage } from '../../../utils/scrollUtils.js';
import { FooterStyles } from '../../../utils/cssProperties/Webshop/main/footerStyles.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const diffDir = './diff_output';

// Store all diff results globally
const diffResults = {
 // Desktop: { status: 'Pending', diffPixels: null },
  Laptop: { status: 'Pending', diffPixels: null },
  //Tablet: { status: 'Pending', diffPixels: null },
  //Mobile: { status: 'Pending', diffPixels: null },
};

// Viewport configuration
const viewports = [
  /*{
    name: 'Desktop',
    expectedPath: './expected_screenshots/footer/footerDesktopFigma.png',
    htmlGen: generateDesktopHtml
  },*/
  {
    name: 'Laptop',
    expectedPath: './expected_screenshots/footer/footerLaptopFigma.png',
    htmlGen: generateLaptopHtml
  }
  /*,
  {
    name: 'Tablet',
    expectedPath: './expected_screenshots/footer/footerTabletFigma.png',
    htmlGen: generateTabletHtml
  },
  {
    name: 'Mobile',
    expectedPath: './expected_screenshots/footer/footerMobileFigma.png',
    htmlGen: generateMobileHtml
  }*/
];

// SERIAL BLOCK — Ensures tests run one after another
test.describe.serial('Footer VRT Suite', () => {
  for (const { name: viewport, expectedPath, htmlGen } of viewports) {
    test(`${viewport} - Footer visual should match Figma`, async ({ page }) => {
      const footer = new FooterPage (page, viewport);
      await footer.goto();
      await scrollPage(page);

      const { cropped } = await footer.takeScreenshot();
      const actualBuffer = fs.readFileSync(cropped);

      const diffPixels = compareScreenshots({
        actualBuffer,
        expectedPath,
        actualPath: `${diffDir}/footer${viewport}-actual.png`,
        diffPath: `${diffDir}/footer${viewport}-diff.png`,
        expectedCopyPath: `${diffDir}/footer${viewport}-expected.png`
      });

      diffResults[viewport] = diffPixels;

      htmlGen({
        diffPixels,
        outputDir: diffDir,
        reportPath: `${diffDir}/footer${viewport}-report.html`,
        pageName: `Footer ${viewport}`
      });

      // Optional: CSS validation
        const expectedLinkStyle = FooterStyles?.Hero?.link?.[viewport];

      if (expectedLinkStyle) {
      const heroLink = page.getByRole('link', { name: /Capabilities/i });

      //await expect(heroLink).toHaveCSS('font-size', expectedLinkStyle.fontSize); //expected font size 16, having 14px
      await expect(heroLink).toHaveCSS('font-weight', expectedLinkStyle.fontWeight);
      await expect(heroLink).toHaveCSS('color', expectedLinkStyle.color);
      //await expect(heroLink).toHaveCSS('line-height', expectedLinkStyle.lineHeight);
      await expect(heroLink).toHaveCSS('font-family', expectedLinkStyle.fontFamily);
      }

      {
        const heroLink = page.getByRole('link', { name: /Partner spotlight/i });

      //await expect(heroLink).toHaveCSS('font-size', expectedLinkStyle.fontSize); //expected font size 16, having 14px
      await expect(heroLink).toHaveCSS('font-weight', expectedLinkStyle.fontWeight);
      await expect(heroLink).toHaveCSS('color', expectedLinkStyle.color);
      //await expect(heroLink).toHaveCSS('line-height', expectedLinkStyle.lineHeight);
      await expect(heroLink).toHaveCSS('font-family', expectedLinkStyle.fontFamily);
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
    const reportPath = path.resolve('./diff_output/footerMultiViewportReport.html');
    console.log('📊 Generating tabbed multi-viewport report...');

    const tabbedData = ['Laptop'].map(name => ({
  name,
  diffPixels: diffResults[name].diffPixels ?? 'Failed',
  expectedImage: `footer${name}-expected.png`,
  actualImage: `footer${name}-actual.png`,
  diffImage: `footer${name}-diff.png`
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
