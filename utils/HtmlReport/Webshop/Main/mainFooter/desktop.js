import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainFooterDesktop-expected.png',
  actualImage = 'mainFooterDesktop-actual.png',
  diffImage = 'mainFooterDesktop-diff.png',
  pageName = 'footer Desktop'
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
