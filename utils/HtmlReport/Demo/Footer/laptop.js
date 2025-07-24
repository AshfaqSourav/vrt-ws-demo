// /utils/HtmlReport/Demo/Footer/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'demoFooterLaptop-expected.png',
  actualImage = 'demoFooterLaptop-actual.png',
  diffImage = 'demoFooterLaptop-diff.png',
  pageName = 'Demo Footer Laptop'
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
