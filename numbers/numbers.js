const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;


app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls) {
    return res.status(400).json({ error: 'please enter an url' });
  }

  const urlList = Array.isArray(urls) ? urls : [urls];
  const validURLs = [];

  for (const url of urlList) {
    try {
      const response = await axios.get(url, { timeout: 500 });
      if (response.status === 200 && Array.isArray(response.data.numbers)) {
        validURLs.push(response.data.numbers);
        console.log(response);
      }
    } catch (error) {
      console.error(`Error from ${url}: ${error.message}`);
    }
  }

  const mergedNumbers = [].concat(...validURLs);
  const uniqueNumbers = [...new Set(mergedNumbers)];
  uniqueNumbers.sort((a, b) => a - b);

  res.json({ numbers: uniqueNumbers });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



