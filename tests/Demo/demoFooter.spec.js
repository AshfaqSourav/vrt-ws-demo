import { test, expect } from '@playwright/test';
import { DemoFooterPage } from '../../pages/Demo/DemoFooterPage.js';
import { compareScreenshots } from '../../utils/compareScreenShots.js';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/Demo/Footer/laptop.js';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/Demo/Footer/mobile.js';
import { generateHtmlReport as generateTabbedReportHtml } from '../../utils/HtmlReport/generateTabbedReport.js';
import { scrollPage } from '../../utils/scrollUtils.js';
import { DemoFooterStyles } from '../../utils/cssProperties/Demo/DemoFooterStyles.js';
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
    expectedPath: './expected_screenshots/demoFooter/demoFooterLaptopFigma.png',
    htmlGen: generateLaptopHtml
  },

  {
    name: 'Mobile',
    expectedPath: './expected_screenshots/demoFooter/demoFooterMobileFigma.png',
    htmlGen: generateMobileHtml
  }
];

// SERIAL BLOCK — Ensures tests run one after another
test.describe.serial('Demo Footer VRT Suite', () => {
  for (const { name: viewport, expectedPath, htmlGen } of viewports) {
    test(`${viewport} - Demo Footer visual should match Figma`, async ({ page }) => { 
      const demoFooter = new DemoFooterPage(page, viewport);
      await demoFooter.goto();
      await scrollPage(page);

      const { cropped } = await demoFooter.takeScreenshot();
      const actualBuffer = fs.readFileSync(cropped);

      const diffPixels = compareScreenshots({
        actualBuffer,
        expectedPath,
        actualPath: `${diffDir}/demoFooter${viewport}-actual.png`,
        diffPath: `${diffDir}/demoFooter${viewport}-diff.png`,
        expectedCopyPath: `${diffDir}/demoFooter${viewport}-expected.png`
      });

      diffResults[viewport] = diffPixels;

      htmlGen({
        diffPixels,
        outputDir: diffDir,
        reportPath: `${diffDir}/demoFooter${viewport}-report.html`,
        pageName: `Demo Footer ${viewport}`
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

const expectedTitleStyle = DemoFooterStyles?.Menu?.title?.[viewport];
const expectedSubtitleStyle = DemoFooterStyles?.Menu?.subtitle?.[viewport];
const expectedMenuColumnGap = DemoFooterStyles?.Menu?.menuColumnGap?.[viewport];   
const expectedGapBetweenMenus = DemoFooterStyles?.Menu?.gapBetweenMenus?.[viewport];
const expectedSideMargin = DemoFooterStyles?.Menu?.sideMargin?.[viewport];
const expectedTopPadding = DemoFooterStyles?.Menu?.topPadding?.[viewport];
const expectedXsollalogo = DemoFooterStyles?.Menu?.xsollalogo?.[viewport];
const expectedSociallogo = DemoFooterStyles?.Menu?.sociallogo?.[viewport];
const expectedSociallogoGap = DemoFooterStyles?.Menu?.sociallogoGap?.[viewport];
const expectedFormTitle = DemoFooterStyles?.Menu?.formTitle?.[viewport];
const expectedFormSubTitle = DemoFooterStyles?.Menu?.formSubTitle?.[viewport];
const expectedFormPadding = DemoFooterStyles?.Menu?.formPadding?.[viewport];
const expectedFormField = DemoFooterStyles?.Menu?.formField?.[viewport];
const expectedSignUpButton = DemoFooterStyles?.Menu?.signUpButton?.[viewport];
const expectedDisclaimerText = DemoFooterStyles?.Menu?.disclaimerText?.[viewport];

// Menu Title
if (expectedTitleStyle) {
  const MenuTitle = await page.getByRole('heading', { name: 'Products' });
  await testCssProperty(MenuTitle, 'font-size', expectedTitleStyle.fontSize, 'MenuTitle');
  await testCssProperty(MenuTitle, 'font-weight', expectedTitleStyle.fontWeight, 'MenuTitle');
  await testCssProperty(MenuTitle, 'font-family', expectedTitleStyle.fontFamily, 'MenuTitle');
  await testCssProperty(MenuTitle, 'color', expectedTitleStyle.color, 'MenuTitle');
  await testCssProperty(MenuTitle, 'line-height', expectedTitleStyle.lineHeight, 'MenuTitle');
  await testCssProperty(MenuTitle, 'margin-bottom', expectedTitleStyle.marginBottom, 'MenuTitle');
}

// // Menu Subtitle

if (expectedSubtitleStyle) {
  const MenuSubtitle = await page.getByRole('paragraph').filter({ hasText: 'Pay Station' });
  await testCssProperty(MenuSubtitle, 'font-size', expectedSubtitleStyle.fontSize, 'MenuSubtitle');
  await testCssProperty(MenuSubtitle, 'font-weight', expectedSubtitleStyle.fontWeight, 'MenuSubtitle');
  await testCssProperty(MenuSubtitle, 'font-family', expectedSubtitleStyle.fontFamily, 'MenuSubtitle');
  await testCssProperty(MenuSubtitle, 'color', expectedSubtitleStyle.color, 'MenuSubtitle');
  await testCssProperty(MenuSubtitle, 'line-height', expectedSubtitleStyle.lineHeight, 'MenuSubtitle');
  await testCssProperty(MenuSubtitle, 'margin-bottom', expectedSubtitleStyle.marginBottom, 'MenuSubtitle');
}
// // Column Gap

if (expectedMenuColumnGap) {                   
  const MenuColumnGap = await page.locator('div').filter({ hasText: 'ProductsPay StationAnti-' }).nth(2);
  await testCssProperty(MenuColumnGap, 'column-gap', expectedMenuColumnGap.columnGap, 'MenuColumnGap');

}

//Gap Between Menus

if (expectedGapBetweenMenus) {                  
  const GapBetweenMenus = await page.getByRole('contentinfo').locator('div').filter({ hasText: 'About XsollaAbout UsOur' }).nth(3);
  await testCssProperty(GapBetweenMenus, 'column-gap', expectedGapBetweenMenus.columnGap, 'GapBetweenMenus');
}

// // Side Margin 
if (expectedSideMargin) {                   
  const SideMargin = await page.locator('body > div:nth-child(2) > footer > div.md\\:w-\\[1120px\\].mx-auto.mb-15.md\\:mb-20.px-5.md\\:px-0');;
  await testCssProperty(SideMargin, 'margin-bottom', expectedSideMargin.marginBottom, 'SideMargin');
  await testCssProperty(SideMargin, 'margin-left', expectedSideMargin.marginLeft, 'SideMargin');   //Received: "152.4px", Expected: "160px"
  await testCssProperty(SideMargin, 'margin-right', expectedSideMargin.margiRight, 'SideMargin');   // Missing
  await testCssProperty(SideMargin, 'padding-left', expectedSideMargin.paddingLeft, 'SideMargin');
  await testCssProperty(SideMargin, 'padding-right', expectedSideMargin.paddingRight, 'SideMargin');
}

// // Top Padding

if (expectedTopPadding) {                   
  const TopPadding = await page.getByRole('contentinfo');
  await testCssProperty(TopPadding, 'padding-bottom', expectedTopPadding.paddingBottom, 'TopPadding');
  await testCssProperty(TopPadding, 'padding-top', expectedTopPadding.paddingTop, 'TopPadding');

}
// // Customize Button
// if (expectedCustomizeButtonStyle) {
//   const CustomizeButton = await page.getByRole('button', { name: 'Customize' });
//   await testCssProperty(CustomizeButton, 'font-size', expectedCustomizeButtonStyle.fontSize, 'CustomizeButton');
//   await testCssProperty(CustomizeButton, 'font-weight', expectedCustomizeButtonStyle.fontWeight, 'CustomizeButton');
//   await testCssProperty(CustomizeButton, 'font-family', expectedCustomizeButtonStyle.fontFamily, 'CustomizeButton');
//   await testCssProperty(CustomizeButton, 'color', expectedCustomizeButtonStyle.color, 'CustomizeButton');
//   await testCssProperty(CustomizeButton, 'line-height', expectedCustomizeButtonStyle.lineHeight, 'CustomizeButton');
//   await testCssProperty(CustomizeButton, 'text-align', expectedCustomizeButtonStyle.textAlign, 'CustomizeButton');
//   await testCssProperty(CustomizeButton, 'height', expectedCustomizeButtonStyle.height, 'CustomizeButton');
//   await testCssProperty(CustomizeButton, 'width', expectedCustomizeButtonStyle.width, 'CustomizeButton');
//   await testCssProperty(CustomizeButton, 'border-bottom-right-radius', expectedCustomizeButtonStyle.borderBottomRightRadius, 'CustomizeButton');
//   await testCssProperty(CustomizeButton, 'border-bottom-left-radius', expectedCustomizeButtonStyle.borderBottomLeftRadius, 'CustomizeButton');
//   await testCssProperty(CustomizeButton, 'border-top-right-radius', expectedCustomizeButtonStyle.borderTopRightRadius, 'CustomizeButton');
//   await testCssProperty(CustomizeButton, 'border-top-left-radius', expectedCustomizeButtonStyle.borderTopLeftRadius, 'CustomizeButton');
//   await testCssProperty(CustomizeButton, 'background-color', expectedCustomizeButtonStyle.backgroundColor, 'CustomizeButton');
// }

// // Get Started Button
// if (expectedGetStartedButton) {
//   const GetStartedButton = await page.getByRole('button', { name: 'Get Started' });
//   await testCssProperty(GetStartedButton, 'font-size', expectedGetStartedButton.fontSize, 'GetStartedButton');
//   await testCssProperty(GetStartedButton, 'font-weight', expectedGetStartedButton.fontWeight, 'GetStartedButton');
//   await testCssProperty(GetStartedButton, 'font-family', expectedGetStartedButton.fontFamily, 'GetStartedButton');
//   await testCssProperty(GetStartedButton, 'color', expectedGetStartedButton.color, 'GetStartedButton');
//   await testCssProperty(GetStartedButton, 'line-height', expectedGetStartedButton.lineHeight, 'GetStartedButton');
//   await testCssProperty(GetStartedButton, 'text-align', expectedGetStartedButton.textAlign, 'GetStartedButton');
//   await testCssProperty(GetStartedButton, 'height', expectedGetStartedButton.height, 'GetStartedButton');
//   await testCssProperty(GetStartedButton, 'width', expectedGetStartedButton.width, 'GetStartedButton');
//   await testCssProperty(GetStartedButton, 'border-bottom-right-radius', expectedGetStartedButton.borderBottomRightRadius, 'GetStartedButton');
//   await testCssProperty(GetStartedButton, 'border-bottom-left-radius', expectedGetStartedButton.borderBottomLeftRadius, 'GetStartedButton');
//   await testCssProperty(GetStartedButton, 'border-top-right-radius', expectedGetStartedButton.borderTopRightRadius, 'GetStartedButton');
//   await testCssProperty(GetStartedButton, 'border-top-left-radius', expectedGetStartedButton.borderTopLeftRadius, 'GetStartedButton');
//   await testCssProperty(GetStartedButton, 'background-color', expectedGetStartedButton.backgroundColor, 'GetStartedButton');
// }

// // Button Space
// if (expectedButtonGap) {
//   const ButtonGap = await page.getByText('CustomizeGet Started');
//   await testCssProperty(ButtonGap, 'margin-top', expectedButtonGap.marginTop, 'ButtonGap');
//   await testCssProperty(ButtonGap, 'row-gap', expectedButtonGap.rowGap, 'ButtonGap');
//   await testCssProperty(ButtonGap, 'column-gap', expectedButtonGap.columnGap, 'ButtonGap');
// }

// // Product 3 Card
// if (expectedCardStyle) {
//   const GetButton = await page.getByRole('img', { name: 'Product 3' }).first();
//   await testCssProperty(GetButton, 'height', expectedCardStyle.height, 'GetButton');
//   await testCssProperty(GetButton, 'width', expectedCardStyle.width, 'GetButton');
// }

// // Card Padding
// if (expectedCardPadding) {
//   const CardPadding = await page.locator('.w-full.overflow-hidden').first();
//   await testCssProperty(CardPadding, 'padding-top', expectedCardPadding.paddingTop, 'CardPadding');
//   await testCssProperty(CardPadding, 'padding-bottom', expectedCardPadding.paddingBotton, 'CardPadding');
//   await testCssProperty(CardPadding, 'row-gap', expectedCardPadding.rowGap, 'CardPadding');
// }

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

    const tabbedData = ['Laptop', 'Mobile'].map(name => ({
  name,
  diffPixels: diffResults[name].diffPixels ?? 'Failed',
  expectedImage: `demoFooter${name}-expected.png`,
  actualImage: `demoFooter${name}-actual.png`,
  diffImage: `demoFooter${name}-diff.png`
}));

generateTabbedReportHtml({
  outputDir: diffDir,
  reportPath,
  pageName: 'Demo Footer',
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