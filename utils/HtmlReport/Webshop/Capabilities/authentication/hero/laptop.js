// /utils/HtmlReport/Webshop/capAuthHero/capAuthHero/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthHeroLaptop-expected.png',
  actualImage = 'capAuthHeroLaptop-actual.png',
  diffImage = 'capAuthHeroLaptop-diff.png',
  pageName = 'capAuthHero Laptop'
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
