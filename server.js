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

let soccerTeams = [
    {
        _id: 1,
        name: "FC Barcelona",
        coach: "Xavi Hernandez",
        stadium: "Camp Nou",
        country: "Spain",
        players: [
            "Lionel Messi",
            "Ansu Fati",
            "Sergio Busquets",
            "Gerard Piqué",
            "Jordi Alba"
        ]
    },
    {
        _id: 2,
        name: "Real Madrid CF",
        coach: "Carlo Ancelotti",
        stadium: "Santiago Bernabeu",
        country: "Spain",
        players: [
            "Karim Benzema",
            "Vinicius Junior",
            "Luka Modric",
            "Sergio Ramos",
            "Marcelo"
        ]
    },
    {
        _id: 3,
        name: "Liverpool FC",
        coach: "Jurgen Klopp",
        stadium: "Anfield",
        country: "England",
        players: [
            "Mohamed Salah",
            "Sadio Mane",
            "Jordan Henderson",
            "Virgil van Dijk",
            "Andrew Robertson"
        ]
    },
    {
        _id: 4,
        name: "FC Bayern Munich",
        coach: "Julian Nagelsmann",
        stadium: "Allianz Arena",
        country: "Germany",
        players: [
            "Robert Lewandowski",
            "Thomas Muller",
            "Joshua Kimmich",
            "Manuel Neuer",
            "Alphonso Davies"
        ]
    },
    {
        _id: 5,
        name: "Paris Saint-Germain",
        coach: "Mauricio Pochettino",
        stadium: "Parc des Princes",
        country: "France",
        players: [
            "Kylian Mbappe",
            "Neymar Jr.",
            "Marco Verratti",
            "Marquinhos",
            "Achraf Hakimi"
        ]
    },
    {
        _id: 6,
        name: "Juventus FC",
        coach: "Massimiliano Allegri",
        stadium: "Allianz Stadium",
        country: "Italy",
        players: [
            "Cristiano Ronaldo",
            "Paulo Dybala",
            "Giorgio Chiellini",
            "Federico Chiesa",
            "Dejan Kulusevski"
        ]
    }
];


app.get("/api/teams", (req, res) => {
    res.send(soccerTeams);
});

app.post("/api/teams", upload.single("img"), (req, res) => {
    const result = validateTeam(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const team = {
        _id: soccerTeams.length + 1,
        name: req.body.name,
        coach: req.body.coach,
        stadium: req.body.stadium,
        country: req.body.country,
        players: req.body.players.split(","),
    }

    soccerTeams.push(team);
    res.send(soccerTeams);
});

const validateTeam = (team) => {
    const schema = Joi.object({
        _id: Joi.optional(),
        name: Joi.string().min(1).required(),
        coach: Joi.string().required(),
        stadium: Joi.string().required(),
        country: Joi.string().required(),
        players: Joi.allow(""),
    });

    return schema.validate(team);
};

app.listen(3000, () => {
    console.log("Running");
});
