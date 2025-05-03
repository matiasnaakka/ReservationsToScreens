import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Workaround for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'src/assets/roomImages');
const outputDir = path.join(__dirname, 'public/assets/images');

const resizeImage = async (inputPath, outputPath, width, height) => {
  try {
    await sharp(inputPath)
      .resize(width, height)
      .toFile(outputPath);
    console.log(`Resized ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error resizing ${inputPath}:`, error);
  }
};

const processImages = async () => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir);
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    await resizeImage(inputPath, outputPath, 128, 96); // Resize to 128x96
  }
};

processImages();
