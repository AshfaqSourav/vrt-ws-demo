// /utils/HtmlReport/Webshop/Capabilities/storefront/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'storefrontTablet-expected.png',
  actualImage = 'storefrontTablet-actual.png',
  diffImage = 'storefrontTablet-diff.png',
  pageName = 'Storefront Tablet'
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
