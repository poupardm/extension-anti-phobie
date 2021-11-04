// Chargement de différents textes du popup
document.title = chrome.i18n.getMessage("extName");
document.querySelector("#popupTitle").innerHTML = chrome.i18n.getMessage("extName");
document.querySelector("#settingText").innerHTML = chrome.i18n.getMessage("settings");
// Récupération du bouton d'état et de whitelist du popup
const wlButton = document.getElementById("wtButton");
const extensionButton = document.getElementById("extensionButton");

/** Event load
 * - Description : Se lance lors du chargement du popup
 **/
window.addEventListener("load", function () {
    // Obtenir l'état de l'extension (activée/désactivée)
    chrome.storage.local.get('enable', function(data) {
        // Activation ou non du switch button en fonction de l'état stocké
        document.querySelector("#extensionButton").checked = data.enable
        // Chargement du texte du bouton à partir du dossier _locales
        let extensionButtonText = document.getElementById("extensionButtonText");
        if(data.enable) extensionButtonText.innerText = chrome.i18n.getMessage("disableExtText");
        else extensionButtonText.innerText = chrome.i18n.getMessage("enableExtText");
    });
    // Obtenir les infos de la page courante
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // Récupération et formatage de l'url
        var url = formatURL(tabs[0].url);
        // Obtention de la liste blanche stockée
        chrome.storage.local.get('whitelist', function(data) {
            // Appel de la fonction setStateWhitelist et isWhitelisted
            setStateWhitelist(isWhitelisted(data.whitelist, url));
        });
    });
    //wtButtonText.innerText = chrome.i18n.getMessage("wtAddText");
});



// =-=-=-=-=-=-= Partie concernant la whitelist =-=-=-=-=-=-= \\

/** Event wlButton
 * - Description : Evénement se lancant lors du clic sur le
 *                 bouton d'ajout/suppression de la whitelist
 **/
wlButton.addEventListener("click", function () {
    //Si ajoute le site à la whitelist alors
    if (wlButton.value == 0) {
        setStateWhitelist(true);
        addWhitelist();
    } // Sinon on enlève le site à la whitelist
    else {
        setStateWhitelist(false)
        removeWhitelist();
    }
});


/** Est-il whitelist ?
 * - Description : Fonction permettant de retourner un booléan en si
 *                 le site passé en paramètre est dans la whitelist
 **/
function isWhitelisted(whitelist, currentTabUrl) {
    let isInWhitelist = false;
    // Parcours de chaque site dans la whitelist
    for(var i = 0; i < whitelist.length; i++) {
        // Si le site parcouru correspond ayu site passé en paramètre
        if(whitelist[i].toString().localeCompare(currentTabUrl.toString()) === 0) {
            isInWhitelist = true;
        }
    }
    return isInWhitelist;
}


/** Formatage d'une url
 * - Description : Fonction permettant de formater une url en paramètre de
 *                 http(s)://exemple.fr/test/exemple.html vers www.exemple.fr
 **/
function formatURL(url) {
    // regex pattern permettant de transformer l'url en paramètre
    return url.replace(/(^\w+:|^)\/\//, '').replace(/\/+[a-zA-Z]+.*/, '');
}


/** Ajout dans la whitelist
 * - Description : Fonction permettant d'ajouter un site
 *                 dans la whitelist stockée
 **/
function addWhitelist() {
    // Obtention des infos de la page courante
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // Récupération et formattage de l'url
        var url = formatURL(tabs[0].url);
        // Nouveau tableau vide
        let whitelistTab = new Array();
        // Récupération de la whitelist stockée
        chrome.storage.local.get('whitelist', function(data) {
            // La whitelist stockée est mise dans le tableau
            whitelistTab = data.whitelist
            // On y ajoute l'url récupérer ci-dessus
            whitelistTab.push(url);
            // On sauvegarde la nouvelle whitelist
            chrome.storage.local.set({
                whitelist: whitelistTab
            });
        });
    });
}


/** Suppression dans la whitelist
 * - Description : Fonction permettant de supprime un site
 *                 dans la whitelist stockée
 **/
function removeWhitelist() {
    // Obtention des infos de la page courante
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // Récupération et formattage de l'url
        let url = formatURL(tabs[0].url);
        // Nouveau tableau vide
        let whitelistTab = new Array();
        // Récupération de la whitelist stockée
        chrome.storage.local.get('whitelist', function(data) {
            // La whitelist stockée est mise dans le tableau
            whitelistTab = data.whitelist
            // Parcours de chaque site dans la whitelist
            for(let i = 0; i < whitelistTab.length; i++) {
                // Si l'url est dans la whitelist
                if(url.toString().localeCompare(whitelistTab[i].toString()) === 0) {
                    // On l'enlève
                    whitelistTab.splice(i, 1);
                }
            }
            // On enregistre les changements
            chrome.storage.local.set({
                whitelist: whitelistTab
            });
        });
    });
}


/** Modification de l'état
 * - Description : Fonction permettant de modifier l'état
 *                 visuel du popup en fonction de l'état
 **/
function setStateWhitelist(state) {
    // Récupération du texte du bouton d'ajout dans la whitelist
    let wtButtonText = document.getElementById("wtButtonText");
    // Si l'état est false alors
    if (!state) {
        // Affichage de l'étoile vide
        document.getElementById("filled-star").style.display = "none";
        document.getElementById("star").style.display = "inline";
        wlButton.value = 0;
        // Affichage du texte d'ajout dans la whitelist
        wtButtonText.innerText = chrome.i18n.getMessage("wtAddText");
    }
    else {
        // Affichage de l'étoile pleine
        document.getElementById("star").style.display = "none";
        document.getElementById("filled-star").style.display = "inline";
        wlButton.value = 1;
        // Affichage du texte de suppression de la whitelist
        wtButtonText.innerText = chrome.i18n.getMessage("wtRemoveText");
    }
}




// =-=-=-=-=-=-= Partie concernant le bouton d'état de l'extension =-=-=-=-=-=-= \\

/** Event extensionButton
 * - Description : Evénement se lancant lors du clic sur le
 *                 bouton d'état de l'extension
 **/
extensionButton.addEventListener("click", function () {
    // Récupération du texte d'état de l'extension
    let extensionButtonText = document.getElementById("extensionButtonText");

    //Si on désactive l'extension
    if (!extensionButton.checked && confirm(chrome.i18n.getMessage("disableExtQuestion"))) {
        // Code à éxécuter si le l'utilisateur clique sur "OK"
        extensionButtonText.innerText = chrome.i18n.getMessage("enableExtText");

    } // Sinon on active l'extension alors
    else if(extensionButton.checked) {
        extensionButtonText.innerText = chrome.i18n.getMessage("disableExtText");
    }

    // Sauvergarde de l'état
    chrome.storage.local.set({
        enable: document.querySelector("#extensionButton").checked
    });
});



// =-=-=-=-=-=-= Partie concernant le bouton des paramètres de l'extension =-=-=-=-=-=-= \\

/** Event extensionButton
 * - Description : Evénement se lancant lors du clic sur le
 *                 bouton des paramètres de l'extension
 **/
document.querySelector('#optionsButton').addEventListener('click', function() {
    // Ouverture de la page des options
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
});