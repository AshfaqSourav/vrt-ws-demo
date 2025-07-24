DemoHero// /utils/HtmlReport/aboutXsolla/demoResult/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'demoResultDesktop-expected.png',
  actualImage = 'demoResultDesktop-actual.png',
  diffImage = 'demoResultDesktop-diff.png',
  pageName = 'Demo Result Desktop'
}) {
  const html = createHtmlTemplate({
    pageName,
    diffPixels,
    expectedImage,
    actualImage,
    diffImage
  });

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(reportPath, html);
}
