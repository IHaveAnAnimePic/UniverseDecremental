var data = {
    universeSize: new Decimal("1e308"),
    nullSpace: new Decimal(5),
    pressureMul : 1,
    scraps : new Decimal(0),
    energy : new Decimal(0),
    gainEnergy : new Decimal(0),
    compressionPower: 1,
    extraDupes: 0,
    unlockedEnergy: false,
    dimensions: 9,
    voidCompressors: {
        amount: new Decimal(0),
        amountInitial: new Decimal(0),
        cost: new Decimal(5),
        initialCost: new Decimal(5),
        costMult: new Decimal(1.3)
    },
    spaceRefactors: {
        amount: new Decimal(0),
        cost: new Decimal(2),
        costMult: new Decimal(2)
    },
    duplicators: {
        amount: new Decimal(0),
        cost: new Decimal(10),
        costMult: new Decimal(10),
        dupes: new Decimal(1)
    },
    energyUp: {
        first: false,
        firstCost: new Decimal("1e0"),
        second: false,
        third: false,
        fourth: false
    }
  }
function formatNumber(decimal) {
    mantissa = decimal.mantissa
    exponent = decimal.exponent
    if (exponent == 0) {
        return (Math.ceil(mantissa * 100) / 100).toFixed(2);
    }
    if (exponent < 3 && exponent > -3) {
        return (Math.ceil(mantissa * Math.pow(10,exponent) * 100) / 100).toFixed(2);
    }
    return (Math.ceil(mantissa*100)/100).toFixed(2) + "e" + exponent;
}

function updateUniverseSize() {
    subtract = data.universeSize.mul(data.voidCompressors.amount.mul(data.duplicators.dupes.mul(data.compressionPower * data.pressureMul * 0.02 / 20)))
    if (subtract.greaterThanOrEqualTo(data.universeSize)) {
        subtract = data.universeSize.mul(0.999)
        console.log("capped")
    }
    data.universeSize = data.universeSize.sub(subtract);
    document.getElementById("universeSize").textContent = formatNumber(data.universeSize);
    }

function updateNullSpace() {
    gain = data.voidCompressors.amount.mul(data.duplicators.dupes.mul(data.compressionPower * 2));
    data.nullSpace = data.nullSpace.add(gain / 20);
    document.getElementById("nullSpaceCount").innerHTML = "You have " + formatNumber(data.nullSpace) + " Null Space (" + formatNumber(gain) + "/s)";
}
function updateScraps() {
    scraps = new Decimal(0)
    if (data.energyUp.second) {
        scraps = data.voidCompressors.amount.mul(data.duplicators.dupes * 10)
    } else {
        scraps = data.voidCompressors.amount.mul(data.duplicators.dupes)
    }
    document.getElementById("scrapCount").innerHTML = "You also have " + formatNumber(data.scraps) + " Scraps";
    document.getElementById("getScraps").innerText = "Scrap your Compressors (+" + formatNumber(scraps) + ")"
    if (data.voidCompressors.amount.lessThan(5)) {
        document.getElementById("getScraps").disabled = true
        document.getElementById("getScraps").innerText = "Requires 5 Compressors"
    } else {
        document.getElementById("getScraps").disabled = false
    }
}
function updateRefactor() {
    refactor = (new Decimal(1)).sub(new Decimal(Math.log2(data.spaceRefactors.amount) + 1).div(20))
    data.voidCompressors.costMult =  (refactor.mul(0.3)).add(1)
    data.voidCompressors.cost = (data.voidCompressors.costMult.pow(data.voidCompressors.amount)).mul(data.voidCompressors.initialCost)
    document.getElementById("buyVoidCompressor").innerText = "Price for 1: " + formatNumber(data.voidCompressors.cost)  + " null space";
}
function buyVoidCompressor() {
    if (data.nullSpace.greaterThanOrEqualTo(data.voidCompressors.cost)) {
        data.nullSpace = data.nullSpace.sub(data.voidCompressors.cost);
        data.voidCompressors.cost = (data.voidCompressors.costMult.pow(data.voidCompressors.amount.add(1))).mul(data.voidCompressors.initialCost)
        data.voidCompressors.amount = data.voidCompressors.amount.add(1);
        document.getElementById("voidCompressorCount").innerHTML = "Void Compressors: " + data.voidCompressors.amount;
        document.getElementById("buyVoidCompressor").innerText = "Price for 1: " + formatNumber(data.voidCompressors.cost)  + " null space";
    }
}
function getScraps() {
    if (data.voidCompressors.amount.greaterThanOrEqualTo(5)) {
        if (data.energyUp.second) {
            data.scraps = data.scraps.add(data.voidCompressors.amount * data.duplicators.dupes * 10)
        } else {
            data.scraps = data.scraps.add(data.voidCompressors.amount * data.duplicators.dupes)
        }
        data.voidCompressors.amount = data.voidCompressors.amountInitial; 
        data.universeSize = new Decimal("1e308");
        data.nullSpace = new Decimal(5);
        data.voidCompressors.cost = new Decimal(5)
        document.getElementById("voidCompressorCount").innerHTML = "Void Compressors: " + data.voidCompressors.amount;
        document.getElementById("buyVoidCompressor").innerText = "Price for 1: " + formatNumber(data.voidCompressors.cost) + " null space";
        document.getElementById("getEnergy").innerText =  "Reset your progress for  \n" + 0.00 + " Energy"
        updateScraps();
    }
}
function buySpaceRefactor() {
    if (data.scraps.greaterThanOrEqualTo(data.spaceRefactors.cost)) {
        data.scraps = data.scraps.sub(data.spaceRefactors.cost);
        data.spaceRefactors.cost = (data.spaceRefactors.costMult.pow(data.spaceRefactors.amount.add(1)).mul(2))
        data.spaceRefactors.amount = data.spaceRefactors.amount.add(1);
        updateScraps();
        updateRefactor();
        document.getElementById("spaceRefactorCount").innerHTML = "Space Refactors: " + data.spaceRefactors.amount;
        document.getElementById("buySpaceRefactor").innerText = "Price for 1: " + formatNumber(data.spaceRefactors.cost) + " scraps";
    }
}
function buyDuplicator() {
    if (data.scraps.greaterThanOrEqualTo(data.duplicators.cost)) {
        data.scraps = data.scraps.sub(data.duplicators.cost);
        data.duplicators.cost = (data.duplicators.costMult.pow(data.duplicators.amount.add(1))).mul(10)
        data.duplicators.amount = data.duplicators.amount.add(1);
        data.duplicators.dupes = new Decimal(2).pow(data.duplicators.amount.add(data.extraDupes));
        updateScraps();
        document.getElementById("duplicatorCount").innerHTML = "Duplicators: " + data.duplicators.amount;
        document.getElementById("buyDuplicator").innerText = "Price for 1: " + formatNumber(data.duplicators.cost) + " scraps";
    }
}

