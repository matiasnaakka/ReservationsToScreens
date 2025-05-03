const fs = require('fs');
const path = require('path');
const {createCanvas} = require('canvas');

// Define output location in the current folder
const outputFile = path.join('./', 'fileStructure.png');



// Function to recursively traverse the directory structure and collect items
const collectStructure = (dir, level = 0, result = []) => {
  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);

      // Skip node_modules, .git, other common directories, md and excalidraw files
      if (
        [
          'node_modules',
          '.git',
          'dist',
          'build',
          '.svelte-kit',
          'static'
        ].includes(item) ||
        (!stats.isDirectory() &&
          (path.extname(item) === '.md' ||
            path.extname(item) === '.excalidraw' ||
            path.extname(item) === '.toml' ||
            path.extname(item) === '.json' ||
            path.extname(item) === '.yml' ||
            path.extname(item) === '.yaml' ||
            path.extname(item) === '.lock' ||
            path.extname(item) === '.log' ||
            path.extname(item) === '.avif' ||
            path.extname(item) === '.jpg' ||
            path.extname(item) === '.png'))
      ) {
        continue;
      }

      const isDirectory = stats.isDirectory();
      result.push({
        name: item,
        level,
        isDirectory,
        path: itemPath
      });

      if (isDirectory) {
        collectStructure(itemPath, level + 1, result);
      }
    }

    return result;
  } catch (error) {
    result.push({
      name: `Error reading directory: ${error.message}`,
      level,
      isError: true
    });
    return result;
  }
};

// Function to draw file structure to canvas
const drawFileStructure = (structure) => {
  // Config
  const lineHeight = 20;
  const indentWidth = 20;
  const fontSize = 14;
  const fontFamily = 'Arial';
  const padding = 20;

  // Calculate canvas dimensions
  const height = structure.length * lineHeight + padding * 2;
  const maxLevel = structure.reduce(
    (max, item) => Math.max(max, item.level),
    0
  );
  const width = 800; // Fixed width, should be enough for most structures

  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Draw title
  ctx.fillStyle = '#000000';
  ctx.font = `bold ${fontSize + 2}px ${fontFamily}`;
  ctx.fillText(
    `File Structure for: ${process.cwd()}`,
    padding,
    padding + lineHeight / 2
  );
  ctx.fillText(
    `Generated on: ${new Date().toLocaleString()}`,
    padding,
    padding + lineHeight * 1.5
  );

  // Draw items
  ctx.font = `${fontSize}px ${fontFamily}`;

  structure.forEach((item, index) => {
    const y = padding + lineHeight * (index + 3); // +3 to account for title lines
    const x = padding + item.level * indentWidth;

    // Choose icon based on type
    let icon;
    let textColor = '#000000';

    if (item.isError) {
      icon = '❌';
      textColor = '#FF0000';
    } else if (item.isDirectory) {
      icon = '📁';
      textColor = '#0066CC';
    } else {
      icon = '📄';
      textColor = '#333333';
    }

    ctx.fillStyle = textColor;
    ctx.fillText(`${icon} ${item.name}${item.isDirectory ? '/' : ''}`, x, y);
  });

  return canvas;
};

// Get the current directory
const rootDir = process.cwd();

try {
  // Collect the file structure
  const structure = collectStructure(rootDir);

  // Draw the structure on canvas
  const canvas = drawFileStructure(structure);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputFile, buffer);

  console.log(`File structure has been written to ${outputFile}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
}
