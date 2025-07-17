import { test, expect } from '@playwright/test';
import { DemoHeroPage } from '../../pages/Demo/DemoHeroPage.js';
import { compareScreenshots } from '../../utils/compareScreenShots.js';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/Demo/Hero/laptop.js';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/Demo/Hero/mobile.js';
import { generateHtmlReport as generateTabbedReportHtml } from '../../utils/HtmlReport/generateTabbedReport.js';
import { scrollPage } from '../../utils/scrollUtils.js';
import { DemoHeroStyles } from '../../utils/cssProperties/Demo/DemoHeroStyles.js';
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
    expectedPath: './expected_screenshots/demoHero/demoHeroDesktopFigma.png',
    htmlGen: generateLaptopHtml
  },

  {
    name: 'Mobile',
    expectedPath: './expected_screenshots/demoHero/demoHeroMobileFigma.png',
    htmlGen: generateMobileHtml
  }
];

// SERIAL BLOCK — Ensures tests run one after another
test.describe.serial('Demo Hero VRT Suite', () => {
  for (const { name: viewport, expectedPath, htmlGen } of viewports) {
    test(`${viewport} - Demo Hero visual should match Figma`, async ({ page }) => { 
      const demoHero = new DemoHeroPage(page, viewport);
      await demoHero.goto();
      await scrollPage(page);

      const { cropped } = await demoHero.takeScreenshot();
      const actualBuffer = fs.readFileSync(cropped);

      const diffPixels = compareScreenshots({
        actualBuffer,
        expectedPath,
        actualPath: `${diffDir}/demoHero${viewport}-actual.png`,
        diffPath: `${diffDir}/demoHero${viewport}-diff.png`,
        expectedCopyPath: `${diffDir}/demoHero${viewport}-expected.png`
      });

      diffResults[viewport] = diffPixels;

      htmlGen({
        diffPixels,
        outputDir: diffDir,
        reportPath: `${diffDir}/demoHero${viewport}-report.html`,
        pageName: `Demo Hero ${viewport}`
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

const expectedTitleStyle = DemoHeroStyles?.Hero?.title?.[viewport];
const expectedSubtitleStyle = DemoHeroStyles?.Hero?.subtitle?.[viewport];
const expectedCustomizeButtonStyle = DemoHeroStyles?.Hero?.customizeButton?.[viewport];
const expectedGetStartedButton = DemoHeroStyles?.Hero?.getStartedButton?.[viewport];
const expectedButtonGap = DemoHeroStyles?.Hero?.buttonSpace?.[viewport];
const expectedCardStyle = DemoHeroStyles?.Hero?.CardSize?.[viewport];
const expectedCardPadding = DemoHeroStyles?.Hero?.cardPadding?.[viewport];

// Hero Title
if (expectedTitleStyle) {
  const heroTitle = await page.getByRole('heading', { name: /Advanced customization/i });
  await testCssProperty(heroTitle, 'font-size', expectedTitleStyle.fontSize, 'heroTitle');
  await testCssProperty(heroTitle, 'font-weight', expectedTitleStyle.fontWeight, 'heroTitle');
  await testCssProperty(heroTitle, 'font-family', expectedTitleStyle.fontFamily, 'heroTitle');
  await testCssProperty(heroTitle, 'color', expectedTitleStyle.color, 'heroTitle');
  await testCssProperty(heroTitle, 'line-height', expectedTitleStyle.lineHeight, 'heroTitle');
  await testCssProperty(heroTitle, 'padding-top', expectedTitleStyle.paddingTop, 'heroTitle');
}

// Hero Subtitle
if (expectedSubtitleStyle) {
  const heroSubtitle = await page.getByText('Shape and configure your own');
  await testCssProperty(heroSubtitle, 'font-size', expectedSubtitleStyle.fontSize, 'heroSubtitle');
  await testCssProperty(heroSubtitle, 'font-weight', expectedSubtitleStyle.fontWeight, 'heroSubtitle');
  await testCssProperty(heroSubtitle, 'font-family', expectedSubtitleStyle.fontFamily, 'heroSubtitle');
  await testCssProperty(heroSubtitle, 'color', expectedSubtitleStyle.color, 'heroSubtitle');
  await testCssProperty(heroSubtitle, 'line-height', expectedSubtitleStyle.lineHeight, 'heroSubtitle');
  await testCssProperty(heroSubtitle, 'margin-top', expectedSubtitleStyle.lmarginTop, 'heroSubtitle');
}

// Customize Button
if (expectedCustomizeButtonStyle) {
  const CustomizeButton = await page.getByRole('button', { name: 'Customize' });
  await testCssProperty(CustomizeButton, 'font-size', expectedCustomizeButtonStyle.fontSize, 'CustomizeButton');
  await testCssProperty(CustomizeButton, 'font-weight', expectedCustomizeButtonStyle.fontWeight, 'CustomizeButton');
  await testCssProperty(CustomizeButton, 'font-family', expectedCustomizeButtonStyle.fontFamily, 'CustomizeButton');
  await testCssProperty(CustomizeButton, 'color', expectedCustomizeButtonStyle.color, 'CustomizeButton');
  await testCssProperty(CustomizeButton, 'line-height', expectedCustomizeButtonStyle.lineHeight, 'CustomizeButton');
  await testCssProperty(CustomizeButton, 'text-align', expectedCustomizeButtonStyle.textAlign, 'CustomizeButton');
  await testCssProperty(CustomizeButton, 'height', expectedCustomizeButtonStyle.height, 'CustomizeButton');
  await testCssProperty(CustomizeButton, 'width', expectedCustomizeButtonStyle.width, 'CustomizeButton');
  await testCssProperty(CustomizeButton, 'border-bottom-right-radius', expectedCustomizeButtonStyle.borderBottomRightRadius, 'CustomizeButton');
  await testCssProperty(CustomizeButton, 'border-bottom-left-radius', expectedCustomizeButtonStyle.borderBottomLeftRadius, 'CustomizeButton');
  await testCssProperty(CustomizeButton, 'border-top-right-radius', expectedCustomizeButtonStyle.borderTopRightRadius, 'CustomizeButton');
  await testCssProperty(CustomizeButton, 'border-top-left-radius', expectedCustomizeButtonStyle.borderTopLeftRadius, 'CustomizeButton');
  await testCssProperty(CustomizeButton, 'background-color', expectedCustomizeButtonStyle.backgroundColor, 'CustomizeButton');
}

// Get Started Button
if (expectedGetStartedButton) {
  const GetStartedButton = await page.getByRole('button', { name: 'Get Started' });
  await testCssProperty(GetStartedButton, 'font-size', expectedGetStartedButton.fontSize, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'font-weight', expectedGetStartedButton.fontWeight, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'font-family', expectedGetStartedButton.fontFamily, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'color', expectedGetStartedButton.color, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'line-height', expectedGetStartedButton.lineHeight, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'text-align', expectedGetStartedButton.textAlign, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'height', expectedGetStartedButton.height, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'width', expectedGetStartedButton.width, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'border-bottom-right-radius', expectedGetStartedButton.borderBottomRightRadius, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'border-bottom-left-radius', expectedGetStartedButton.borderBottomLeftRadius, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'border-top-right-radius', expectedGetStartedButton.borderTopRightRadius, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'border-top-left-radius', expectedGetStartedButton.borderTopLeftRadius, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'background-color', expectedGetStartedButton.backgroundColor, 'GetStartedButton');
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
    })
  }
  
    // AFTER ALL TESTS — Generate tabbed report once
  test.afterAll(async () => {
    const reportPath = path.resolve('./diff_output/demoHeroMultiViewportReport.html');
    console.log('📊 Generating tabbed multi-viewport report...');

    const tabbedData = ['Laptop', 'Mobile'].map(name => ({
  name,
  diffPixels: diffResults[name].diffPixels ?? 'Failed',
  expectedImage: `demoHero${name}-expected.png`,
  actualImage: `demoHero${name}-actual.png`,
  diffImage: `demoHero${name}-diff.png`
}));

generateTabbedReportHtml({
  outputDir: diffDir,
  reportPath,
  pageName: 'About Us',
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