function updatePressureDebuff() {
    reduction = (data.universeSize.log10() / 308)
    document.getElementById("universeReduction").innerHTML = "You have reduced the universe's size by " + (100 - reduction * 100).toFixed(2) + "%";
    data.pressureMul = Math.pow(reduction, data.dimensions);
    if (reduction < 0.9) {
        //Show energy stuff
        if (data.energyUp.fourth) {
            data.gainEnergy = (new Decimal(1e308).div(data.universeSize)).pow(2);
        } else {
            data.gainEnergy = new Decimal(1e280).div(data.universeSize);
        }

        document.getElementById("getEnergy").style.display = "block";
        document.getElementById("getEnergy").innerText =  "Reset your progress for  \n" + formatNumber(data.gainEnergy) + " Energy"
    } else {
        document.getElementById("getEnergy").style.display = "none";
    }
    if (data.universeSize.lessThan(1)) {
        data.universeSize = new Decimal(0)
        document.getElementById("universeReduction").innerHTML = "Congratulations, you've reduced the universe to an infinitesimal point and completed the game.";
    }

}
function getEnergy() {
    data.unlockedEnergy = true
    data.energy = data.energy.add(data.gainEnergy);
    data.universeSize = new Decimal("1e308")
    data.nullSpace = new Decimal(5)
    data.scraps = new Decimal(0)
    data.voidCompressors.amount = data.voidCompressors.amountInitial
    data.voidCompressors.cost = new Decimal(5)
    data.spaceRefactors.amount = new Decimal(0)
    data.spaceRefactors.cost = new Decimal(2)
    data.duplicators.amount = new Decimal(1)
    data.duplicators.cost = new Decimal(100)
    document.getElementById("voidCompressorCount").innerHTML = "Void Compressors: " + data.voidCompressors.amount;
    document.getElementById("buyVoidCompressor").innerText = "Price for 1: " + formatNumber(data.voidCompressors.cost)  + " null space";
    document.getElementById("spaceRefactorCount").innerHTML = "Space Refactors: " + data.spaceRefactors.amount;
    document.getElementById("buySpaceRefactor").innerText = "Price for 1: " + formatNumber(data.spaceRefactors.cost) + " scraps";
    document.getElementById("duplicatorCount").innerHTML = "Duplicators: " + data.duplicators.amount;
    document.getElementById("buyDuplicator").innerText = "Price for 1: " + formatNumber(data.duplicators.cost) + " scraps";
    document.getElementById("energyTab").style.display = "inline"
    document.getElementById("getEnergy").innerText =  "Reset your progress for  \n" + 0.00 + " Energy"
}

function updateEffects() {
    refactor = (new Decimal(((data.spaceRefactors.amount.mul(data.duplicators.dupes)).add(1)).logarithm(2))).div(20)
    document.getElementById("voidCompressorEffect").innerHTML = "Reducing the size of the universe by " + formatNumber(new Decimal(data.pressureMul).mul(data.voidCompressors.amount.mul(data.duplicators.dupes.mul(data.compressionPower * 2)))) + "% a second";
    document.getElementById("spaceRefactorEffect").innerHTML = "Reducing the cost multiplier of Compressors by " + formatNumber(refactor.mul(100))+ "%"
    document.getElementById("duplicatorEffect").innerHTML = "Multiplying Compressor effectiveness and scrap gain by x" + formatNumber(new Decimal(data.duplicators.dupes))
}

