const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

// route for searching the log
app.get('/search', async (req, res) => {
  const { level, log_string, timestamp, source } = req.query;
  const logFiles = ['log1.log', 'log2.log']; // List of log files to search
  let searchResults = [];

  // search function for searching log in log files.
  async function searchLogFile(file) {
    try {
      const filePath = path.join(__dirname, file);
      const fileContents = await fs.readFile(filePath, 'utf8');
      const logs = JSON.parse(fileContents);

      const matchingLogs = logs.filter(log => (
        (!level || log.level === level) &&
        (!log_string || log.log_string.includes(log_string)) &&
        (!timestamp || log.timestamp === timestamp) &&
        (!source || (log.metadata && log.metadata.source === source))
      ));

      searchResults = searchResults.concat(matchingLogs);
    } catch (error) {
      console.error(`Error reading file ${file}: ${error.message}`);
    }
  }

  // function call
  await Promise.all(logFiles.map(file => searchLogFile(file)));

  res.json(searchResults);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
