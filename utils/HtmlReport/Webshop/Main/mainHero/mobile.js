// /utils/HtmlReport/Webshop/mainHero/mainHero/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainHeroMobile-expected.png',
  actualImage = 'mainHeroMobile-actual.png',
  diffImage = 'mainHeroMobile-diff.png',
  pageName = 'MainHero Mobile'
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
