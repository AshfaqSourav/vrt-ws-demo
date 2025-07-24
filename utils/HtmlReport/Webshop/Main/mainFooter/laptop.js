import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainFooterLaptop-expected.png',
  actualImage = 'mainFooterLaptop-actual.png',
  diffImage = 'mainFooterLaptop-diff.png',
  pageName = 'footer Laptop'
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
