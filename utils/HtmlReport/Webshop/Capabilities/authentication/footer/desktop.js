// /utils/HtmlReport/Webshop/capAuth/capAuth/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthFooterDesktop-expected.png',
  actualImage = 'capAuthFooterDesktop-actual.png',
  diffImage = 'capAuthFooterDesktop-diff.png',
  pageName = 'capAuth Footer Desktop'
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
