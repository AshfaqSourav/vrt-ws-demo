// /path/to/AboutUsPage.js

import dotenv from 'dotenv';
import { getEnabledViewports } from '../../utils/viewPorts.js';
import { scrollPage } from '../../utils/scrollUtils.js';
import { acceptCookiesIfVisible } from '../../utils/cookies.js';
import { maskEverythingExcept , cropElement , cropWhiteMargins } from '../../utils/domUtils';


dotenv.config();

const viewportSizes = getEnabledViewports(4);
const selector = 'html';

export class DemoHomePage {
  constructor(page, viewport) {
    this.page = page;
    this.viewport = viewport;
  }

  async goto() {
    await this.page.goto(`${process.env.BASE_URL}`, {
      waitUntil: 'networkidle'
    });
    await this.page.waitForTimeout(1000);
    await acceptCookiesIfVisible(this.page);
    await this.page.waitForSelector(selector, { timeout: 20000 });
    await scrollPage(this.page);
  }

async takeScreenshot() {
  const size = viewportSizes[this.viewport];
  await this.page.setViewportSize(size);

  const diffDir = './diff_output';
  const maskedFullPagePath = `${diffDir}/demo${this.viewport}-masked-full.png`;
  const croppedElementPath = `${diffDir}/demo${this.viewport}.png`;
  await this.page.waitForTimeout(3000);
  await this.page.waitForSelector(selector, { timeout: 20000 });
  await this.page.$eval(selector, el =>
  el.scrollIntoView({ behavior: 'instant', block: 'center' })
);
await this.page.waitForTimeout(2000);
  await maskEverythingExcept(this.page, selector);
  await this.page.waitForTimeout(2000); 
  await this.page.screenshot({
    path: maskedFullPagePath,
    fullPage: true
  });

  await cropWhiteMargins(maskedFullPagePath, croppedElementPath);

  return {
    cropped: croppedElementPath,
    full: maskedFullPagePath
  };
}
}
