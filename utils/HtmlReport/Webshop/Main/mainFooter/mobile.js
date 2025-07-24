import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainFooterMobile-expected.png',
  actualImage = 'mainFooterMobile-actual.png',
  diffImage = 'mainFooterMobile-diff.png',
  pageName = 'footer Mobile'
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
