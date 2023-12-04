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
        section.classList.add("team");
        teamsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = team.name;
        a.append(h3);

        const img = document.createElement("img");
        img.src = team.logo;
        section.append(img);

        a.onclick = (e) => {
            e.preventDefault();
            document.getElementById("hide-details").classList.remove("hidden");
            displayDetails(team);
        };

        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        section.append(editButton);

        editButton.onclick = (e) => {
            e.preventDefault();
            document.querySelector(".dialog").classList.remove("transparent");
            document.getElementById("add-edit").innerHTML = "Edit Team Details";
            populateEditForm(team);
        };

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        section.append(deleteButton);

        deleteButton.onclick = async (e) => {
            e.preventDefault();
            const confirmation = window.confirm("Are you sure you want to delete this team?");
            if (confirmation) {
                await deleteTeam(team);
            }
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
    p1.innerHTML = 'Founded: ' + team.founded;
    p1.classList.add("pad-this");

    const p2 = document.createElement("p");
    teamDetails.append(p2);
    p2.innerHTML = 'Country: ' + team.country;
    p2.classList.add("pad-this");

    const ul = document.createElement("ul");
    teamDetails.append(ul);
    ul.classList.add("pad-this");

    team.players.forEach((player) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = player;
    });

    const editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    teamDetails.append(editButton);

    editButton.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-edit").innerHTML = "Edit Team Details";
    };

    populateEditForm(team);
};

const deleteTeam = async (team) => {
    let response = await fetch(`/api/teams/${team._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });
    
      if (response.status != 200) {
        console.log("error deleting");
        return;
      }
    
      let result = await response.json();
      showTeams();
      document.getElementById("team-details").innerHTML = "";
      resetForm();
};

const populateEditForm = (team) => {
    const form = document.getElementById("team-form");
    console.log(team._id);
    form._id.value = team._id;
    form.name.value = team.name;
    form.founded.value = team.founded;
    form.country.value = team.country;

    document.getElementById("player-boxes").innerHTML = "";

    team.players.forEach((player) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = player;
        document.getElementById("player-boxes").appendChild(input);
    });
};

const addEditTeam = async (e) => {
    e.preventDefault();
    const form = document.getElementById("team-form");
    const formData = new FormData(form);
    const dataStatus = document.getElementById("data-status");
    let response;
    formData.append("players", getPlayers());

    if (form._id.value == -1) {
        formData.delete("_id");
        response = await fetch("/api/teams", {
            method: "POST",
            body: formData
        });
    } else {
        response = await fetch(`/api/teams/${form._id.value}`, {
            method: "PUT",
            body: formData
        });
    }

    if (response.status !== 200) {
        dataStatus.classList.remove("hidden");
        dataStatus.innerHTML = "Error Posting Data!";
        setTimeout(() => {
            dataStatus.classList.add("hidden");
        }, 3000);
        console.error("Error posting data");
        return;
    }

    team = await response.json();

    if (form._id.value != -1) {
        displayDetails(team);
    }

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
    form._id.value = "-1";
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
};

window.onload = () => {
    showTeams();
    document.getElementById("team-form").onsubmit = addEditTeam;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-player").onclick = addPlayer;
};
