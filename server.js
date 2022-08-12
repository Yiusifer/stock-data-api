const axios = require("axios");
const cheerio = require("cheerio")
const app = require("express")();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello World!</h1>");
})

app.get("/:ticker", async (req, res) => {
  const { ticker } = req.params;
  const { key } = req.query;

  if (!ticker || !key) {
    return res.status(400).send("Please provide an api key and ticker")
  }

  const { data } = await axios.get(`https://finance.yahoo.com/quote/MRNA/key-statistics?p=MRNA`);
  const $ = cheerio.load(data);
  // > means a direct descendent / child. Left side is parent, right side is child.
  // Retrieve the second div of the sections results
  const stats = $('section[data-test="qsp-statistics"] > div:nth-child(2)')
   res.send(stats.html());

  try {

    // Web scrape the historical data and statistics simultaneously using Promise.all
    // This reduces computation time, as opposed to having the requests run consecutively

    // Create an array based on the respective URL query, map over them to generate respective results

    const stockInfo = await Promise.all(['history', 'key-statistics'].map(async val => {

      const url = `https://ca.finance.yahoo.com/quote/${ticker}/${val}?p=${ticker}`
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      if (val === 'history') {
        // Retrieve the 6th table data 
        // .get return every element it finds in an array
        // .map lets you process the results
        // Return ONLLY the text within the HTML (returns both otherwise)
        const prices = $('td:nth-child(6)').get().map(val => $(val).text())

      }

      if (val === 'key-statistics') {

        const metrics = [
          'Market Cap (intraday)',
          'Trailing P/E',
          'Forward P/E',
          'PEG Ratio (5 yr expected)',
          'Price/Sales (ttm)',
          'Price/Book (mrq)',
          'Enterprise Value/Revenue',
          'Enterprise Value/EBITDA',
          'Shares Outstanding5',
          'Profit Margin',
          'Operating Margin (ttm)',
          'Return on Assets (ttm)',
          'Return on Equity (ttm)',
          'Revenue (ttm)',
          'Revenue Per Share (ttm)',
          'Quarterly Revenue Growth (yoy)',
          'Gross Profit (ttm)',
          'EBITDA',
          'Net Income Avi to Common (ttm)',
          'Quarterly Earnings Growth (yoy)',
          'Total Cash (mrq)',
          'Total Debt (mrq)',
          'Total Debt/Equity (mrq)',
          'Operating Cash Flow (ttm)'
        ];

        const stats = $('section[data-test="qsp-statistics"]')


      }
    }))

  } catch (err) {
    res.status(500).send({ message: err.message })

  }

})

app.listen(port, () => console.log(`Server is now running on port: ${port}`));