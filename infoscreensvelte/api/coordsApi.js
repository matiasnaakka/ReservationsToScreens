import {Router} from 'express';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
import {promises as fs} from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const STORE_PATH = join(__dirname, '../src/stores/wallsStore.ts');

const router = Router();

/**
 * Logs request details with a custom message
 * @param {express.Request} req - The Express request object
 * @param {string} message - Custom message to log
 */
const logRequest = (req, message) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path} - ${message}`,
    {
      body: req.body,
      query: req.query,
      params: req.params
    }
  );
};

/**
 * Logs error details with request information
 * @param {express.Request} req - The Express request object
 * @param {Error} error - The error object
 * @param {string} message - Custom error message
 */
const logError = (req, error, message) => {
  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.path} - ${message}`,
    {
      error: error.message,
      stack: error.stack,
      body: req.body,
      query: req.query,
      params: req.params
    }
  );
};

/**
 * Parses the existing walls data from the store file
 * @returns {Promise<Array<BuildingFloorWalls>>} Array of wall configurations
 * @throws {Error} When file reading or parsing fails
 */
const parseExistingWalls = async () => {
  try {
    const content = await fs.readFile(STORE_PATH, 'utf-8');
    const match = content.match(
      /const defaultWalls: BuildingFloorWalls\[] = (\[[\s\S]*?\]);/
    );
    if (!match) return [];

    // Remove comments and evaluate the array
    const arrayString = match[1].replace(/\/\/[^\n]*/g, '');
    return eval(arrayString);
  } catch (error) {
    console.error('Error parsing walls:', error);
    return [];
  }
};

/**
 * Updates the walls data in the store file.
 *
 * @async
 * @function updateWallsStore
 * @param {Array} walls - The array of walls data to be stored
 * @returns {Promise<boolean>} Returns true if the update was successful, false otherwise
 * @description This function reads the store file, replaces the defaultWalls array with the new walls data
 * after formatting it nicely, and then writes the updated content back to the file.
 * The formatting includes removing extra whitespace in arrays and adjusting quotes for specific properties.
 * @throws {Error} Logs the error to console if file reading or writing fails
 */
const updateWallsStore = async (walls) => {
  try {
    const content = await fs.readFile(STORE_PATH, 'utf-8');

    // Format the walls array nicely
    const wallsString = JSON.stringify(walls, null, 2)
      .replace(/\[\n\s+/g, '[')
      .replace(/\n\s+\]/g, ']')
      .replace(/"building":\s*"([^"]+)"/g, "building: '$1'")
      .replace(/"(start|end|floor|walls)":/g, '$1:');

    const newContent = content.replace(
      /const defaultWalls: BuildingFloorWalls\[] = \[[\s\S]*?\];/,
      `const defaultWalls: BuildingFloorWalls[] = ${wallsString};`
    );

    await fs.writeFile(STORE_PATH, newContent);
    return true;
  } catch (error) {
    console.error('Error updating store:', error);
    return false;
  }
};

/**
 * POST endpoint to add new wall coordinates
 * @route POST /walls
 * @param {Object} req.body.building - Building identifier
 * @param {Object} req.body.floor - Floor number
 * @param {Object} req.body.start - Start coordinates {x, y}
 * @param {Object} req.body.end - End coordinates {x, y}
 * @returns {Object} Message indicating success or error
 */
router.post('/walls', async (req, res) => {
  try {
    const {building, floor, start, end} = req.body;
    logRequest(req, `Adding wall for ${building} floor ${floor}`);

    if (!building || !floor || !start || !end) {
      logRequest(req, 'Missing required fields');
      return res.status(400).json({error: 'Missing required fields'});
    }

    const walls = await parseExistingWalls();
    const buildingFloor = walls.find(
      (w) => w.building === building && w.floor === floor
    );

    if (buildingFloor) {
      logRequest(req, `Adding wall to existing floor ${building}:${floor}`);
      buildingFloor.walls.push({start, end});
    } else {
      logRequest(req, `Creating new floor entry ${building}:${floor}`);
      walls.push({
        building,
        floor,
        walls: [{start, end}]
      });
    }

    const success = await updateWallsStore(walls);
    if (success) {
      logRequest(req, 'Wall coordinates added successfully');
      res.json({message: 'Wall coordinates added successfully'});
    } else {
      throw new Error('Failed to update wall coordinates');
    }
  } catch (error) {
    logError(req, error, 'Error handling wall coordinates');
    res.status(500).json({error: 'Internal server error'});
  }
});

/**
 * GET endpoint to fetch all walls
 * @route GET /walls
 * @returns {Array<BuildingFloorWalls>} Array of all wall configurations
 */
router.get('/walls', async (req, res) => {
  try {
    const walls = await parseExistingWalls();
    res.json(walls);
  } catch (error) {
    logError(req, error, 'Error fetching walls');
    res.status(500).json({error: 'Internal server error'});
  }
});

/**
 * DELETE endpoint to remove the last wall from a specific floor
 * @route DELETE /walls/last
 * @param {string} req.query.building - Building identifier
 * @param {number|string} req.query.floor - Floor number
 * @returns {Object} Details about the removed wall and remaining count
 */
router.delete('/walls/last', async (req, res) => {
  try {
    const {building, floor} = req.query;
    logRequest(req, `Removing last wall from ${building} floor ${floor}`);

    if (!building || !floor) {
      const error = 'Missing building or floor';
      logRequest(req, error);
      return res.status(400).json({error});
    }

    const walls = await parseExistingWalls();
    const buildingFloor = walls.find(
      (w) => w.building === building && w.floor === parseInt(floor)
    );

    if (!buildingFloor) {
      const error = `No floor found for building ${building} floor ${floor}`;
      logRequest(req, error);
      return res.status(404).json({error});
    }

    if (buildingFloor.walls.length === 0) {
      const error = `No walls found for building ${building} floor ${floor}`;
      logRequest(req, error);
      return res.status(404).json({error});
    }

    const removedWall = buildingFloor.walls.pop();
    logRequest(req, `Removed wall: ${JSON.stringify(removedWall)}`);

    const success = await updateWallsStore(walls);
    if (!success) {
      throw new Error('Failed to update wall coordinates');
    }

    res.json({
      message: 'Last wall removed successfully',
      removedWall,
      remainingWalls: buildingFloor.walls.length
    });
  } catch (error) {
    logError(req, error, 'Error removing wall');
    res.status(500).json({error: 'Internal server error'});
  }
});

export default router;
