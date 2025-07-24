// /utils/HtmlReport/aboutXsolla/demoResult/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'demoResultTablet-expected.png',
  actualImage = 'demoResultTablet-actual.png',
  diffImage = 'demoResultTablet-diff.png',
  pageName = 'Demo Result Tablet'
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
