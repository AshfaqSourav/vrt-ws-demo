// /utils/HtmlReport/Webshop/mainHero/mainHero/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainHeroTablet-expected.png',
  actualImage = 'mainHeroTablet-actual.png',
  diffImage = 'mainHeroTablet-diff.png',
  pageName = 'MainHero Tablet'
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
