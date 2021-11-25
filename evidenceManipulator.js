let foundEvidences = [];
let disabledEvidences = [];
let eliminatedEvidences = [];

function displayGhosts(ghosts) {
    let ghostContainer = document.getElementById("possibleGhosts");

    if (ghosts.length === ghostInfos.length) {
        ghostContainer.innerHTML = defaultText;
        return;
    }
    ghostContainer.innerHTML = "";
    ghosts.forEach(ghost => ghostContainer.innerHTML += "<li>" + ghost.name + "</li> <p>" + ghost.description);
}

function getGhostsWithEvidence() {
    return ghostInfos
        .filter(ghost => foundEvidences.length === 0 ? true : foundEvidences.every(evidence => ghost.evidences.indexOf(evidence) > -1))
        .filter(ghost => disabledEvidences.length > 0 ? disabledEvidences.every(evidence => ghost.evidences.indexOf(evidence) === -1) : true);
}

function update() {
    let ghosts = getGhostsWithEvidence();
    displayGhosts(ghosts);
    let evidences = ghosts.flatMap(g => g.evidences).unique();
    evidences = evidenceTypes.differenceKeys(evidences);
    eliminateEvidences(evidences);
}

/**
 * This piece of evidence was found
 * @param evidence
 */
function checkEvidence(evidence) {
    if (foundEvidences.indexOf(evidence) !== -1 || disabledEvidences.indexOf(evidence) !== -1) {
        document.getElementById(evidenceTypes[evidence].id).classList.remove("checked");
        foundEvidences.removeValues(evidence);
        return disableEvidence(evidence);
    }
    foundEvidences.push(evidence);

    document.getElementById(evidenceTypes[evidence].id).classList.add("checked");
    update();
}

/**
 * End of the evidence toggle loop
 * @param evidence
 */
function uncheckEvidence(evidence) {
    update();
}

/**
 * This piece of evidence has been searched for, but not found
 *
 * @param evidence
 */
function disableEvidence(evidence) {
    if (disabledEvidences.indexOf(evidence) !== -1) {
        document.getElementById(evidenceTypes[evidence].id).classList.remove("disabled");
        disabledEvidences.removeValues(evidence);
        return uncheckEvidence(evidence);
    }
    disabledEvidences.push(evidence);
    document.getElementById(evidenceTypes[evidence].id).classList.add("disabled");
    update();
}

/**
 * This piece of evidence cannot be found in combination with the other evidences
 *
 * @param evidences
 */
function eliminateEvidences(evidences) {
    evidenceTypes.forEach(e => document.getElementById(e.id).classList.remove("eliminated"));
    eliminatedEvidences = [];
    evidences.forEach((e, k) => {
        if (disabledEvidences.indexOf(k) === -1) {
            document.getElementById(e.id).classList.add("eliminated")
            eliminatedEvidences.push(k);
        }
    });
}

function resetEvidence() {
    foundEvidences = [];
    disabledEvidences = [];
    eliminatedEvidences = []

    evidenceTypes.forEach(
        (_, i) => document.getElementById(evidenceTypes[i].id).classList.forEach(
            v => document.getElementById(evidenceTypes[i].id).classList.remove(v)
        )
    );
    document.getElementById("possibleGhosts").innerHTML = defaultText;
}

Array.prototype.differenceKeys = function (keys) {
    let result = [];
    this.forEach((v, i) => {
        if (keys.indexOf(i) === -1) {
            result[i] = v;
        }
    });
    return result;
}

Array.prototype.unique = function () {
    return this.filter((e, i, a) => !(a.indexOf(e) < i) || a.indexOf(e) === -1);
}

Array.prototype.mergeUnique = function (b) {
    b.filter(x => this.indexOf(x) === -1)
        .forEach(x => this.push(x));
}

Array.prototype.removeValues = function (index) {
    while (this.indexOf(index) > -1) {
        this.splice(this.indexOf(index), 1);
    }
}

Array.prototype.remove = function (index) {
    this.splice(index, 1);
}