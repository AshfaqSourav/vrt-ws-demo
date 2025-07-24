// /utils/HtmlReport/Webshop/capAuthHero/capAuthHero/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthHeroMobile-expected.png',
  actualImage = 'capAuthHeroMobile-actual.png',
  diffImage = 'capAuthHeroMobile-diff.png',
  pageName = 'capAuthHero Mobile'
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
