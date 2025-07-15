// /path/to/AboutUsPage.js

import dotenv from 'dotenv';
import { getEnabledViewports } from '../../utils/viewPorts.js';
import { scrollPage } from '../../utils/scrollUtils.js';
import { acceptCookiesIfVisible } from '../../utils/cookies.js';
import { maskEverythingExcept , cropElement , cropWhiteMargins } from '../../utils/domUtils';
import sharp from 'sharp';

dotenv.config();

const viewportSizes = getEnabledViewports(4); // 👈 Update count or keys as needed
// const selector = 'section[class*="sc-8568c89f-1"]';//hero block
const selector = 'section[class^="sc-f0c17119-0"]';//second block with padding
// const selector = 'div[class*="sc-f0c17119-1"]'; //second block without padding
// const selector = 'div[class^="sc-f0c17119-9"][class*="cIKNYK"]'; //specific inner blog

export class AboutUsPage {
  constructor(page, viewport) {
    this.page = page;
    this.viewport = viewport;
  }

  async goto() {
    await this.page.goto(`${process.env.BASE_URL}/about-us`, {
      waitUntil: 'networkidle'
    });
    await this.page.waitForTimeout(1000);
    await acceptCookiesIfVisible(this.page);
    await this.page.waitForSelector(selector, { timeout: 20000 });
    // await scrollPage(this.page);
  }

async takeScreenshot() {
  const size = viewportSizes[this.viewport];
  await this.page.setViewportSize(size);

  const diffDir = './diff_output';
  const maskedFullPagePath = `${diffDir}/aboutUs${this.viewport}-masked-full.png`;
  const croppedElementPath = `${diffDir}/aboutUs${this.viewport}.png`;
  await this.page.waitForTimeout(3000);
  await this.page.waitForSelector(selector, { timeout: 20000 });
  // await this.page.locator(selector).scrollIntoViewIfNeeded();
  await this.page.$eval(selector, el =>
  el.scrollIntoView({ behavior: 'instant', block: 'center' })
);
await this.page.waitForTimeout(2000);
  await maskEverythingExcept(this.page, selector);
  await this.page.waitForTimeout(2000); 
  // await this.page.screenshot({
  //   path: maskedFullPagePath,
  //   fullPage: true
  // });
  const elementHandle = await this.page.$(selector);
    await elementHandle.screenshot({
    path: maskedFullPagePath
});
  // await cropElement(this.page, selector, maskedFullPagePath, croppedElementPath);
  await cropWhiteMargins(maskedFullPagePath, croppedElementPath);


  return {
    cropped: croppedElementPath,
    full: maskedFullPagePath
  };
}
}
