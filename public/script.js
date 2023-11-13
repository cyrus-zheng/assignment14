const getSoccerTeams = async () => {
    try {
        return (await fetch("api/soccer-teams")).json();
    } catch (error) {
        console.log(error);
    }
}

const showSoccerTeams = async () => {
    let soccerTeams = await getSoccerTeams();
    let soccerTeamsDiv = document.getElementById("soccer-team-list");
    soccerTeamsDiv.classList.add("flex-container");
    soccerTeamsDiv.classList.add("wrap");
    soccerTeamsDiv.innerHTML = "";

    soccerTeams.forEach((team) => {
        const section = document.createElement("section");
        section.classList.add("soccer-team");
        soccerTeamsDiv.append(section);

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
    const teamDetails = document.getElementById("soccer-team-details");
    teamDetails.innerHTML = "";
    teamDetails.classList.add("flex-container");

    const h3 = document.createElement("h3");
    h3.innerHTML = team.name;
    teamDetails.append(h3);
    h3.classList.add("pad-this");

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    teamDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    teamDetails.append(eLink);
    eLink.id = "edit-link";

    const p1 = document.createElement("p");
    teamDetails.append(p1);
    p1.innerHTML = 'League: ' + team.league;
    p1.classList.add("pad-this");

    const p2 = document.createElement("p");
    teamDetails.append(p2);
    p2.innerHTML = 'Founded: ' + team.founded;
    p2.classList.add("pad-this");

    const p3 = document.createElement("p");
    teamDetails.append(p3);
    p3.innerHTML = 'Stadium: ' + team.stadium;
    p3.classList.add("pad-this");

    const ul = document.createElement("ul");
    teamDetails.append(ul);
    ul.classList.add("pad-this");
    console.log(team.titles);
    team.titles.forEach((title) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = title;
    });

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-edit").innerHTML = "Edit Team Details";
    };

    populateEditForm(team);
};

const populateEditForm = (team) => {};

const addSoccerTeam = async (e) => {
    e.preventDefault();
    const form = document.getElementById("soccer-team-form");
    const formData = new FormData(form);
    const dataStatus = document.getElementById("data-status");
    let response;

    if (form._id.value == -1) {
        formData.delete("_id");
        formData.append("titles", getTitles());

        console.log(...formData);

        response = await fetch("/api/soccer-teams", {
            method: "POST",
            body: formData
        });
        dataStatus.classList.remove("hidden");
        dataStatus.innerHTML = "Data Successfully Posted!";
        setTimeout(() => {
            dataStatus.classList.add("hidden");
        }, 3000);
    }

    if (response.status != 200) {
        dataStatus.classList.remove("hidden");
        dataStatus.innerHTML = "Error Posting Data!";
        setTimeout(() => {
            dataStatus.classList.add("hidden");
        }, 3000);
        console.log("Error posting data");
    }

    response = await response.json();
    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showSoccerTeams();
};

const getTitles = () => {
    const inputs = document.querySelectorAll("#title-boxes input");
    let titles = [];

    inputs.forEach((input) => {
        titles.push(input.value);
    });

    return titles;
}

const resetForm = () => {
    const form = document.getElementById("soccer-team-form");
    form.reset();
    form._id = "-1";
    document.getElementById("title-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit").innerHTML = "Add Soccer Team";
    resetForm();
};

const addTitle = (e) => {
    e.preventDefault();
    const section = document.getElementById("title-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
}

window.onload = () => {
    showSoccerTeams();
    document.getElementById("soccer-team-form").onsubmit = addSoccerTeam;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-title").onclick = addTitle;
};
