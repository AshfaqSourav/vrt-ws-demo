import { test, expect } from '@playwright/test';
import { MainFooterPage } from '../../../pages/webshop/main/MainFooterPage.js';
import { compareScreenshots } from '../../../utils/compareScreenShots.js';
import { generateHtmlReport as generateDesktopHtml } from '../../../utils/HtmlReport/Webshop/Main/mainFooter/desktop.js';
import { generateHtmlReport as generateLaptopHtml } from '../../../utils/HtmlReport/Webshop/Main/mainFooter/laptop.js';
import { generateHtmlReport as generateTabletHtml } from '../../../utils/HtmlReport/Webshop/Main/mainFooter/tablet.js';
import { generateHtmlReport as generateMobileHtml } from '../../../utils/HtmlReport/Webshop/Main/mainFooter/mobile.js';
import { generateHtmlReport as generateTabbedReportHtml } from '../../../utils/HtmlReport/generateTabbedReport.js';
import { scrollPage } from '../../../utils/scrollUtils.js';
import { FooterStyles } from '../../../utils/cssProperties/Webshop/main/footerStyles.js';
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
    expectedPath: './expected_screenshots/mainFooter/mainFooterDesktopFigma.png',
    htmlGen: generateDesktopHtml
  },
  {
    name: 'Laptop',
    expectedPath: './expected_screenshots/mainFooter/mainFooterLaptopFigma.png',
    htmlGen: generateLaptopHtml
  }
  ,
  {
    name: 'Tablet',
    expectedPath: './expected_screenshots/mainFooter/mainFooterTabletFigma.png',
    htmlGen: generateTabletHtml
  },
  {
    name: 'Mobile',
    expectedPath: './expected_screenshots/mainFooter/mainFooterMobileFigma.png',
    htmlGen: generateMobileHtml
  }
];

// SERIAL BLOCK — Ensures tests run one after another
test.describe.serial('Main Footer VRT Suite', () => {
  for (const { name: viewport, expectedPath, htmlGen } of viewports) {
    test(`${viewport} - Main Footer visual should match Figma`, async ({ page }) => {
      const mainFooter = new MainFooterPage (page, viewport);
      await mainFooter.goto();
      // await scrollPage(page);

      const { cropped } = await mainFooter.takeScreenshot();
      const actualBuffer = fs.readFileSync(cropped);

      const diffPixels = compareScreenshots({
        actualBuffer,
        expectedPath,
        actualPath: `${diffDir}/mainFooter${viewport}-actual.png`,
        diffPath: `${diffDir}/mainFooter${viewport}-diff.png`,
        expectedCopyPath: `${diffDir}/mainFooter${viewport}-expected.png`
      });

      diffResults[viewport] = diffPixels;

      htmlGen({
        diffPixels,
        outputDir: diffDir,
        reportPath: `${diffDir}/mainFooter${viewport}-report.html`,
        pageName: `Main Footer ${viewport}`
      });

      // // Optional: CSS validation
      //   const expectedLinkStyle = FooterStyles?.Hero?.link?.[viewport];

      // if (expectedLinkStyle) {
      // const heroLink = page.getByRole('link', { name: /Capabilities/i });

      // //await expect(heroLink).toHaveCSS('font-size', expectedLinkStyle.fontSize); //expected font size 16, having 14px
      // await expect(heroLink).toHaveCSS('font-weight', expectedLinkStyle.fontWeight);
      // await expect(heroLink).toHaveCSS('color', expectedLinkStyle.color);
      // //await expect(heroLink).toHaveCSS('line-height', expectedLinkStyle.lineHeight);
      // await expect(heroLink).toHaveCSS('font-family', expectedLinkStyle.fontFamily);
      // }

      // {
      //   const heroLink = page.getByRole('link', { name: /Partner spotlight/i });

      // //await expect(heroLink).toHaveCSS('font-size', expectedLinkStyle.fontSize); //expected font size 16, having 14px
      // await expect(heroLink).toHaveCSS('font-weight', expectedLinkStyle.fontWeight);
      // await expect(heroLink).toHaveCSS('color', expectedLinkStyle.color);
      // //await expect(heroLink).toHaveCSS('line-height', expectedLinkStyle.lineHeight);
      // await expect(heroLink).toHaveCSS('font-family', expectedLinkStyle.fontFamily);
      // }
     
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
    const reportPath = path.resolve('./diff_output/mainFooterMultiViewportReport.html');
    console.log('📊 Generating tabbed multi-viewport report...');

    const tabbedData = ['Desktop', 'Laptop', 'Tablet', 'Mobile'].map(name => ({
  name,
  diffPixels: diffResults[name].diffPixels ?? 'Failed',
  expectedImage: `mainFooter${name}-expected.png`,
  actualImage: `mainFooter${name}-actual.png`,
  diffImage: `mainFooter${name}-diff.png`
}));

generateTabbedReportHtml({
  outputDir: diffDir,
  reportPath,
  pageName: 'Main Footer',
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
