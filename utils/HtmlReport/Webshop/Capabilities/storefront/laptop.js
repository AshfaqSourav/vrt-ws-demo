// /utils/HtmlReport/Webshop/Capabilities/storefront/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'storefrontLaptop-expected.png',
  actualImage = 'storefrontLaptop-actual.png',
  diffImage = 'storefrontLaptop-diff.png',
  pageName = 'Storefront Laptop'
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
