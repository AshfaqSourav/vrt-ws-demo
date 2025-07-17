// /utils/HtmlReport/aboutXsolla/aboutUs/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'demoHeroMobile-expected.png',
  actualImage = 'emoHeroMobile-actual.png',
  diffImage = 'emoHeroMobile-diff.png',
  pageName = 'Demo Hero Mobile'
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
