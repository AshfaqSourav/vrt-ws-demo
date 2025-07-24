// /utils/HtmlReport/Webshop/capAuthForm/capAuthForm/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthFormTablet-expected.png',
  actualImage = 'capAuthFormTablet-actual.png',
  diffImage = 'capAuthFormTablet-diff.png',
  pageName = 'capAuthForm Tablet'
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
