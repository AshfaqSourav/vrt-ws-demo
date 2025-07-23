// /utils/HtmlReport/Webshop/Capabilities/buy/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'buyDesktop-expected.png',
  actualImage = 'buyDesktop-actual.png',
  diffImage = 'buyDesktop-diff.png',
  pageName = 'Buy Desktop'
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
