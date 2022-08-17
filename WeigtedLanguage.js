let outelement = document.querySelector("#out");
let rules = [];

document.querySelector("#produce").addEventListener("click", () => {
    let out = ""
    let ruletext = document.querySelector("#rulearea").value.split(/\r?\n/);
    let num = document.querySelector("#num").value;


    for (let i = 0; i < ruletext.length; i++) {
        if(ruletext[i].match(/^ +/)){
            let param = ruletext[i].split(/\"/);
            let text = param[1];
            let weight = param[2].trim();
            if(weight == "") weight = 1;
            else weight = +weight;
            rules[rules.length - 1].replacelist.push({replace: text, weight: weight})
        }else{
            let text = ruletext[i].slice(1, -1);
            rules.push({rule: text, replacelist: []} );
        }
    }

    //console.log(rules)

    for (let i = 0; i < num; i++) {
        let final = "S";
        let changesHasHappened = true;
        while(changesHasHappened){
            changesHasHappened = false;
            rules.forEach(rule => {
                let regex = new RegExp(rule.rule);
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
                let newFinal = final.replace(regex, replacer);
                if(!changesHasHappened) changesHasHappened = final != newFinal;
                final = newFinal;
            });
        }
        out += final + "\n";
    }

    outelement.innerHTML = out;
});