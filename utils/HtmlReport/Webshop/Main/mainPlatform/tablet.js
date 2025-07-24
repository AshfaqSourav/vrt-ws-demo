// /utils/HtmlReport/Webshop/mainPlatform/mainPlatform/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainPlatformTablet-expected.png',
  actualImage = 'mainPlatformTablet-actual.png',
  diffImage = 'mainPlatformTablet-diff.png',
  pageName = 'Main Platform Tablet'
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
