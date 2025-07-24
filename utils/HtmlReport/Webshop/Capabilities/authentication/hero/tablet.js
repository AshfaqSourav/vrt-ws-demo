// /utils/HtmlReport/Webshop/capAuthHero/capAuthHero/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthHeroTablet-expected.png',
  actualImage = 'capAuthHeroTablet-actual.png',
  diffImage = 'capAuthHeroTablet-diff.png',
  pageName = 'capAuthHero Tablet'
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
