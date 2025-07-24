// /utils/HtmlReport/Webshop/mainLogoGarden/mainLogoGarden/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainLogoGardenTablet-expected.png',
  actualImage = 'mainLogoGardenTablet-actual.png',
  diffImage = 'mainLogoGardenTablet-diff.png',
  pageName = 'Main LogoGarden Tablet'
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
