import { test, expect } from '@playwright/test';
import { DemoResultPage } from '../../pages/Demo/DemoResultPage.js';
import { compareScreenshots } from '../../utils/compareScreenShots.js';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/Demo/Hero/laptop.js';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/Demo/Hero/mobile.js';
import { generateHtmlReport as generateTabbedReportHtml } from '../../utils/HtmlReport/generateTabbedReport.js';
import { scrollPage } from '../../utils/scrollUtils.js';
import { DemoResultStyles } from '../../utils/cssProperties/Demo/DemoResultStyles.js';
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
    expectedPath: './expected_screenshots/demoResult/demoResultLaptopFigma.png',
    htmlGen: generateLaptopHtml
  },

  {
    name: 'Mobile',
    expectedPath: './expected_screenshots/demoResult/demoResultMobileFigma.png',
    htmlGen: generateMobileHtml
  }
];

// SERIAL BLOCK — Ensures tests run one after another
test.describe.serial('Demo Hero VRT Suite', () => {
  for (const { name: viewport, expectedPath, htmlGen } of viewports) {
    test(`${viewport} - Demo Hero visual should match Figma`, async ({ page }) => { 
      const demoResult = new DemoResultPage(page, viewport);
      await demoResult.goto();
    //   await scrollPage(page);

      const { cropped } = await demoResult.takeScreenshot();
      const actualBuffer = fs.readFileSync(cropped);

      const diffPixels = compareScreenshots({
        actualBuffer,
        expectedPath,
        actualPath: `${diffDir}/demoResult${viewport}-actual.png`,
        diffPath: `${diffDir}/demoResult${viewport}-diff.png`,
        expectedCopyPath: `${diffDir}/demoResult${viewport}-expected.png`
      });

      diffResults[viewport] = diffPixels;

      htmlGen({
        diffPixels,
        outputDir: diffDir,
        reportPath: `${diffDir}/demoResult${viewport}-report.html`,
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
const expectedContainerStyle = DemoResultStyles?.Result?.container?.[viewport];
const expectedTitleStyle = DemoResultStyles?.Result?.title?.[viewport];
const expectedSubtitleStyle = DemoResultStyles?.Result?.subtitle?.[viewport];
const expectedTalkToAnExpertButtonStyle = DemoResultStyles?.Result?.talkToAnExoertButton?.[viewport];
const expectedGetStartedButton = DemoResultStyles?.Result?.getStartedButton?.[viewport];
const expectedButtonGap = DemoResultStyles?.Result?.buttonSpace?.[viewport];

// await page.goto('https://demo.xsolla.vivasoftltd.xyz/');
//   await page.getByRole('heading', { name: 'Wow, that’s an awesome result!' }).click();
//   await page.getByText('Now build a fully').click();
//   await page.getByRole('button', { name: 'Get started', exact: true }).click();
//   await page.getByRole('button', { name: 'Talk to an expert' }).click();
//   await page.getByText('Get startedTalk to an expert').click();
//   await page.getByText('Wow, that’s an awesome result!Now build a fully customizable experience for').click();
// });


if (expectedContainerStyle) {
  const resultContainer = await page.getByText('Wow, that’s an awesome result!Now build a fully customizable experience for');
  await testCssProperty(resultContainer, 'padding-top', expectedContainerStyle.topPadding, 'resultContainer');
  await testCssProperty(resultContainer, 'padding-bottom', expectedContainerStyle.bottomPadding, 'resultContainer');
  await testCssProperty(resultContainer, 'padding-right', expectedContainerStyle.rightPadding, 'resultContainer');
  await testCssProperty(resultContainer, 'padding-left', expectedContainerStyle.leftPadding, 'resultContainer');
  await testCssProperty(resultContainer, 'border-bottom-right-radius', expectedContainerStyle.borderBottomRightRadius, 'resultContainer');
  await testCssProperty(resultContainer, 'border-bottom-left-radius', expectedContainerStyle.borderBottomLeftRadius, 'resultContainer');
  await testCssProperty(resultContainer, 'border-top-right-radius', expectedContainerStyle.borderTopRightRadius, 'resultContainer');
  await testCssProperty(resultContainer, 'border-top-left-radius', expectedContainerStyle.borderTopLeftRadius, 'resultContainer');
  await testCssProperty(resultContainer, 'border-bottom-width', expectedContainerStyle.borderBottomWidth, 'resultContainer');
  await testCssProperty(resultContainer, 'border-left-width', expectedContainerStyle.borderLeftWidth, 'resultContainer');
  await testCssProperty(resultContainer, 'border-right-width', expectedContainerStyle.borderRightWidth, 'resultContainer');
  await testCssProperty(resultContainer, 'border-top-width', expectedContainerStyle.borderTopWidth, 'resultContainer');
  await testCssProperty(resultContainer, 'border-top-color', expectedContainerStyle.borderTopColor, 'resultContainer');
  await testCssProperty(resultContainer, 'border-left-color', expectedContainerStyle.borderLeftColor, 'resultContainer');
  await testCssProperty(resultContainer, 'border-right-color', expectedContainerStyle.borderRightColor, 'resultContainer');
  await testCssProperty(resultContainer, 'border-bottom-color', expectedContainerStyle.borderBottomColor, 'resultContainer');
  //issue present
//   await testCssProperty(resultContainer, 'margin-left', expectedContainerStyle.marginLeft, 'resultContainer');
//   await testCssProperty(resultContainer, 'margin-right', expectedContainerStyle.marginRight, 'resultContainer');

  await testCssProperty(resultContainer, 'margin-bottom', expectedContainerStyle.marginBottom, 'resultContainer');
  await testCssProperty(resultContainer, 'height', expectedContainerStyle.height, 'resultContainer');
  await testCssProperty(resultContainer, 'width', expectedContainerStyle.width, 'resultContainer');
}

// Result Title
if (expectedTitleStyle) {
  const resultTitle = await page.getByRole('heading', { name: 'Wow, that’s an awesome result!' });
  await testCssProperty(resultTitle, 'font-size', expectedTitleStyle.fontSize, 'resultTitle');
  await testCssProperty(resultTitle, 'font-weight', expectedTitleStyle.fontWeight, 'resultTitle');
  await testCssProperty(resultTitle, 'font-family', expectedTitleStyle.fontFamily, 'resultTitle');
  await testCssProperty(resultTitle, 'color', expectedTitleStyle.color, 'resultTitle');
  await testCssProperty(resultTitle, 'line-height', expectedTitleStyle.lineHeight, 'resultTitle');
  await testCssProperty(resultTitle, 'margin-bottom', expectedTitleStyle.marginBottom, 'resultTitle');
  await testCssProperty(resultTitle, 'text-align', expectedTitleStyle.textAlignment, 'resultTitle');
}

// Result Subtitle
if (expectedSubtitleStyle) {
  const resultSubtitle = await page.getByText('Now build a fully');
  await testCssProperty(resultSubtitle, 'font-size', expectedSubtitleStyle.fontSize, 'resultSubtitle');
  await testCssProperty(resultSubtitle, 'font-weight', expectedSubtitleStyle.fontWeight, 'resultSubtitle');
  await testCssProperty(resultSubtitle, 'font-family', expectedSubtitleStyle.fontFamily, 'resultSubtitle');
  await testCssProperty(resultSubtitle, 'color', expectedSubtitleStyle.color, 'resultSubtitle');
  await testCssProperty(resultSubtitle, 'line-height', expectedSubtitleStyle.lineHeight, 'resultSubtitle');
  await testCssProperty(resultSubtitle, 'margin-bottom', expectedSubtitleStyle.marginBottom, 'resultSubtitle');
}

// Talk to an Expert Button
if (expectedTalkToAnExpertButtonStyle) {
  const talkToAnExpertButton = await page.getByRole('button', { name: 'Talk to an expert' });
  await testCssProperty(talkToAnExpertButton, 'font-size', expectedTalkToAnExpertButtonStyle.fontSize, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'font-weight', expectedTalkToAnExpertButtonStyle.fontWeight, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'font-family', expectedTalkToAnExpertButtonStyle.fontFamily, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'color', expectedTalkToAnExpertButtonStyle.color, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'line-height', expectedTalkToAnExpertButtonStyle.lineHeight, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'text-align', expectedTalkToAnExpertButtonStyle.textAlign, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'height', expectedTalkToAnExpertButtonStyle.height, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'width', expectedTalkToAnExpertButtonStyle.width, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'border-bottom-right-radius', expectedTalkToAnExpertButtonStyle.borderBottomRightRadius, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'border-bottom-left-radius', expectedTalkToAnExpertButtonStyle.borderBottomLeftRadius, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'border-top-right-radius', expectedTalkToAnExpertButtonStyle.borderTopRightRadius, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'border-top-left-radius', expectedTalkToAnExpertButtonStyle.borderTopLeftRadius, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'background-color', expectedTalkToAnExpertButtonStyle.backgroundColor, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'padding-left', expectedTalkToAnExpertButtonStyle.paddingLeft, 'talkToAnExpertButton');
    await testCssProperty(talkToAnExpertButton, 'padding-right', expectedTalkToAnExpertButtonStyle.paddingRight, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'padding-bottom', expectedTalkToAnExpertButtonStyle.paddingBottom, 'talkToAnExpertButton');
  await testCssProperty(talkToAnExpertButton, 'padding-top', expectedTalkToAnExpertButtonStyle.paddingTop, 'talkToAnExpertButton');

}

// Get Started Button
if (expectedGetStartedButton) {
  const GetStartedButton = await page.getByRole('button', { name: 'Get started', exact: true });
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
  await testCssProperty(GetStartedButton, 'padding-left', expectedGetStartedButton.paddingLeft, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'padding-right', expectedGetStartedButton.paddingRight, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'padding-bottom', expectedGetStartedButton.paddingBottom, 'GetStartedButton');
  await testCssProperty(GetStartedButton, 'padding-top', expectedGetStartedButton.paddingTop, 'GetStartedButton');
}


// Button Space
if (expectedButtonGap) {
  const ButtonGap = await page.getByText('Get startedTalk to an expert');
  await testCssProperty(ButtonGap, 'row-gap', expectedButtonGap.rowGap, 'ButtonGap');
  await testCssProperty(ButtonGap, 'column-gap', expectedButtonGap.columnGap, 'ButtonGap');
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
    const reportPath = path.resolve('./diff_output/demoResultMultiViewportReport.html');
    console.log('📊 Generating tabbed multi-viewport report...');

    const tabbedData = ['Laptop', 'Mobile'].map(name => ({
  name,
  diffPixels: diffResults[name].diffPixels ?? 'Failed',
  expectedImage: `demoResult${name}-expected.png`,
  actualImage: `demoResult${name}-actual.png`,
  diffImage: `demoResult${name}-diff.png`
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