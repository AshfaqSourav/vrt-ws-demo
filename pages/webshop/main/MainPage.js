// /path/to/MainPage.js

import dotenv from 'dotenv';
import { getEnabledViewports } from '../../../utils/viewPorts.js';
import { scrollPage } from '../../../utils/scrollUtils.js';
import { maskEverythingExcept , cropElement , cropWhiteMargins } from '../../../utils/domUtils.js';

dotenv.config();

const viewportSizes = getEnabledViewports(4); // 👈 Update count or keys as needed
const selector = '.sc-hQQqCA.dNoXjt';
export class MainPage {
  constructor(page, viewport) {
    this.page = page;
    this.viewport = viewport;
  }

  async goto() {
    await this.page.goto(`${process.env.BASE_URL}/home`, {
      waitUntil: 'networkidle'
    });
    await this.page.waitForTimeout(1000);
    await this.page.waitForSelector(selector, { timeout: 20000 });
    // await scrollPage(this.page);
  }

async takeScreenshot() {
  const size = viewportSizes[this.viewport];
  await this.page.setViewportSize(size);
  await this.page.waitForTimeout(2000);
  await scrollPage(this.page);

  const diffDir = './diff_output';
  const maskedFullPagePath = `${diffDir}/main${this.viewport}-actual.png`;

  const elementHandle = await this.page.$(selector);
    await elementHandle.screenshot({
    path: maskedFullPagePath
});
  return {
    cropped: maskedFullPagePath
  };
}

}
