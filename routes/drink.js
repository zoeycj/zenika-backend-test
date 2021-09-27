const express = require("express");
const router = express.Router();
const request = require("request");
const sync_request = require("sync-request");
const { v4: uuidv4 } = require("uuid");

var g_coffee_image_url = "";
const proxy_url_coffee = "https://api.sampleapis.com/coffee/hot";
const proxy_url_beer = "https://api.sampleapis.com/beers/ale";
const proxy_url_img = "https://coffee.alexflipnote.dev/random.json";

const getCoffeeImage = () => {
  const res = sync_request("GET", proxy_url_img);
  const data = JSON.parse(res.getBody("utf8"));
  g_coffee_image_url = data.file;
};

const getBeerDescription = (name) => {
  name = name.trim();
  console.log(name);
  var part = name.split(" ");
  var category = part.pop().trim();
  var description = "";
  if (category == "Ale") {
    description =
      "Ale is a general category of beer: You'll find sub-categories like brown ales or pale ales. This is the oldest style of beer, which dates back to antiquity. What distinguishes an ale - and also makes this category of beer accessible for home brewers - is a warm-temperature fermentation for a relatively short period of time. In the brewing process, brewers introduce top-fermenting yeasts which, as the name suggests, ferment on the top of the brew. The fermentation process turns what would otherwise be a barley and malt tea into a boozy beverage.";
  } else if (category == "Porter") {
    description =
      "A type of ale, porter beers are known for their dark black color and roasted malt aroma and notes. Porters may be fruity or dry in flavor, which is determined by the variety of roasted malt used in the brewing process.";
  } else if (category == "Stout") {
    description =
      "Like porters, stouts are dark, roasted ales. Stouts taste less sweet than porters and often feature a bitter coffee taste, which comes from unmalted roasted barley that is added to the wort. They are characterized by a thick, creamy head. Ireland's Guinness may be one of the world's best-known stouts.";
  } else if (category == "IPA") {
    description =
      "Originally, India Pale Ale or IPA was a British pale ale brewed with extra hops. High levels of this bittering agent made the beer stable enough to survive the long boat trip to India without spoiling. The extra dose of hops gives IPA beers their bitter taste. Depending on the style of hops used, IPAs may have fruit-forward citrus flavors or taste of resin and pine.\
    American brewers have taken the IPA style and run with it, introducing unusual flavors and ingredients to satisfy U.S. beer drinkers' love for the brew style.\
    ";
  } else if (name.indexOf("Pale Ale") != -1) {
    description =
      "An English style of ale, pale ales and known for their copper color and fruity scent. Don't let the name fool you: these beers are strong enough to pair well with spicy foods.\
    Related to the pale is the APA, or American Pale Ale, which is somewhat of a hybrid between the traditional English pale ale and the IPA style. American pale ales are hoppier and usually feature American two row malt.\
    ";
  } else if (name.indexOf("Brown Ale") != -1) {
    description =
      "Brown ales range in color from amber to brown, with chocolate, caramel, citrus, or nut notes. Brown ales are a bit of a mixed bag, since the different malts used and the country of origin can greatly affect the flavor and scent of this underrated beer style.";
  }

  return description;
};

const getCoffeeList = (res) => {
  getCoffeeImage();
  const options = {
    headers: { Connection: "close" },
    url: proxy_url_coffee,
    method: "get",
    json: true,
  };
  const drinkList = [];
  request(options, (error, response, data) => {
    if (!error && response.statusCode == 200) {
      if (data !== {}) {
        data.map((item) => {
          if (
            item.hasOwnProperty("title") === true &&
            item.title !== "" &&
            item.title !== null
          ) {
            let drink = {};

            let name = item.title;
            let price = "$" + (Math.floor(Math.random() * 13) + 8);
            let rating = (Math.floor(Math.random() * 5) + 1).toFixed(3);
            let description = item.description;
            let image = g_coffee_image_url;
            let id = uuidv4();
            drink["name"] = name;
            drink["price"] = price;
            drink["rating"] = rating;
            drink["description"] = description;
            drink["image"] = image;
            drink["id"] = id;
            drinkList.push(drink);
          }
        });
      }
    }
    // res.json(drinkList);
    res.render("drink", { title: "Coffee", data: drinkList });
  });
};

const getBeerList = (res) => {
  const options = {
    headers: { Connection: "close" },
    url: proxy_url_beer,
    method: "get",
    json: true,
  };
  const drinkList = [];
  request(options, (error, response, data) => {
    if (data !== {}) {
      if (!error && response.statusCode == 200) {
        data.map((item) => {
          if (
            item.hasOwnProperty("name") === true &&
            item.name !== "" &&
            item.name !== null
          ) {
            let drink = {};
            let name = item.name;
            let price = item.price;
            let rating = item.rating.average.toFixed(3);
            let description = getBeerDescription(name);
            let image = item.image;
            let id = uuidv4();

            drink["name"] = name;
            drink["price"] = price;
            drink["rating"] = rating;
            drink["description"] = description;
            drink["image"] = image;
            drink["id"] = id;

            drinkList.push(drink);
          }
        });
      }
    }
    // res.json(drinkList);
    res.render("drink", { title: "Beer", data: drinkList });
  });
};
const getBlendList = (res) => {
  const drinkList = [];
  getCoffeeImage();
  const resultCoffee = sync_request("GET", proxy_url_coffee);
  if (resultCoffee.statusCode == 200) {
    const coffeeData = JSON.parse(resultCoffee.getBody("utf8"));
    if (coffeeData !== {}) {
      coffeeData.map((item) => {
        if (
          item.hasOwnProperty("title") === true &&
          item.title !== "" &&
          item.title !== null
        ) {
          let drink = {};
          let name = item.title;
          let price = "$" + (Math.floor(Math.random() * 13) + 8);
          let rating = (Math.floor(Math.random() * 5) + 1).toFixed(3);
          let description = item.description;
          let image = g_coffee_image_url;
          let id = uuidv4();
          drink["name"] = name;
          drink["price"] = price;
          drink["rating"] = rating;
          drink["description"] = description;
          drink["image"] = image;
          drink["id"] = id;
          drinkList.push(drink);
        }
      });
    }
  }

  const resultBeer = sync_request("GET", proxy_url_beer);
  if (resultBeer.statusCode == 200) {
    const beerData = JSON.parse(resultBeer.getBody("utf8"));
    if (beerData !== {}) {
      beerData.map((item) => {
        if (
          item.hasOwnProperty("name") === true &&
          item.name !== "" &&
          item.name !== null
        ) {
          let drink = {};
          let name = item.name;
          let price = item.price;
          let rating = item.rating.average.toFixed(3);
          let description = getBeerDescription(name);
          let image = item.image;
          let id = uuidv4();
          drink["name"] = name;
          drink["price"] = price;
          drink["rating"] = rating;
          drink["description"] = description;
          drink["image"] = image;
          drink["id"] = id;

          drinkList.push(drink);
        }
      });
    }
  }
  drinkList.sort((a, b) => {
    return b.rating - a.rating;
  });
  // res.json(drinkList);
  res.render("drink", { title: "All Drinks", data: drinkList });
};

router.get("/", function (req, res, next) {
  const type = req.query.type;
  var message = "Loading...";
  switch (type) {
    case "":
      getBlendList(res);
      break;
    case "coffee":
      getCoffeeList(res);
      break;
    case "beer":
      getBeerList(res);
      break;
    default:
      message = "Wrong drink type!";
      res.send(message);
      break;
  }
});

module.exports = router;
