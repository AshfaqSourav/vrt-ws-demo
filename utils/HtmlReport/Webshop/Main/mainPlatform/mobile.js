// /utils/HtmlReport/Webshop/mainPlatform/mainPlatform/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainPlatformMobile-expected.png',
  actualImage = 'mainPlatformMobile-actual.png',
  diffImage = 'mainPlatformMobile-diff.png',
  pageName = 'Main Platform Mobile'
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
