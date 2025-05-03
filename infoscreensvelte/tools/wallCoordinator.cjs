const readline = require('readline');
const fs = require('fs').promises;
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const STORE_PATH = path.join(__dirname, '../src/stores/wallsStore.ts');

const parseCoords = (input) => {
  const [x, y] = input.split(',').map((n) => parseFloat(n.trim()));
  if (isNaN(x) || isNaN(y)) {
    throw new Error('Invalid coordinate format. Use "x, y"');
  }
  return [x, y];
};

const listExistingWalls = (walls) => {
  console.log('\nExisting walls:');
  walls.forEach((building, index) => {
    console.log(
      `${index + 1}. Building: ${building.building}, Floor: ${building.floor}`
    );
    building.walls.forEach((wall, wallIndex) => {
      console.log(
        `   ${wallIndex + 1}. Start: [${wall.start}], End: [${wall.end}]`
      );
    });
  });
};

const promptForMode = async () =>
  new Promise((resolve) => {
    rl.question(
      'Do you want to (1) add new wall or (2) edit existing? ',
      (answer) => {
        resolve(answer === '2' ? 'edit' : 'add');
      }
    );
  });

const selectExistingWall = async (walls) =>
  new Promise((resolve) => {
    listExistingWalls(walls);
    rl.question('Select building number (or "cancel"): ', (buildingIndex) => {
      if (buildingIndex.toLowerCase() === 'cancel') {
        resolve(null);
        return;
      }

      const building = walls[parseInt(buildingIndex) - 1];
      if (!building) {
        console.log('Invalid building selection');
        resolve(null);
        return;
      }

      rl.question('Select wall number to edit: ', (wallIndex) => {
        const wall = building.walls[parseInt(wallIndex) - 1];
        if (!wall) {
          console.log('Invalid wall selection');
          resolve(null);
          return;
        }

        resolve({
          building: building.building,
          floor: building.floor,
          wallIndex: parseInt(wallIndex) - 1,
          buildingIndex: parseInt(buildingIndex) - 1
        });
      });
    });
  });

const addMultipleWalls = async (building, floor) => {
  let walls = [];
  let continueAdding = true;
  let lastEnd = null; // Store last end coordinate for reference

  console.log(`\nAdding walls for ${building} floor ${floor}`);
  console.log(
    'Enter "done" to finish, "cancel" to discard, or coordinates in "x, y" format'
  );

  while (continueAdding) {
    if (lastEnd) {
      console.log(`Last end point was: [${lastEnd}]`);
    }

    const coords = await new Promise((resolve) => {
      rl.question('Start coordinates (or done/cancel): ', (input) => {
        if (input.toLowerCase() === 'done') {
          continueAdding = false;
          resolve(null);
        } else if (input.toLowerCase() === 'cancel') {
          walls = [];
          continueAdding = false;
          resolve(null);
        } else {
          try {
            const start = parseCoords(input);
            rl.question('End coordinates: ', (endInput) => {
              try {
                const end = parseCoords(endInput);
                lastEnd = end; // Store end coordinate for reference
                resolve({start, end});
              } catch (e) {
                console.error(e.message);
                resolve(null);
              }
            });
          } catch (e) {
            console.error(e.message);
            resolve(null);
          }
        }
      });
    });

    if (coords) {
      walls.push(coords);
      console.log(`Wall added: [${coords.start}] to [${coords.end}]\n`);
    }
  }

  return walls.length > 0 ? walls : null;
};

const validateBuilding = (building) => {
  if (!building || typeof building !== 'string') {
    throw new Error('Building name must be a non-empty string');
  }
  return building.toUpperCase();
};

const promptForCoords = async (existingWalls) =>
  new Promise((resolve) => {
    rl.question('Enter building (or "exit" to quit): ', (building) => {
      if (building.toLowerCase() === 'exit') {
        resolve(null);
        return;
      }

      try {
        const validatedBuilding = validateBuilding(building);

        rl.question('Enter floor number: ', async (floor) => {
          const floorNum = parseInt(floor);
          if (isNaN(floorNum)) {
            console.error('Invalid floor number');
            resolve(null);
            return;
          }

          const walls = await addMultipleWalls(validatedBuilding, floorNum);
          if (!walls) {
            resolve(null);
            return;
          }

          resolve({
            building: validatedBuilding, // Now guaranteed to be a string
            floor: floorNum,
            walls,
            editMode: false
          });
        });
      } catch (e) {
        console.error(e.message);
        resolve(null);
      }
    });
  });

const parseExistingWalls = (content) => {
  const match = content.match(
    /const defaultWalls: BuildingFloorWalls\[] = (\[[\s\S]*?\]);/
  );
  if (!match) return [];

  // Remove comments and evaluate the array
  const arrayString = match[1].replace(/\/\/[^\n]*/g, '');
  return eval(arrayString);
};

const updateStoreFile = async (newWallData) => {
  try {
    const content = await fs.readFile(STORE_PATH, 'utf-8');
    const existingWalls = parseExistingWalls(content);

    // Find matching building and floor
    const buildingFloorIndex = existingWalls.findIndex(
      (w) =>
        w.building === newWallData.building && w.floor === newWallData.floor
    );

    if (buildingFloorIndex !== -1) {
      // Add all new walls to existing building/floor
      newWallData.walls.forEach((wall) => {
        const isDuplicate = existingWalls[buildingFloorIndex].walls.some(
          (w) => JSON.stringify(w) === JSON.stringify(wall)
        );
        if (!isDuplicate) {
          existingWalls[buildingFloorIndex].walls.push(wall);
        }
      });
    } else {
      // Add new building/floor section with all walls
      existingWalls.push({
        building: newWallData.building,
        floor: newWallData.floor,
        walls: newWallData.walls
      });
    }

    // Format the walls array nicely
    const wallsString = JSON.stringify(existingWalls, null, 2)
      .replace(/\[\n\s+/g, '[')
      .replace(/\n\s+\]/g, ']')
      // Preserve quotes only around building names
      .replace(/"building":\s*"([^"]+)"/g, "building: '$1'")
      .replace(/"(start|end|floor|walls)":/g, '$1:');

    const newContent = content.replace(
      /const defaultWalls: BuildingFloorWalls\[] = \[[\s\S]*?\];/,
      `const defaultWalls: BuildingFloorWalls[] = ${wallsString};`
    );

    await fs.writeFile(STORE_PATH, newContent);
    console.log(
      newWallData.editMode
        ? 'Wall updated successfully!'
        : 'Wall added successfully!'
    );
  } catch (error) {
    console.error('Error updating store file:', error);
  }
};

const main = async () => {
  console.log('Wall Coordinator - Enter coordinates in format: "x, y"');
  console.log('Example: 2.36, -1.07');

  while (true) {
    const content = await fs.readFile(STORE_PATH, 'utf-8');
    const existingWalls = parseExistingWalls(content);
    const coords = await promptForCoords(existingWalls);
    if (!coords) continue;
    await updateStoreFile(coords);
  }
};

main();
