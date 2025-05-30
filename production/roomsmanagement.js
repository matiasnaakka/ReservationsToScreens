import express from 'express';
import { createServer } from 'http';

const app = express();
const http = createServer(app);

const port = 3004;
const startTime = new Date();

app.use(express.static('roomsmanagement'));

app.get('*', (_req, res) => {
  try {
    res.sendFile('index.html', { root: 'roomsmanagement' });
  } catch (error) {
    logger.error('Error serving index.html:', error);
    res.status(500).json('Error serving application');
  }
});

http.listen(port, () => {
  logger.info(
    `roomsManagement FILE SERVER started at: http://localhost:${port}/. Start time: ${startTime.toLocaleString()}`,
  );
});

http.on('error', (error) => {
  logger.error('File server error:', error);
});

export default app;