function updateEnergy() {
    document.getElementById("energyCounter").innerHTML = "You have " + formatNumber(data.energy) + " Energy"
    document.getElementById("pressure").innerHTML = "Your progress is being reduced by x" + data.pressureMul.toFixed(2) + " due to pressure"
    data.duplicators.dupes = new Decimal(2).pow(data.duplicators.amount.add(data.extraDupes));
}
function changeTabs(tabName) {
    var tabs = document.getElementsByClassName('tab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
}

function buyMaxCompressors() {
    while (data.nullSpace.greaterThanOrEqualTo(data.voidCompressors.cost)) {
        buyVoidCompressor();
    }
}
function buyMaxRefactors() {
    while (data.scraps.greaterThanOrEqualTo(data.spaceRefactors.cost)) {
        buySpaceRefactor();
    }
}
function buyMaxDuplicators() {
    while (data.scraps.greaterThanOrEqualTo(data.duplicators.cost)) {
        buyDuplicator();
    }
}
function buyEnergyUp(upgrade) {
    button = document.getElementById(upgrade)
    if (upgrade == "first" && data.energy.greaterThanOrEqualTo(data.energyUp.firstCost)) {
        data.energy = data.energy.sub(data.energyUp.firstCost)
        data.energyUp.firstCost.exponent += 3 
        data.energyUp.first += 1
        data.compressionPower = Math.log2(data.energyUp.first + 1) + 1
        button.innerText = "Increase compressing power (x"+ formatNumber(new Decimal(data.compressionPower)) + ") \n Cost: " + formatNumber(data.energyUp.firstCost) + " Energy"
    }
    if (upgrade == "second" && data.energy.greaterThanOrEqualTo(1e50)) {
        data.energy = data.energy.sub(1e50)
        data.energyUp.second = true
        button.disabled = true
    }
    if (upgrade == "third" && data.energy.greaterThanOrEqualTo(1e100)) {
        data.energy = data.energy.sub(1e100)
        data.energyUp.third = true
        button.disabled = true
    }
    if (upgrade == "fourth" && data.energy.greaterThanOrEqualTo(1e150)) {
        data.energy = data.energy.sub(1e150)
        data.energyUp.fourth = true
        button.disabled = true
        data.dimensions = 3
    }
}
function energyEffects() {
    if (data.energyUp.third) {
        data.extraDupes = data.energy.exponent / 100;
        button = document.getElementById("third").innerText = "Extra duplicators based on energy (+"+ formatNumber(new Decimal(data.extraDupes)) + ") \n Cost: 1e100 Energy"
        data.duplicators.dupes = new Decimal(2).pow(data.duplicators.amount.add(data.extraDupes));
    }
}
function saveGame() {
    localStorage.setItem("Save", JSON.stringify(data))
    console.log("saved")
}
function Load(save, data) {
    for(i in data) {
		if(save[i] === undefined) {
			save[i] = data[i];
		}
		if(typeof save[i] === "object") {
			Load(save[i],data[i]);
		}
		if(typeof save[i] === "string") {
			save[i] = new Decimal(save[i]);
		}
    }
    return save;
}

var savegame = JSON.parse(localStorage.getItem("Save"))
if (savegame !== null) {
    data = Load(savegame, data);
    
}

setInterval(saveGame, 15000);

function reset() {
    if (confirm("Are you sure?")) {
		localStorage.setItem("Save", null)
        location.reload();
    }
}
setInterval(GameLoop, 50);
function GameLoop() {
    updateUniverseSize();
    updatePressureDebuff();
    updateNullSpace();
    updateScraps();
    updateEffects();
    updateEnergy();
    energyEffects();
}
function render() {
    document.getElementById("duplicatorCount").innerHTML = "Duplicators: " + data.duplicators.amount;
    document.getElementById("buyDuplicator").innerText = "Price for 1: " + formatNumber(data.duplicators.cost) + " scraps";
    document.getElementById("voidCompressorCount").innerHTML = "Void Compressors: " + data.voidCompressors.amount;
    document.getElementById("buyVoidCompressor").innerText = "Price for 1: " + formatNumber(data.voidCompressors.cost)  + " null space";
    document.getElementById("spaceRefactorCount").innerHTML = "Space Refactors: " + data.spaceRefactors.amount;
    document.getElementById("buySpaceRefactor").innerText = "Price for 1: " + formatNumber(data.spaceRefactors.cost) + " scraps";
    if (data.unlockedEnergy) {
        document.getElementById("energyTab").style.display = "inline"
        if (data.energyUp.first > 0) {
            document.getElementById("first").innerText = "Increase compressing power (x"+ formatNumber(new Decimal(data.compressionPower)) + ") \n Cost: " + formatNumber(data.energyUp.firstCost) + " Energy"
        }
        if (data.energyUp.second) {
            document.getElementById("second").disabled = true
        }
        if (data.energyUp.third) {
            document.getElementById("third").disabled = true
        }
        if (data.energyUp.fourth) {
            document.getElementById("fourth").disabled = true
        }
    }
}

