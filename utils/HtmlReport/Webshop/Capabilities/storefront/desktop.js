// /utils/HtmlReport/Webshop/Capabilities/storefront/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'storefrontDesktop-expected.png',
  actualImage = 'storefrontDesktop-actual.png',
  diffImage = 'storefrontDesktop-diff.png',
  pageName = 'Storefront Desktop'
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
