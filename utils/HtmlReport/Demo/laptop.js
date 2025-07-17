// /utils/HtmlReport/Demo/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'demoLaptop-expected.png',
  actualImage = 'demoLaptop-actual.png',
  diffImage = 'demoLaptop-diff.png',
  pageName = 'Demo Laptop'
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
