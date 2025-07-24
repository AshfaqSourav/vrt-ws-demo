// /utils/HtmlReport/Webshop/capAuthForm/capAuthForm/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthFormMobile-expected.png',
  actualImage = 'capAuthFormMobile-actual.png',
  diffImage = 'capAuthFormMobile-diff.png',
  pageName = 'capAuthForm Mobile'
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
