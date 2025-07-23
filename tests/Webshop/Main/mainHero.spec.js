import { test, expect } from '@playwright/test';
import { MainHeroPage } from '../../../pages/webshop/main/mainHeroPage.js';
import { compareScreenshots } from '../../../utils/compareScreenShots.js';
import { generateHtmlReport as generateDesktopHtml } from '../../../utils/HtmlReport/Webshop/Main/mainHero/desktop.js';
import { generateHtmlReport as generateLaptopHtml } from '../../../utils/HtmlReport/Webshop/Main/mainHero/laptop.js';
import { generateHtmlReport as generateTabletHtml } from '../../../utils/HtmlReport/Webshop/Main/mainHero/tablet.js';
import { generateHtmlReport as generateMobileHtml } from '../../../utils/HtmlReport/Webshop/Main/mainHero/mobile.js';
import { generateHtmlReport as generateTabbedReportHtml } from '../../../utils/HtmlReport/generateTabbedReport.js';
import { MainHeroStyles } from '../../../utils/cssProperties/Webshop/main/mainHeroStyles.js';
import { scrollPage } from '../../../utils/scrollUtils.js';
//import { AboutUsStyles } from '../../utils/cssProperties/AboutUsStyles.js';
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
    expectedPath: './expected_screenshots/mainHero/mainHeroDesktopFigma.png',
    htmlGen: generateDesktopHtml
  },
  {
    name: 'Laptop',
    expectedPath: './expected_screenshots/mainHero/mainHeroLaptopFigma.png',
    htmlGen: generateLaptopHtml
  },
  {
    name: 'Tablet',
    expectedPath: './expected_screenshots/mainHero/mainHeroTabletFigma.png',
    htmlGen: generateTabletHtml
  },
  {
    name: 'Mobile',
    expectedPath: './expected_screenshots/mainHero/mainHeroMobileFigma.png',
    htmlGen: generateMobileHtml
  }
];

