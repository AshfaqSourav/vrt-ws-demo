// /utils/HtmlReport/Webshop/Capabilities/global/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'globalDesktop-expected.png',
  actualImage = 'globalDesktop-actual.png',
  diffImage = 'globalDesktop-diff.png',
  pageName = 'Global Desktop'
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
