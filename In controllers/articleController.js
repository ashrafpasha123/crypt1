const redisClient = require("../redis/redisClient");

exports.getAllArticles = async (req, res) => {
  try {
    const cacheData = await redisClient.get("allArticles");

    if (cacheData) {
      return res.status(200).json(JSON.parse(cacheData));
    }

    const articles = await Article.find().populate("author");
    await redisClient.set("allArticles", JSON.stringify(articles), { EX: 60 });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
