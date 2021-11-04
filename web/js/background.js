
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
        enable: true,
        araCheckbox:true,
        reptCheckbox:true,
        clownCheckbox:true
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