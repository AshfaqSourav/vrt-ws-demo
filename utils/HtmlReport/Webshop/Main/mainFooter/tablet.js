import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainFooterTablet-expected.png',
  actualImage = 'mainFooterTablet-actual.png',
  diffImage = 'mainFooterTablet-diff.png',
  pageName = 'footer Tablet'
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
