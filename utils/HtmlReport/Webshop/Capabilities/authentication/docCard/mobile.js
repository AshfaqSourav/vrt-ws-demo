// /utils/HtmlReport/Webshop/capAuthDocCard/capAuthDocCard/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthDocCardMobile-expected.png',
  actualImage = 'capAuthDocCardMobile-actual.png',
  diffImage = 'capAuthDocCardMobile-diff.png',
  pageName = 'capAuthDocCard Mobile'
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
