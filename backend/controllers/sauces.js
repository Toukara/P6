const Sauces = require("../models/sauces.js");
const fs = require("fs");
const path = require("path");

const IMAGEFOLDER = path.join(__dirname, "../images");

exports.getAllSauces = async (req, res, next) => {
  let sauces = await Sauces.find({});

  res.send(sauces);
};

exports.getOneSauce = async (req, res, next) => {
  let sauce = await Sauces.findById({ _id: req.params.id });

  res.send(sauce);
};

exports.createSauce = async (req, res, next) => {
  let requestBodyParsed = JSON.parse(req.body.sauce);
  const { userId, name, manufacturer, description, mainPepper, heat } = requestBodyParsed;

  const imageUrl = `http://localhost:3000/images/${req.file.filename}`; //une mauvaise idée de mettre tout l'URL dans la base de données

  console.log(req.body.sauce);

  const sauce = new Sauces({
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: imageUrl,
    heat: heat,
  });

  console.log(sauce);

  await sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce added successfully" }))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.editSauce = async (req, res, next) => {
  let sauce = await Sauces.findById({ _id: req.params.id });

  if (!sauce) {
    return res.status(404).json({ error: "Sauce not found" });
  }

  if (!req.body.userId || !req.body.name || !req.body.manufacturer || !req.body.description || !req.body.mainPepper || !req.body.heat) {
    return res.status(400).json({ error: "Please provide all the fields" });
  }

  await Sauces.updateOne(
    { _id: req.params.id },
    {
      userId: req.body.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      imageUrl: req.body.imageUrl,
      heat: req.body.heat,
    }
  );
  res.status(200).json({ message: "Sauce updated successfully" });
};

exports.deleteSauce = async (req, res, next) => {
  let sauce = await Sauces.findById({ _id: req.params.id });

  var n = sauce.imageUrl.lastIndexOf("/");
  var result = sauce.imageUrl.substring(n + 1);

  if (!sauce) {
    return res.status(404).json({ error: "Sauce not found" });
  }
  await fs.unlink(path.join(IMAGEFOLDER, result), (err) => {
    if (err) {
      console.log(err);
    }
  });
  await Sauces.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Sauce deleted successfully" });
};

exports.likeSauce = async (req, res, next) => {
  let sauce = await Sauces.findById({ _id: req.params.id });
  let param = req.body.like;

  if (!sauce) {
    return res.status(404).json({ error: "Sauce not found" });
  }

  if (param === 0) {
    await Sauces.updateOne(
      { _id: req.params.id },
      sauce.usersLiked.includes(req.body.userId)
        ? { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, _id: req.params.id }
        : { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, _id: req.params.id }
    )
      .then(() =>
        sauce.usersLiked.includes(req.body.userId) ? res.status(200).json({ message: "Like removed" }) : res.status(200).json({ message: "Dislike removed" })
      )
      .catch((error) => res.status(400).json({ error: error }));
  } else if (param === 1) {
    if (sauce.usersLiked.includes(req.body.userId)) {
      return res.status(200).json({ message: "You already liked this sauce" });
    } else if (sauce.usersDisliked.includes(req.body.userId)) {
      await Sauces.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: -1, likes: 1 },
          $pull: { usersDisliked: req.body.userId },
          $push: { usersLiked: req.body.userId },
          _id: req.params.id,
        }
      )
        .then(() => res.status(200).json({ message: "Dislike removed and like added" }))
        .catch((error) => res.status(400).json({ error: error }));
    } else {
      await Sauces.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: req.body.userId },
          _id: req.params.id,
        }
      )
        .then(() => res.status(200).json({ message: "Sauce liked" }))
        .catch((error) => res.status(400).json({ error: error }));
    }
  } else if (param === -1) {
    if (sauce.usersDisliked.includes(req.body.userId)) {
      return res.status(200).json({ message: "You already disliked this sauce" });
    } else if (sauce.usersLiked.includes(req.body.userId)) {
      await Sauces.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1, likes: -1 },
          $pull: { usersLiked: req.body.userId },
          $push: { usersDisliked: req.body.userId },
          _id: req.params.id,
        }
      )
        .then(() => res.status(200).json({ message: "Like removed and like added" }))
        .catch((error) => res.status(400).json({ error: error }));
    } else {
      await Sauces.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
          _id: req.params.id,
        }
      )
        .then(() => res.status(200).json({ message: "Sauce disliked" }))
        .catch((error) => res.status(400).json({ error: error }));
    }
  } else {
    res.status(400).json({ error: "Bad request" });
  }
};
