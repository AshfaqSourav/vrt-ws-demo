// /utils/HtmlReport/Webshop/Capabilities/storefront/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'storefrontMobile-expected.png',
  actualImage = 'storefrontMobile-actual.png',
  diffImage = 'storefrontMobile-diff.png',
  pageName = 'Storefront Mobile'
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
