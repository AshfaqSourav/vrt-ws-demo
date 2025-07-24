// /utils/HtmlReport/Webshop/mainLogoGarden/mainLogoGarden/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainLogoGardenMobile-expected.png',
  actualImage = 'mainLogoGardenMobile-actual.png',
  diffImage = 'mainLogoGardenMobile-diff.png',
  pageName = 'Main LogoGarden Mobile'
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
