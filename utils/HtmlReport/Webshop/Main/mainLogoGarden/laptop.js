// /utils/HtmlReport/Webshop/mainLogoGarden/mainLogoGarden/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainLogoGardenLaptop-expected.png',
  actualImage = 'mainLogoGardenLaptop-actual.png',
  diffImage = 'mainLogoGardenLaptop-diff.png',
  pageName = 'Main LogoGarden Laptop'
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
