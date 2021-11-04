// Récupération de messages
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //document.body.classList.add("hide");
    if(request.hide) {
        var div = document.createElement("div");
        div.classList.add("loadingDiv");
        div.id = "loading";
        div.innerHTML = "<h1>Chargement en cours...</h1>";
        document.body.appendChild(div);

        let phobias = [], rept = false, ara = false, clown = false;
        // Set state of the arachnophobia checkbox
        chrome.storage.local.get('araCheckbox', function (data) {
            if (data.araCheckbox) {
                phobias.push({"ara": data.araCheckbox});
                ara = true;
            }
            // Set state of the reptile phobia checkbox
            chrome.storage.local.get('reptCheckbox', function (data) {
                if (data.reptCheckbox) {
                    phobias.push({"rept": data.reptCheckbox});
                    rept = true;
                }
                chrome.storage.local.get('clownCheckbox', function (data) {
                    if (data.clownCheckbox) {
                        phobias.push({"clown": data.clownCheckbox});
                        clown = true;
                    }
                    makeURL(ara, rept, clown)
                });
            });
        });
        return true;
    }
});

window.addEventListener("load", function () {

});

function makeURL(ara,rept,clown) {
    let url = "http://127.0.0.1:5000/api/phobie?url=";
    url += window.location.href + "&phobies=";
    let nbPhobia = 0;
    if(ara) nbPhobia++;
    if(rept) nbPhobia++;
    if(clown) nbPhobia++;

    if(ara && nbPhobia > 1) url += "arachnophobie/"
    else if(ara && nbPhobia === 1) url += "arachnophobie";
    if(rept && nbPhobia > 1) url += "herpetophobie/"
    else if(rept && nbPhobia === 1) url += "herpetophobie";
    if(clown && nbPhobia > 1) url += "coulrophobie/"
    else if(clown && nbPhobia === 1) url += "coulrophobie";

    //alert(url);
    // IF activate \/
    getJSON(url);
    document.getElementById('loading').remove();
}

/** Cacher les images
 * - Description : Fonction permettant de cacher les images
 *                 d'une page
 **/
/*function hideIMGS(state) {
    let i;
// Récupération de toutes les images de la page
    var imagesList = document.getElementsByTagName('img');
    // Si on doit cacher les images alors
    if(state) {
        // Pour chaque images on ajoute la classe hide
        for(i = 0; i < imagesList.length; i++) {
            imagesList[i].classList.add("hide");
        }
    } else {
        // Pour chaque images on enlève la classe hide
        for(i = 0; i < imagesList.length; i++) {
            imagesList[i].classList.remove("hide");
        }
    }
}*/

function getJSON(url){
    chrome.storage.local.get('whitelist', function (data) {
        let whitelist = false;
        for(let i = 0; i < data.whitelist.length; i++) {
            if(window.location.hostname === data.whitelist[i]) {
                console.log("WHITELIST");
                whitelist = true;
                break;
            }
        }
        if(!whitelist) {
            var el = document.querySelector("img");
            for (var t in el) {
                console.log(t);
            }
            fetch(url).then(response => response.json())
            .then(data => {
                for (var i in data.herpetophobie) {
                    console.log(i);
                }
            })
        }

    });
}


/*


function checkPicturesPhobia(phobias) {
    let ara, rept, clown;
    // Appel de l'api pour le rept sinon imagga
    phobias.forEach(function(item){
        if(item.ara != null) ara = item.ara;
        if(item.rept != null) rept = item.rept;
        if(item.clown != null) clown = item.clown;
    });
    if(ara) fetchDico("arachnophobie");
    if(ara) fetchDico("herpetophobie");
    if(ara) fetchDico("coulrophobie");

    /*if(ara) getData(chrome.runtime.getURL("/dico/dico_arachnophobie.json"), (data) => test.push({ data }));
    if(rept) getData(chrome.runtime.getURL("/dico/dico_herpetophobie.json"), (data) => console.log({ data }));
    if(clown) getData(chrome.runtime.getURL("/dico/dico_coulrophobie.json"), (data) => console.log({ data }));*/

    // Si entre 75 et 100 = cache sinon => api
    // Pour chaque image => si alt = dico -> pourcentage + variable (1 fois mots)
    // Check parent (si 10 parents regarde 5 parents)
/*}
function fetchDico(type) {
    let url = chrome.runtime.getURL("/dico/dico_"+type+".json"), obj, dico_en, dico_fr, imagesList = document.getElementsByTagName('img');
    fetch(url)
        .then(res => res.json())
        .then(data => obj = data)
        .then(() => {
            dico_en = obj[0].en;
            dico_fr = obj[0].fr;
            //console.log(dico_en[Object.keys(dico_fr)])
            for(let i = 0; i < Object.keys(dico_en).length; i++) {
                checkIfExist(dico_en[Object.keys(dico_en)[i]].word,imagesList)
                checkIfExist(dico_fr[Object.keys(dico_fr)[i]].word,imagesList)
            }
        });
}

function checkIfExist(wordDico, imagesList) {
    for(let i = 0; i < imagesList.length; i++) {

       // console.log(imagesList[i].alt)
        if( imagesList[i].alt != "" && (imagesList[i].alt.toLowerCase()).includes(wordDico.toLowerCase())) {
           // console.log("!!!!!!!!!!!!!!!!!! " + imagesList[i].alt.toLowerCase() + " = " + wordDico.toLowerCase());
            $(imagesList[i]).addClass("hide")
        }
        //console.log(imagesList[i].alt);
    }
}
*/
