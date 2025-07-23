// /utils/HtmlReport/Webshop/mainHero/mainHero/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainHeroLaptop-expected.png',
  actualImage = 'mainHeroLaptop-actual.png',
  diffImage = 'mainHeroLaptop-diff.png',
  pageName = 'MainHero Laptop'
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
