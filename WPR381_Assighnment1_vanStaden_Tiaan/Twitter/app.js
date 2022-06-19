const needle = require("needle");
const express = require("express");
const dotenv = require("dotenv");
const res = require("express/lib/response");
const app = express();
dotenv.config();

const BEARtoken = process.env.BEARER_TOKEN; //API token for login with twitter. env used for privacy reasons.
const ENDurl = "https://api.twitter.com/2/tweets/search/recent";

//Port number 8000 check connection
app.listen(process.env.PORT || 8000, () => {
  console.log("Connected to server");
  console.log("==================================================");
  console.log("PLease Open the link and then check the terminal");
  console.log("http://localhost:8000/api/tweet/Tiaan86809904");
  console.log("==================================================");
});

const getTweetAnalysis = async (req, res) => {
  try {
    let TwitData = await gettweets(req.params.id);

    DispTweetTxt(TwitData);
  } catch (error) {
    res.send(error);
  }
};

//getting the tweets from api
const gettweets = async (id) => {
  const params = {
    query: "from:" + id + " -is:retweet",
    "tweet.fields": "created_at",
    expansions: "author_id",
  };

  const response = await needle("get", ENDurl, params, {
    headers: {
      "User-Agent": "v2RecentSearchJS",
      authorization: `Bearer ${BEARtoken}`,
    },
  });

  if (response.statusCode !== 200) {
    if (response.statusCode === 403) {
      res.status(403).send(response.body);
    } else {
      throw new Error(response.body.error.message);
    }
  }
  if (response.body) {
    return response.body;
  } else {
    throw new Error("Unsuccessful Req");
  }
};

//Twitter object to store returned values
const twitterObject = {};
const analyze = async (TwitDat) => {
  twitterObject["username"] = TwitDat.includes.users[0].username;
  twitterObject["name"] = TwitDat.includes.users[0].name;
  console.log(TwitDat.data[0].text);
  let AVGchar = 0;
  let AVGword = 0;
  let TOTchar = 0;
  let TOTword = 0;
  let txts = TwitDat.data;
  if (txts) {
    for (let index = 0; index < TwitDat.data.length; index++) {
      TOTchar += txts[index].text.length;
      TOTword += txts[index].text.split(" ").length;
    }
  }
  if (TwitDat.meta.result_count > 0) {
    twitterObject["usesActively"] = true;
    AVGchar = TOTchar / TwitDat.meta.result_count;
    AVGword = TOTword / TwitDat.meta.result_count;
  } else {
    twitterObject["usesActively"] = false;
  }
  twitterObject["averageWordCount"] = AVGword;
  twitterObject["averageCharacterCount"] = AVGchar;
  return twitterObject;
};

//Show the tweet
function DispTweetTxt(twitterData) {
  twitterObject["username"] = twitterData.includes.users[0].username;
  twitterObject["name"] = twitterData.includes.users[0].name;

  console.log(twitterData.data);

  twit;
}

//Api
app.get("/api/tweet/:id", getTweetAnalysis);


                     
