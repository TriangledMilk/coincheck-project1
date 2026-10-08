var page = document.querySelector("body"); // Fiddling with the html body element.
var lengthOfFile = 0; // Length of file, shrimple really.
var places = []; // Array to hold the places of the coins in the json file.
var dataCollect = []; // Array to hold the data of the coins in the json file.
var AgPrice = 0; // Variable to hold the current price of silver in CAD.
var lastUpdatedAt = null; // Time of the most recent successful price request.

//AgPriceCheck();

// btw this whole thing worked fine when I was like, using the servers we get from the college
// idk if it does or doesnt work on github yet, didn't test yet 
// oh well!

async function AgPriceCheck() { //actual function that does the silver price checking; fetching from MetalSentinel API via Vercel serverless function.

  const url = '/api/silver-price';
    try {
  const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Unable to fetch the silver price.');
    }

        console.log(result);
        
        AgPrice = result.results[0].bid; // Use optional chaining to safely access nested properties


        lastUpdatedAt = new Date();
        //updateLastUpdated();

        //updatedPrices();
        console.log("AgPrice is now:", AgPrice);
        return AgPrice;

        
    
    } catch (error) {
	console.error(error);
    }
} // end of AgPriceCheck() function

/*function updateLastUpdated() {
  if (!lastUpdatedAt) return;

  const torontoTime = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(lastUpdatedAt);

  const parts = Object.fromEntries(
    torontoTime.map(({ type, value }) => [type, value])
  );
  const secondsAgo = Math.floor((Date.now() - lastUpdatedAt.getTime()) / 1000);

  document.querySelector('#lastUpdated').textContent =
    `Last Updated: ${parts.year} ${parts.month} ${parts.day}, ${parts.hour}:${parts.minute} Toronto Time (${secondsAgo} seconds ago)`;
}

setInterval(updateLastUpdated, 1000);*/


function priceInfo(spotPrice, purity, weight){
  
  //first convert per oz price to per gram.
  var spotPriceGram = spotPrice / 31.1035; // 1 troy ounce = 31.1035 grams

  //then calculate the precious metal in coin based on purity and weight.
  var preciousMetalInCoin =  purity * weight; // purity is a decimal so no need to do the whole percentage thingy.

  //finally, calculate the value of the coin.
  var coinValue = spotPriceGram * preciousMetalInCoin;

  return coinValue;
}

document.querySelector('#coinInput').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the form from submitting normally; basically it stops the browser from reloading, the default behaviour of a form submission.

  //var coinType = document.querySelector('input[name="coinType"]:checked').value;
  var purity = parseFloat(document.querySelector('#coinPurity').value);
  var weight = parseFloat(document.querySelector('#coinWeight').value);

  const pricePerOunce = await AgPriceCheck();
  console.log('Silver price:', pricePerOunce);
  const coinValue = priceInfo(pricePerOunce, purity, weight);
  console.log('Coin value:', coinValue);

  document.querySelector('#valCheck').textContent = `The value of your coin is: $${coinValue.toFixed(2)} CAD`;
});
