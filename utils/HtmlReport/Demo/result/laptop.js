// /utils/HtmlReport/aboutXsolla/demoResult/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'demoResultLaptop-expected.png',
  actualImage = 'demoResultLaptop-actual.png',
  diffImage = 'demoResultLaptop-diff.png',
  pageName = 'Demo Result Laptop'
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
