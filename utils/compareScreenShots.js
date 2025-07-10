// // compareScreenshots.js

// import fs from 'fs';
// import { PNG } from 'pngjs';
// import pixelmatch from 'pixelmatch';

// // export function compareScreenshots({
// //   actualBuffer,
// //   expectedPath,
// //   actualPath,
// //   diffPath,
// //   expectedCopyPath
// // }) 
// await compareScreenshots({
//   actualBuffer,
//   actualPath: cropped,
//   expectedPath: expectedImagePath,
//   diffPath,
//   expectedCopyPath
// });
// {
//   fs.writeFileSync(actualPath, actualBuffer);

//   // Load the expected (baseline) screenshot from file
//   const expectedBuffer = fs.readFileSync(expectedPath);
//   const expectedPNG = PNG.sync.read(expectedBuffer);

//   // Read the actual screenshot captured during the test
//   const fullActualPNG = PNG.sync.read(actualBuffer);

//   // Determine the common dimensions — crop to the smaller of both
//   const cropWidth = Math.min(expectedPNG.width, fullActualPNG.width);
//   const cropHeight = Math.min(expectedPNG.height, fullActualPNG.height);

//   // Create new empty PNGs to hold the cropped images
//   const croppedExpected = new PNG({ width: cropWidth, height: cropHeight });
//   const croppedActual = new PNG({ width: cropWidth, height: cropHeight });

//   // Copy (crop) data from the original images into the new cropped versions
//   PNG.bitblt(expectedPNG, croppedExpected, 0, 0, cropWidth, cropHeight, 0, 0);
//   PNG.bitblt(fullActualPNG, croppedActual, 0, 0, cropWidth, cropHeight, 0, 0);

//   // Create a blank PNG image to store the diff result
//   const diff = new PNG({ width: cropWidth, height: cropHeight });

//   // Compare the two cropped images pixel by pixel
//   const diffPixels = pixelmatch(
//     croppedExpected.data,
//     croppedActual.data,
//     diff.data,
//     cropWidth,
//     cropHeight,
//     { threshold: 0.6 }
//   );

//   fs.writeFileSync(diffPath, PNG.sync.write(diff));
//   fs.copyFileSync(expectedPath, expectedCopyPath);

//   return diffPixels;
// }


// utils/compareScreenShots.js

import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

/**
 * Compares an actual screenshot with a baseline and generates a diff.
 * @param {Object} params
 * @param {Buffer} params.actualBuffer - The buffer of the actual screenshot
 * @param {string} params.actualPath - Path to save the actual screenshot
 * @param {string} params.expectedPath - Path to the baseline (Figma) image
 * @param {string} params.diffPath - Path to write the diff image
 * @param {string} params.expectedCopyPath - Path to save a copy of the baseline image for reports
 * @returns {number} diffPixels - Number of differing pixels
 */
export function compareScreenshots({
  actualBuffer,
  actualPath,
  expectedPath,
  diffPath,
  expectedCopyPath
}) {
  // Write the actual screenshot to file
  fs.writeFileSync(actualPath, actualBuffer);

  // Load expected and actual images as PNG
  const expectedBuffer = fs.readFileSync(expectedPath);
  const expectedPNG = PNG.sync.read(expectedBuffer);
  const actualPNG = PNG.sync.read(actualBuffer);

  // Determine smallest common dimensions
  const width = Math.min(expectedPNG.width, actualPNG.width);
  const height = Math.min(expectedPNG.height, actualPNG.height);

  // Crop both images to the smallest dimensions
  const croppedExpected = new PNG({ width, height });
  const croppedActual = new PNG({ width, height });

  PNG.bitblt(expectedPNG, croppedExpected, 0, 0, width, height, 0, 0);
  PNG.bitblt(actualPNG, croppedActual, 0, 0, width, height, 0, 0);

  // Create diff image
  const diff = new PNG({ width, height });

  const diffPixels = pixelmatch(
    croppedExpected.data,
    croppedActual.data,
    diff.data,
    width,
    height,
    { threshold: 0.6 }
  );

  // Write output files
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  fs.copyFileSync(expectedPath, expectedCopyPath);

  return diffPixels;
}
