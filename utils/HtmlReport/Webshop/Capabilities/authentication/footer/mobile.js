// /utils/HtmlReport/Webshop/capAuthFooter/capAuthFooter/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthFooterMobile-expected.png',
  actualImage = 'capAuthFooterMobile-actual.png',
  diffImage = 'capAuthFooterMobile-diff.png',
  pageName = 'capAuthFooter Mobile'
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
