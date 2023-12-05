const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });

mongoose
  .connect(
    "mongodb+srv://cyrus-zheng:aQ12be92@cluster0.0nbwbwy.mongodb.net/"
  )
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("Could not connect to mongodb...", err));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const teamSchema = new mongoose.Schema({
  name: String,
  country: String,
  founded: Number,
  stadium: String,
  coach: String,
  players: [String],
  img: String,
  _id: Number,
});

const Team = mongoose.model("Team", teamSchema);

app.get("/api/teams", (req, res) => {
  getTeams(res);
});

const getTeams = async (res) => {
  const teams = await Team.find();
  res.send(teams);
};

app.post("/api/teams", upload.single("img"), async (req, res) => {
  console.log(req.body);
  const result = validateTeam(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const teams = await Team.find();
  console.log(teams);
  let maxID = 0;
  for (x = 0; x < teams.length; x++) {
    if (teams[x]._id > maxID) {
      maxID = teams[x]._id;
    }
  }
  maxID++;

  const team = new Team({
    _id: maxID,
    name: req.body.name,
    country: req.body.country,
    founded: req.body.founded,
    stadium: req.body.stadium,
    coach: req.body.coach,
    players: req.body.players.split(","),
  });

  if (req.file) {
    team.img = "images/" + req.file.filename;
  }

  createTeam(team, res);
});

const createTeam = async (team, res) => {
  const result = await team.save();
  res.send(team);
};

app.put("/api/teams/:id", upload.single("img"), (req, res) => {
  const result = validateTeam(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  updateTeam(req, res);
});

const updateTeam = async (req, res) => {
  let fieldsToUpdate = {
    name: req.body.name,
    country: req.body.country,
    founded: req.body.founded,
    stadium: req.body.stadium,
    coach: req.body.coach,
    players: req.body.players.split(","),
  };

  if (req.file) {
    fieldsToUpdate.img = "images/" + req.file.filename;
  }

  const result = await Team.updateOne({ _id: req.params.id }, fieldsToUpdate);
  const team = await Team.findById(req.params.id);
  res.send(team);
};

app.delete("/api/teams/:id", upload.single("img"), (req, res) => {
  removeTeam(res, req.params.id);
});

const removeTeam = async (res, id) => {
  const team = await Team.findByIdAndDelete(id);
  res.send(team);
};

const validateTeam = (team) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    name: Joi.string().required(),
    country: Joi.string().required(),
    founded: Joi.number().integer().required(),
    stadium: Joi.string().required(),
    coach: Joi.string().required(),
    players: Joi.allow(""),
  });

  return schema.validate(team);
};

app.listen(3000, () => {
  console.log("Running");
});
