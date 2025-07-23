// /utils/HtmlReport/Webshop/Capabilities/catalog/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'catalogLaptop-expected.png',
  actualImage = 'catalogLaptop-actual.png',
  diffImage = 'catalogLaptop-diff.png',
  pageName = 'Catalog Laptop'
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
