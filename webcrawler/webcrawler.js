var axios = require('axios');
var cheerio = require('cheerio');
var URL = require('url-parse');
const fs = require('fs')

var START_URL = 'https://theluckystar.vn/collections/men-footwear';/*https://heatfactory.vn/collections/giay-dep'*/
var MAX_PAGES_TO_VISIT = 20;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var next = "";
var url = START_URL;
var baseUrl = "https://theluckystar.vn";
var shoeURL = [];
var shoeTitles = [];
var shoeImages = [];
var shoePrices = [];
var shoeObject = [];
var shoeSKU = [];
var shoeSizes = [];
var shoeStringCSV = [];

pagesToVisit.push(START_URL);
crawl();

function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }
  var nextPage = pagesToVisit.pop();
  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else {
    // New page we haven't visited
    visitPage(nextPage, crawl);
  }
}

function visitPage(url, callback) {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited++;

  // Make the request
  console.log("Visiting page " + url);
  axios.get(url)
    .then((response) => {
     // Check status code (200 is HTTP OK)
    console.log("Status code: " + response.status);
    if(response.status !== 200) {
      callback();
      return;
    }
     // Parse the document body
    var $ = cheerio.load(response.data);
    getProductNames($);
    getProductImages($);
    getProductPrices($);
    getNextPageLinks($);
    pagesToVisit.push(next);
    //while(shoeTitles.length !== shoeSKU.length && shoeTitles.length !== shoe.length);
    if(next !== undefined)
    {
      console.log(next);
      callback();
    }
    else
    {
      for (let i = 0; i < shoeTitles.length; i++) {
        var shoeData = {
          title: shoeTitles[i],
          SKU: shoeSKU[i],
          imageURL: shoeImages[i],
          price: shoePrices[i],
          size: shoeSizes[i]
        }
        for (let j = 0; j < shoeSizes[i].length; j++)
        {
          var shoeStr = "Luckystar," + shoeSKU[i] + "," + shoeSizes[i][j] + "," + shoePrices[i] + "," + shoeURL[i] + "\n";
          shoeStringCSV.push(shoeStr);
        }
        shoeObject.push(JSON.stringify(shoeData));
      }
      var pathCSV = "luckystar.csv";

      var path = "luckystar.json";
      try {
        fs.writeFileSync(path, shoeObject.toString());
        fs.writeFileSync(pathCSV, shoeStringCSV.toString());
      } catch (err)
      {
        console.error(err);
      }
    }
  }).catch((error) => {
    console.error(error)
  });
}

function getNextPageLinks($) {
  next = undefined;
  /*$('.page current').each( (index, value) => {
    var link = parseInt($(value).text()) + 1;
    next = baseUrl + '/collections/men-footwear?page=' + link;
  });*/
  var nextPageIndex = $('.page.current').text();
  if (nextPageIndex != '')
  {
    var nextPageText = parseInt(nextPageIndex) + 1;
    next = baseUrl + '/collections/men-footwear?page=' + nextPageText;
  }
}

function getSKU(link, index)
{
  axios.get(link)
    .then((response) => {
     // Check status code (200 is HTTP OK)
     if(response.status !== 200) {
       shoeSKU[index] = " ";
       console.log("Empty");
       return;
     }
     // Parse the document body
     var $ = cheerio.load(response.data);
     //console.log($('.pd-sku').text());
     shoeSKU[index] = $('.pd-sku').text();
     //shoeSKU.push($('.pd-sku').text());
  });
}

function getSize(link, index)
{
  var allSizes = [];
  axios.get(link)
    .then((response) => {
     // Check status code (200 is HTTP OK)
     if(response.status !== 200) {
       allSizes.push(" ");
       shoeSizes[index] = allSizes;
       return;
     }
     // Parse the document body
     var $ = cheerio.load(response.data);
     $('.option.swatch.df.middle').each( (index, value) => {
        var size = $(value).attr('data-value');
        //shoeTitles.push(title.substring(title.lastIndexOf("/") + 1, title.length));
        allSizes.push(size);
      });
     /*var sizeStr = ""
     for (let i = 0; i < allSizes.length; i++) {
        sizeStr += allSizes[i] + ';';
      }*/
     shoeSizes[index] = allSizes;
  });
}

function getProductNames($) {
  /*$('.image-resize').each( (index, value) => {
    var title = $(value).attr('title');
    shoeTitles.push(title);
  });*/
  $('.p-image.pr.db').each( (index, value) => {
    var title = $(value).attr('href');
    shoeTitles.push(title.substring(title.lastIndexOf("/") + 1, title.length));
    var url = baseUrl + title;
    shoeURL.push(url);
    console.log(url);
    getSKU(url, shoeURL.length - 1);
    console.log(shoeSKU.length);
    console.log(shoeSKU.toString());
    getSize(url, shoeURL.length - 1);
    console.log(shoeURL.length);
    console.log(shoeSizes.toString());
  });
}

function getProductImages($){
  $('.lazyload.pa.wf.hf'/*.img-loop*/).each( (index, value) => {
    var imgSrc = $(value).attr('data-srcset'/*src*/);;
    shoeImages.push(imgSrc.split(' ')[0]);
  });
}

function getProductPrices($){
  $('.p-price.invert-o'/*.pro-price*/ ).each( (index, value) => {
    var price = $(value).text().replace(/[^0-9, ]/g, "");
    shoePrices.push(price);
  });
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function() {
        pagesToVisit.push(baseUrl + $(this).attr('href'));
    });
}