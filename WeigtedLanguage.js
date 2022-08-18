let outelement = document.querySelector("#out");

document.querySelector("#produce").addEventListener("click", () => {
    let productionRules = [];
    let transcriptionRules = [];
    let out = [];
    let prodtext = document.querySelector("#rulearea").value.split(/\r?\n/);
    let transtext = document.querySelector("#transcriptionarea").value.split(/\r?\n/);
    let num = document.querySelector("#num").value;
    let deleteDuplicates = document.querySelector("#deleteduplicates").checked;

    for (let i = 0; i < prodtext.length; i++) {
        if(prodtext[i].match(/^ +/)){
            let param = prodtext[i].split(/\"/);
            let text = param[1];
            let weight = param[2].trim();
            if(weight == "") weight = 1;
            else weight = +weight;
            productionRules[productionRules.length - 1].replacelist.push({replace: text, weight: weight})
        }else{
            let text = prodtext[i].trim().slice(1, -1);
            productionRules.push({rule: text, replacelist: []} );
        }
    }

    for (let i = 0; i < transtext.length; i++) {
        let match = transtext[i].match(/^\"(.*)\" ?-\> ?\"(.*)\"$/);
        transcriptionRules.push({rule: match[1], replace: match[2]})
    }

    //console.log(Productionrules)
    
    let table = document.createElement("table");

    outelement.innerHTML = "";

    outelement.appendChild(table);

    let i = 0;
    while (i < num) {
        let final = "S";
        let changesHasHappened = true;
        while(changesHasHappened){
            changesHasHappened = false;
            productionRules.forEach(rule => {
                let replacerMaxInt = function () {
                    let ret = 0;
                    rule.replacelist.forEach(possibleReplacer => {
                        ret += possibleReplacer.weight;
                    });
                    return ret;
                }();
                let replacerInt = Math.floor(Math.random() * replacerMaxInt);
                let replacer = function (){
                    let pick = -1;
                    let thrs = 0;
                    do{
                        thrs += rule.replacelist[++pick].weight;
                    } while(!(thrs > replacerInt))

                    return rule.replacelist[pick].replace;
                }();
                let newFinal = final.replace(new RegExp(rule.rule), replacer);
                if(!changesHasHappened) changesHasHappened = final != newFinal;
                final = newFinal;
            });
        }
        if(!~out.indexOf(final) || !deleteDuplicates){
            let tr =  document.createElement("tr");
            let td = document.createElement("td");
            tr.appendChild(td);
            td.innerText = final;
            table.appendChild(tr);
            i++;
        }
    }

    for (let i = 0; i < num; i++) {
        let tr = table.querySelector(`tr:nth-child(${+i + 1})`);
        let transcription = tr.querySelector("td").innerText;
        transcriptionRules.forEach(rule => {
            transcription = transcription.replaceAll(new RegExp(rule.rule, 'g'), rule.replace)
        })
        let td = document.createElement("td");
        tr.appendChild(td);

        td.innerText = transcription;
    }
});