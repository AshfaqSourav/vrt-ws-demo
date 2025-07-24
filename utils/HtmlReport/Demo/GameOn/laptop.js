// /utils/HtmlReport/Demo/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'demoGameOnLaptop-expected.png',
  actualImage = 'demoGameOnLaptop-actual.png',
  diffImage = 'demoGameOnLaptop-diff.png',
  pageName = 'Demo Game On Laptop'
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
