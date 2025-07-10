
import sharp from 'sharp';

// export async function maskEverythingExcept(page, selector) {
//   await page.evaluate((targetSelector) => {
//     const targetEl = document.querySelector(targetSelector);
//     if (!targetEl) return;

//     const hideSiblings = (element) => {
//       const parent = element.parentElement;
//       if (!parent) return;

//       for (const sibling of parent.children) {
//         if (sibling !== element) {
//           sibling.style.visibility = 'hidden';
//           sibling.style.opacity = '0';
//         }
//       }
//       //freeze animation or transition
//     targetEl.style.animation = 'none';
//     targetEl.style.transition = 'none';
//       // Recurse up
//       hideSiblings(parent);
//     };

//     // Start hiding from the target up
//     hideSiblings(targetEl);

//     // Ensure target is visible
//     targetEl.style.visibility = 'visible';
//     targetEl.style.opacity = '1';
//     targetEl.style.zIndex = '999999';
//     targetEl.scrollIntoView({ behavior: 'instant', block: 'center' });
//   }, selector);
// }

export async function maskEverythingExcept(page, selector) {
  await page.evaluate((targetSelector) => {
    const getVisibleContainer = (el) => {
      let current = el;
      while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        const box = current.getBoundingClientRect();
        const visible = box.width > 0 && box.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
        if (visible) return current;
        current = current.parentElement;
      }
      return el;
    };

    const targetEl = document.querySelector(targetSelector);
    if (!targetEl) return;

    // Find the outer visible container
    const container = getVisibleContainer(targetEl);

    const maskSiblings = (element) => {
      const parent = element.parentElement;
      if (!parent) return;

      for (const sibling of parent.children) {
        if (sibling !== element) {
          sibling.style.visibility = 'hidden';
          sibling.style.opacity = '0';
        }
      }

      // Freeze animations
      element.style.animation = 'none';
      element.style.transition = 'none';

      // Recurse upward
      maskSiblings(parent);
    };

    maskSiblings(container);

    // Ensure container is visible
    container.style.visibility = 'visible';
    container.style.opacity = '1';
    container.style.zIndex = '999999';
    container.scrollIntoView({ behavior: 'instant', block: 'center' });
  }, selector);
}



export async function cropElement(page, selector, inputPath, outputPath) {
  // Get bounding box of the element
  const box = await page.$eval(selector, el => {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    };
  });

  console.log(`🟨 Crop box for ${selector}:`, box);

  // Validate the box
  if (
    !box ||
    box.width <= 0 ||
    box.height <= 0 ||
    box.x < 0 ||
    box.y < 0
  ) {
    throw new Error(`❌ Invalid bounding box: ${JSON.stringify(box)}`);
  }

  // Read actual screenshot dimensions
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  console.log(`🖼 Screenshot dimensions: ${metadata.width}x${metadata.height}`);

  // Clamp box dimensions to stay within screenshot bounds
  const cropWidth = Math.min(Math.floor(box.width), metadata.width - Math.floor(box.x));
  const cropHeight = Math.min(Math.floor(box.height), metadata.height - Math.floor(box.y));

  // Perform cropping
  await image
    .extract({
      left: Math.floor(box.x),
      // top: Math.floor(box.y),
      top: Math.max(0, Math.floor(box.y)),
      width: cropWidth,
      height: cropHeight
    })
    .toFile(outputPath);

  console.log(`✅ Cropped screenshot saved to ${outputPath}`);
}



export async function cropWhiteMargins(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();

  const raw = await image.ensureAlpha().raw().toBuffer(); // RGBA

  let topCrop = 0;
  let bottomCrop = height - 1;

  const rowSize = width * 4; // 4 channels (RGBA)
  const isWhiteRow = (y) => {
    for (let x = 0; x < width; x++) {
      const idx = y * rowSize + x * 4;
      const r = raw[idx];
      const g = raw[idx + 1];
      const b = raw[idx + 2];
      const a = raw[idx + 3];

      // Consider nearly white (not exactly #ffffff) with threshold
      if (!(r > 240 && g > 240 && b > 240 && a > 240)) {
        return false;
      }
    }
    return true;
  };

  // Find top content row
  while (topCrop < height && isWhiteRow(topCrop)) {
    topCrop++;
  }

  // Find bottom content row
  while (bottomCrop > topCrop && isWhiteRow(bottomCrop)) {
    bottomCrop--;
  }

  const cropHeight = bottomCrop - topCrop + 1;

  await image
  .extract({ left: 0, top: topCrop, width, height: cropHeight })
  .png() // ✅ force output format
  .toFile(outputPath);

  console.log(`✅ Cropped masked image from white margins → ${outputPath}`);
}
