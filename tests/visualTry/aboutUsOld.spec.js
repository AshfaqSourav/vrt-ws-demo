import { test, expect } from '@playwright/test';
import { AboutUsPage } from '../../pages/try/AboutUsPage.js';
import { compareScreenshots } from '../../utils/compareScreenShots.js';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/aboutUs/desktop.js';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/aboutUs/laptop.js';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/aboutUs/tablet.js';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/aboutUs/mobile.js';
import { generateHtmlReport as generateTabbedReportHtml } from '../../utils/HtmlReport/generateTabbedReport.js';
import { scrollPage } from '../../utils/scrollUtils.js';
import { AboutUsStyles } from '../../utils/cssProperties/AboutUsStyles.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const diffDir = './diff_output';
let desktopDiffPixels = 0;
let laptopDiffPixels = 0;
let tabletDiffPixels = 0;
let mobileDiffPixels = 0;

test('A - About Us Desktop visual should match Figma', async ({ page }) => {
  const viewport = 'Desktop';
  const aboutUs = new AboutUsPage(page, viewport);
  await aboutUs.goto();
  await scrollPage(page);

  const { cropped } = await aboutUs.takeScreenshot();
  const actualBuffer = fs.readFileSync(cropped);

  desktopDiffPixels = compareScreenshots({
    actualBuffer,
    expectedPath: './expected_screenshots/aboutUs/aboutUsDesktopFigma.png',
    actualPath: `${diffDir}/aboutUsDesktop-actual.png`,
    diffPath: `${diffDir}/aboutUsDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/aboutUsDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/aboutUsDesktop-report.html`,
    pageName: 'About Us Desktop'
  });

// CSS Expectations
  const heroTitle = page.getByRole('heading', { name: /Gaming’s best/i });
  const heroSpan = heroTitle.locator('span');

  const expectedTitleStyle = AboutUsStyles.Hero.title[viewport];
  const expectedSpanStyle = AboutUsStyles.Hero.highlightSpan[viewport];

  await expect(heroTitle).toHaveCSS('font-size', expectedTitleStyle.fontSize);
  await expect(heroTitle).toHaveCSS('font-weight', expectedTitleStyle.fontWeight);
  await expect(heroTitle).toHaveCSS('color', expectedTitleStyle.color);
  // await expect(heroTitle).toHaveCSS('line-height', expectedTitleStyle.lineHeight);
//   if (expectedTitleStyle.lineHeight) {
//         await expect(heroTitle).toHaveCSS('line-height', expectedTitleStyle.lineHeight);
//       }
  await expect(heroSpan).toHaveCSS('color', expectedSpanStyle.color);


  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - About Us Laptop visual should match Figma', async ({ page }) => {
  const aboutUs = new AboutUsPage(page, 'Laptop');
  await aboutUs.goto();
  await scrollPage(page);

  const { cropped } = await aboutUs.takeScreenshot();
  const actualBuffer = fs.readFileSync(cropped);

  laptopDiffPixels = compareScreenshots({
    actualBuffer,
    expectedPath: './expected_screenshots/aboutUs/aboutUsLaptopFigma.png',
    actualPath: `${diffDir}/aboutUsLaptop-actual.png`,
    diffPath: `${diffDir}/aboutUsLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/aboutUsLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/aboutUsLaptop-report.html`,
    pageName: 'About Us Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - About Us Tablet visual should match Figma', async ({ page }) => {
  const aboutUs = new AboutUsPage(page, 'Tablet');
  await aboutUs.goto();
  await scrollPage(page);

  const { cropped } = await aboutUs.takeScreenshot();
  const actualBuffer = fs.readFileSync(cropped);

  tabletDiffPixels = compareScreenshots({
    actualBuffer,
    expectedPath: './expected_screenshots/aboutUs/aboutUsTabletFigma.png',
    actualPath: `${diffDir}/aboutUsTablet-actual.png`,
    diffPath: `${diffDir}/aboutUsTablet-diff.png`,
    expectedCopyPath: `${diffDir}/aboutUsTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/aboutUsTablet-report.html`,
    pageName: 'About Us Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - About Us Mobile visual should match Figma', async ({ page }) => {
  const aboutUs = new AboutUsPage(page, 'Mobile');
  await aboutUs.goto();
  await scrollPage(page);

  const { cropped } = await aboutUs.takeScreenshot();
  const actualBuffer = fs.readFileSync(cropped);

  mobileDiffPixels = compareScreenshots({
    actualBuffer,
    expectedPath: './expected_screenshots/aboutUs/aboutUsMobileFigma.png',
    actualPath: `${diffDir}/aboutUsMobile-actual.png`,
    diffPath: `${diffDir}/aboutUsMobile-diff.png`,
    expectedCopyPath: `${diffDir}/aboutUsMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/aboutUsMobile-report.html`,
    pageName: 'About Us Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined aboutUs multi-viewport tabbed report', async () => {
    const reportPath = path.resolve('./diff_output/aboutUsMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'About Us',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'aboutUsDesktop-expected.png',
        actualImage: 'aboutUsDesktop-actual.png',
        diffImage: 'aboutUsDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'aboutUsLaptop-expected.png',
        actualImage: 'aboutUsLaptop-actual.png',
        diffImage: 'aboutUsLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'aboutUsTablet-expected.png',
        actualImage: 'aboutUsTablet-actual.png',
        diffImage: 'aboutUsTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'aboutUsMobile-expected.png',
        actualImage: 'aboutUsMobile-actual.png',
        diffImage: 'aboutUsMobile-diff.png'
      }
    ]
  });

  if (fs.existsSync(reportPath)) {
    const isWindows = process.platform === 'win32';
    const isMac = process.platform === 'darwin';
    const isLinux = process.platform === 'linux';

    const openCommand = isWindows
      ? `start "" "${reportPath}"`
      : isMac
      ? `open "${reportPath}"`
      : isLinux
      ? `xdg-open "${reportPath}"`
      : null;

    if (openCommand) {
      await new Promise((resolve) => {
        exec(openCommand, (err) => {
          if (err) console.warn('⚠️ Failed to open browser:', err.message);
          else console.log('✅ Opened visual report in browser');
          resolve(true);
        });
      });
    }
  }
});