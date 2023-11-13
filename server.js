const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let soccerTeams = [{
    _id: 1,
    name: "Real Madrid",
    league: "La Liga",
    founded: 1902,
    stadium: "Santiago Bernabeu",
    titles: [
        "34 La Liga titles",
        "19 Copa del Rey titles",
        "13 UEFA Champions League titles",
    ],
},
{
    _id: 2,
    name: "Manchester City",
    league: "Premier League",
    founded: 1880,
    stadium: "Etihad Stadium",
    titles: [
        "6 English League titles",
        "7 FA Cup titles",
        "6 EFL Cup titles",
    ],
},
{
    _id: 3,
    name: "FC Barcelona",
    league: "La Liga",
    founded: 1899,
    stadium: "Camp Nou",
    titles: [
        "26 La Liga titles",
        "31 Copa del Rey titles",
        "5 UEFA Champions League titles",
    ],
},
{
    _id: 4,
    name: "Bayern Munich",
    league: "Bundesliga",
    founded: 1900,
    stadium: "Allianz Arena",
    titles: [
        "31 Bundesliga titles",
        "20 DFB-Pokal titles",
        "6 UEFA Champions League titles",
    ],
},
{
    _id: 5,
    name: "Paris Saint-Germain",
    league: "Ligue 1",
    founded: 1970,
    stadium: "Parc des Princes",
    titles: [
        "10 Ligue 1 titles",
        "14 Coupe de France titles",
        "1 UEFA Cup Winners' Cup",
    ],
},
{
    _id: 6,
    name: "Liverpool",
    league: "Premier League",
    founded: 1892,
    stadium: "Anfield",
    titles: [
        "19 English League titles",
        "7 FA Cup titles",
        "6 UEFA Champions League titles",
    ],
}];

app.get("/api/soccerteams", (req, res) => {
    res.send(soccerteams);
});

app.post("/api/soccerteams", upload.single("img"), (req, res) => {

    const result = validateTeam(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const soccerTeam = {
        _id: soccerTeams.length + 1,
        name: req.body.name,
        league: req.body.league,
        founded: req.body.founded,
        stadium: req.body.stadium,
        titles: req.body.titles.split(","),
    };
    
    console.log(soccerTeam);
    
    soccerTeams.push(soccerTeam);
    res.send(soccerTeams);
    });
    
    const validateSoccerTeam = (soccerTeam) => {
        const schema = Joi.object({
            _id: Joi.optional(),
            name: Joi.string().min(1).required(),
            league: Joi.string().required(),
            founded: Joi.number().required(),
            stadium: Joi.string().required(),
            titles: Joi.allow("").required(),
        });
    
        return schema.validate(soccerTeam);
    };
    
    app.listen(3000, () => {
        console.log("I'm listening");
    });