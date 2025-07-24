// /utils/HtmlReport/Webshop/capAuth/capAuth/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthSalesCardDesktop-expected.png',
  actualImage = 'capAuthSalesCardDesktop-actual.png',
  diffImage = 'capAuthSalesCardDesktop-diff.png',
  pageName = 'capAuth SalesCard Desktop'
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
