// /utils/HtmlReport/aboutXsolla/aboutUs/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'aboutUsMobile-expected.png',
  actualImage = 'aboutUsMobile-actual.png',
  diffImage = 'aboutUsMobile-diff.png',
  pageName = 'About Us Mobile'
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
