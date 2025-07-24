// /utils/HtmlReport/Webshop/Main/main/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainPlatformDesktop-expected.png',
  actualImage = 'mainPlatformDesktop-actual.png',
  diffImage = 'mainPlatformDesktop-diff.png',
  pageName = 'Main Platform Desktop'
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