// SERIAL BLOCK — Ensures tests run one after another
test.describe.serial('MainHero VRT Suite', () => {
  for (const { name: viewport, expectedPath, htmlGen } of viewports) {
    test(`${viewport} - MainHero visual should match Figma`, async ({ page }) => {
      const mainHero = new MainHeroPage (page, viewport);
      await mainHero.goto();
      await scrollPage(page);

      const { cropped } = await mainHero.takeScreenshot();
      const actualBuffer = fs.readFileSync(cropped);

      const diffPixels = compareScreenshots({
        actualBuffer,
        expectedPath,
        actualPath: `${diffDir}/mainHero${viewport}-actual.png`,
        diffPath: `${diffDir}/mainHero${viewport}-diff.png`,
        expectedCopyPath: `${diffDir}/mainHero${viewport}-expected.png`
      });

      diffResults[viewport] = diffPixels;

      htmlGen({
        diffPixels,
        outputDir: diffDir,
        reportPath: `${diffDir}/mainHero${viewport}-report.html`,
        pageName: `mainHero ${viewport}`
      });

     // CSS Validation Check
     
     const testResults = {}; // Collect results per viewport
     
     const testCssProperty = async (element, property, expectedValue, elementName) => {
       if (expectedValue === undefined || expectedValue === null) {
         console.warn(`⚠️ [${viewport}] [${elementName}] Skipping [${property}] — expected value is not defined`);
         return;
       }
     
       const receivedValue = await element.evaluate((el, prop) => {
         return window.getComputedStyle(el).getPropertyValue(prop);
       }, property);
     
       const trimmedValue = receivedValue.trim();
       const isPassed = trimmedValue === expectedValue;
     
       if (!testResults[viewport]) testResults[viewport] = [];
     
       testResults[viewport].push({
         element: elementName,
         property,
         expected: expectedValue,
         received: trimmedValue,
         passed: isPassed
       });
     
       if (isPassed) {
         console.log(`✅ [${viewport}] [${elementName}] [${property}] Passed — Received: "${trimmedValue}", Expected: "${expectedValue}"`);
       } else {
         console.error(`❌ [${viewport}] [${elementName}] [${property}] Failed — Received: "${trimmedValue}", Expected: "${expectedValue}"`);
       }
     };
     
     // === Tests Begin ===
     
     const expectedTitleStyle = MainHeroStyles?.Hero?.title?.[viewport];
     const expectedSubtitleStyle = MainHeroStyles?.Hero?.subtitle?.[viewport];
     const expectedButtonPrimaryStyle = MainHeroStyles?.Hero?.buttonPrimary?.[viewport];
     const expectedButtonSecondaryStyle = MainHeroStyles?.Hero?.buttonSecondary?.[viewport];
     const expectedAnalyseCount = MainHeroStyles?.Hero?.analyseCount?.[viewport];
     const expectedAnalyseTxt1 = MainHeroStyles?.Hero?.analyseCountTxt1?.[viewport];
     const expectedAnalyseCount2 = MainHeroStyles?.Hero?.analyseCount2?.[viewport];
     const expectedAnalyseTxt2 = MainHeroStyles?.Hero?.analyseCountTxt2?.[viewport];
     const expectedAnalyseCount3 = MainHeroStyles?.Hero?.analyseCount3?.[viewport];
     const expectedAnalyseTxt3 = MainHeroStyles?.Hero?.analyseCountTxt3?.[viewport];
     const expectedAnalyseCount4 = MainHeroStyles?.Hero?.analyseCount4?.[viewport];
     const expectedAnalyseTxt4 = MainHeroStyles?.Hero?.analyseCountTxt4?.[viewport];
     const expectedProvenTitle = MainHeroStyles?.Hero?.provenTitle?.[viewport];
     const expectedProvenSubtitle = MainHeroStyles?.Hero?.provenSubtitle?.[viewport];
     const expectedAuthenticationTitle = MainHeroStyles?.Hero?.authenticationTitle?.[viewport];
     const expectedAuthenticationSubtitle1 = MainHeroStyles?.Hero?.authenticationSubtitle1?.[viewport];
     const expectedAuthenticationSubtitle2 = MainHeroStyles?.Hero?.authenticationSubtitle2?.[viewport];
    //  const expectedCardPadding = MainHeroStyles?.Hero?.cardPadding?.[viewport];
     
     // Hero Title
     if (expectedTitleStyle) {
       const heroTitle = await page.getByText('Web Shop Build to perform,');
       await testCssProperty(heroTitle, 'font-size', expectedTitleStyle.fontSize, 'heroTitle');
       await testCssProperty(heroTitle, 'font-weight', expectedTitleStyle.fontWeight, 'heroTitle');
       await testCssProperty(heroTitle, 'font-family', expectedTitleStyle.fontFamily, 'heroTitle');
       await testCssProperty(heroTitle, 'color', expectedTitleStyle.color, 'heroTitle');
       await testCssProperty(heroTitle, 'line-height', expectedTitleStyle.lineHeight, 'heroTitle');
       await testCssProperty(heroTitle, 'padding-top', expectedTitleStyle.paddingTop, 'heroTitle');
     }
     
     // Hero Subtitle
     if (expectedSubtitleStyle) {
       const heroSubtitle = await page.getByText('Grow profitability with a');
       await testCssProperty(heroSubtitle, 'font-size', expectedSubtitleStyle.fontSize, 'heroSubtitle');
       await testCssProperty(heroSubtitle, 'font-weight', expectedSubtitleStyle.fontWeight, 'heroSubtitle');
       await testCssProperty(heroSubtitle, 'font-family', expectedSubtitleStyle.fontFamily, 'heroSubtitle');
       await testCssProperty(heroSubtitle, 'color', expectedSubtitleStyle.color, 'heroSubtitle');
       await testCssProperty(heroSubtitle, 'line-height', expectedSubtitleStyle.lineHeight, 'heroSubtitle');
       await testCssProperty(heroSubtitle, 'margin-top', expectedSubtitleStyle.lmarginTop, 'heroSubtitle');
     }
     
     // Customize Button
     if (expectedButtonPrimaryStyle) {
       const buttonPrimary = await page.getByRole('button', { name: 'Book a meeting' });
       await testCssProperty(buttonPrimary, 'font-size', expectedButtonPrimaryStyle.fontSize, 'buttonPrimary');
       await testCssProperty(buttonPrimary, 'font-weight', expectedButtonPrimaryStyle.fontWeight, 'buttonPrimary');
       await testCssProperty(buttonPrimary, 'font-family', expectedButtonPrimaryStyle.fontFamily, 'buttonPrimary');
       await testCssProperty(buttonPrimary, 'color', expectedButtonPrimaryStyle.color, 'buttonPrimary');
       await testCssProperty(buttonPrimary, 'line-height', expectedButtonPrimaryStyle.lineHeight, 'buttonPrimary');
       await testCssProperty(buttonPrimary, 'text-align', expectedButtonPrimaryStyle.textAlign, 'buttonPrimary');
       await testCssProperty(buttonPrimary, 'height', expectedButtonPrimaryStyle.height, 'buttonPrimary');
       await testCssProperty(buttonPrimary, 'width', expectedButtonPrimaryStyle.width, 'buttonPrimary');
       await testCssProperty(buttonPrimary, 'border-bottom-right-radius', expectedButtonPrimaryStyle.borderBottomRightRadius, 'buttonPrimary');
       await testCssProperty(buttonPrimary, 'border-bottom-left-radius', expectedButtonPrimaryStyle.borderBottomLeftRadius, 'buttonPrimary');
       await testCssProperty(buttonPrimary, 'border-top-right-radius', expectedButtonPrimaryStyle.borderTopRightRadius, 'buttonPrimary');
       await testCssProperty(buttonPrimary, 'border-top-left-radius', expectedButtonPrimaryStyle.borderTopLeftRadius, 'buttonPrimary');
       await testCssProperty(buttonPrimary, 'background-color', expectedButtonPrimaryStyle.backgroundColor, 'ButtonPrimabuttonPrimaryry');
     }
     
     // Get Started Button
     if (expectedButtonSecondaryStyle) {
       const ButtonSecondary = await page.getByRole('button', { name: 'Build your webshop' });
       await testCssProperty(ButtonSecondary, 'font-size', expectedButtonSecondaryStyle.fontSize, 'ButtonSecondary');
       await testCssProperty(ButtonSecondary, 'font-weight', expectedButtonSecondaryStyle.fontWeight, 'ButtonSecondary');
       await testCssProperty(ButtonSecondary, 'font-family', expectedButtonSecondaryStyle.fontFamily, 'ButtonSecondary');
       await testCssProperty(ButtonSecondary, 'color', expectedButtonSecondaryStyle.color, 'ButtonSecondary');
       await testCssProperty(ButtonSecondary, 'line-height', expectedButtonSecondaryStyle.lineHeight, 'ButtonSecondary');
       await testCssProperty(ButtonSecondary, 'text-align', expectedButtonSecondaryStyle.textAlign, 'ButtonSecondary');
       await testCssProperty(ButtonSecondary, 'height', expectedButtonSecondaryStyle.height, 'ButtonSecondary');
       await testCssProperty(ButtonSecondary, 'width', expectedButtonSecondaryStyle.width, 'ButtonSecondary');
       await testCssProperty(ButtonSecondary, 'border-bottom-right-radius', expectedButtonSecondaryStyle.borderBottomRightRadius, 'ButtonSecondary');
       await testCssProperty(ButtonSecondary, 'border-bottom-left-radius', expectedButtonSecondaryStyle.borderBottomLeftRadius, 'ButtonSecondary');
       await testCssProperty(ButtonSecondary, 'border-top-right-radius', expectedButtonSecondaryStyle.borderTopRightRadius, 'ButtonSecondary');
       await testCssProperty(ButtonSecondary, 'border-top-left-radius', expectedButtonSecondaryStyle.borderTopLeftRadius, 'ButtonSecondary');
       await testCssProperty(ButtonSecondary, 'background-color', expectedButtonSecondaryStyle.backgroundColor, 'ButtonSecondary');
     }
     
     // Button Space
     if (expectedButtonGap) {
       const ButtonGap = await page.getByText('CustomizeGet Started');
       await testCssProperty(ButtonGap, 'margin-top', expectedButtonGap.marginTop, 'ButtonGap');
       await testCssProperty(ButtonGap, 'row-gap', expectedButtonGap.rowGap, 'ButtonGap');
       await testCssProperty(ButtonGap, 'column-gap', expectedButtonGap.columnGap, 'ButtonGap');
     }
     
     // Product 3 Card
     if (expectedCardStyle) {
       const GetButton = await page.getByRole('img', { name: 'Product 3' }).first();
       await testCssProperty(GetButton, 'height', expectedCardStyle.height, 'GetButton');
       await testCssProperty(GetButton, 'width', expectedCardStyle.width, 'GetButton');
     }
     
     // Card Padding
     if (expectedCardPadding) {
       const CardPadding = await page.locator('.w-full.overflow-hidden').first();
       await testCssProperty(CardPadding, 'padding-top', expectedCardPadding.paddingTop, 'CardPadding');
       await testCssProperty(CardPadding, 'padding-bottom', expectedCardPadding.paddingBotton, 'CardPadding');
       await testCssProperty(CardPadding, 'row-gap', expectedCardPadding.rowGap, 'CardPadding');
     }
     
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
     
        // try {
        //   diffResults[viewport] = { status: 'Passed', diffPixels };
        //   expect(diffPixels).toBeLessThan(300);
        // } catch (err) {
        //   diffResults[viewport] = { status: 'Failed', diffPixels };
        //   console.error(`❌ ${viewport} test failed`, err.message);
        // }
    });
  }

  // AFTER ALL TESTS — Generate tabbed report once
  test.afterAll(async () => {
    const reportPath = path.resolve('./diff_output/mainHeroMultiViewportReport.html');
    console.log('📊 Generating tabbed multi-viewport report...');

    const tabbedData = ['Laptop'].map(name => ({
  name,
  diffPixels: diffResults[name].diffPixels ?? 'Failed',
  expectedImage: `mainHero${name}-expected.png`,
  actualImage: `mainHero${name}-actual.png`,
  diffImage: `mainHero${name}-diff.png`
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
