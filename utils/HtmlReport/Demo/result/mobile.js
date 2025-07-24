// /utils/HtmlReport/aboutXsolla/demoResult/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'demoResultMobile-expected.png',
  actualImage = 'demoResultMobile-actual.png',
  diffImage = 'demoResultMobile-diff.png',
  pageName = 'Demo Result Mobile'
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
