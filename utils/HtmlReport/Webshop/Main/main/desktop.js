// /utils/HtmlReport/aboutXsolla/aboutUs/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'aboutUsDesktop-expected.png',
  actualImage = 'aboutUsDesktop-actual.png',
  diffImage = 'aboutUsDesktop-diff.png',
  pageName = 'About Us Desktop'
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
