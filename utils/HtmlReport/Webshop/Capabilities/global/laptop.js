// /utils/HtmlReport/Webshop/Capabilities/global/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'globalLaptop-expected.png',
  actualImage = 'globalLaptop-actual.png',
  diffImage = 'globalLaptop-diff.png',
  pageName = 'Global Laptop'
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
