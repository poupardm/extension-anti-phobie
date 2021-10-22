
// Activer l'extention lors de l'ouverture du navigateur
chrome.storage.local.set({
    enable: true
});

/** Event onInstalled
 * - Description : Se lance lors de l'installation de l'extension
 **/
chrome.runtime.onInstalled.addListener(() => {
    // Initialisation de variables dans le stockage
    chrome.storage.local.set({
        whitelist: new Array(),
        blacklist: new Array(),
        enable: true
    });
});


/** Event onUpdated
 * - Description : Se lance lors de l'update d'une page
 **/
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Récupération de l'état de l'extension
    chrome.storage.local.get('enable', function(data) {
        // Récupération des infos de la page
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            // Envoie d'un message
            chrome.tabs.sendMessage(tabs[0].id, {hide: data.enable});
        });
    });
});



/*
chrome.webNavigation.onCompleted.addListener(function(details) {
    let url = "http://127.0.0.1:5000/api/phobie?url=";
    url += details.url + "&phobies=herpetophobie";
    // IF activate \/
    //getJSON(url);
});


function getJSON(url){
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
}*/