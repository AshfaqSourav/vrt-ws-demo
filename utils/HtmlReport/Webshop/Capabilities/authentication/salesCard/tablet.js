// /utils/HtmlReport/Webshop/capAuthSalesCard/capAuthSalesCard/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthSalesCardTablet-expected.png',
  actualImage = 'capAuthSalesCardTablet-actual.png',
  diffImage = 'capAuthSalesCardTablet-diff.png',
  pageName = 'capAuthSalesCard Tablet'
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
