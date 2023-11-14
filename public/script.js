const getTeams = async () => {
    try {
        return (await fetch("/api/teams")).json();
    } catch (error) {
        console.error(error);
    }
}

const showTeams = async () => {
    let teams = await getTeams();
    let teamsDiv = document.getElementById("team-list");
    teamsDiv.classList.add("flex-container");
    teamsDiv.classList.add("wrap");
    teamsDiv.innerHTML = "";

    teams.forEach((team) => {
        const section = document.createElement("section");
        section.classList.add("soccer-team");
        teamsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = team.name;
        a.append(h3);

        a.onclick = (e) => {
            e.preventDefault();
            document.getElementById("hide-details").classList.remove("hidden");
            displayDetails(team);
        };
    });
};

const displayDetails = (team) => {
    const teamDetails = document.getElementById("team-details");
    teamDetails.innerHTML = "";
    teamDetails.classList.add("flex-container");

    const h3 = document.createElement("h3");
    h3.innerHTML = team.name;
    teamDetails.append(h3);
    h3.classList.add("pad-this");

    const p1 = document.createElement("p");
    teamDetails.append(p1);
    p1.innerHTML = 'Coach: ' + team.coach;
    p1.classList.add("pad-this");

    const p2 = document.createElement("p");
    teamDetails.append(p2);
    p2.innerHTML = 'Stadium: ' + team.stadium;
    p2.classList.add("pad-this");

    const p3 = document.createElement("p");
    teamDetails.append(p3);
    p3.innerHTML = 'Country: ' + team.country;
    p3.classList.add("pad-this");

    const ul = document.createElement("ul");
    teamDetails.append(ul);
    ul.classList.add("pad-this");

    team.players.forEach((player) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = player;
    });

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-edit").innerHTML = "Edit Team Details";
    };

    populateEditForm(team);
};

const populateEditForm = (team) => {};

const addTeam = async (e) => {
    e.preventDefault();
    const form = document.getElementById("team-form");
    const formData = new FormData(form);
    const dataStatus = document.getElementById("data-status");
    let response;

    if (form._id.value == -1) {
        formData.delete("_id");
        formData.append("players", getPlayers());

        response = await fetch("/api/teams", {
            method: "POST",
            body: formData
        });

        dataStatus.classList.remove("hidden");
        dataStatus.innerHTML = "Data Successfully Posted!";
        setTimeout(() => {
            dataStatus.classList.add("hidden");
        }, 3000);
    }

    if (response.status !== 200) {
        dataStatus.classList.remove("hidden");
        dataStatus.innerHTML = "Error Posting Data!";
        setTimeout(() => {
            dataStatus.classList.add("hidden");
        }, 3000);
        console.error("Error posting data");
    }

    response = await response.json();
    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showTeams();
};

const getPlayers = () => {
    const inputs = document.querySelectorAll("#player-boxes input");
    let players = [];

    inputs.forEach((input) => {
        players.push(input.value);
    });

    return players;
}

const resetForm = () => {
    const form = document.getElementById("team-form");
    form.reset();
    form._id = "-1";
    document.getElementById("player-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit").innerHTML = "Add Team";
    resetForm();
};

const addPlayer = (e) => {
    e.preventDefault();
    const section = document.getElementById("player-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
}

window.onload = () => {
    showTeams();
    document.getElementById("team-form").onsubmit = addTeam;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-player").onclick = addPlayer;
};
