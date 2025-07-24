// /utils/HtmlReport/Webshop/capAuthSalesCard/capAuthSalesCard/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthSalesCardMobile-expected.png',
  actualImage = 'capAuthSalesCardMobile-actual.png',
  diffImage = 'capAuthSalesCardMobile-diff.png',
  pageName = 'capAuthSalesCard Mobile'
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
