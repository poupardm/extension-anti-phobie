// Load text from locale files
document.title = chrome.i18n.getMessage("extName");
document.querySelector("#popupTitle").innerHTML = chrome.i18n.getMessage("extName");
document.querySelector("#settingText").innerHTML = chrome.i18n.getMessage("settings");


// ### Window load event ###
window.addEventListener("load", function () {
    // Get state of the extension switch
    chrome.storage.sync.get('enable', function(data) {
        document.querySelector("#extensionButton").checked = data.enable
        // Set the text of the extension button
        let extensionButtonText = document.getElementById("extensionButtonText");
        if(data.enable) extensionButtonText.innerText = chrome.i18n.getMessage("disableExtText");
        else extensionButtonText.innerText = chrome.i18n.getMessage("enableExtText");
    });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        url = tabs[0].url.replace(/(^\w+:|^)\/\//, 'www.');
        chrome.storage.local.get('whitelist', function(data) {
            //alert(url + " -> " + isWhitelisted(data.whitelist, url));
            setStateWhitelist(isWhitelisted(data.whitelist, url));
        });
    });
    wtButtonText.innerText = chrome.i18n.getMessage("wtAddText");
});


function isWhitelisted(whitelist, currentTabUrl) {
    // Get state of the extension switch
    isInWhitelist = false;
    for(var i = 0; i < whitelist.length; i++) {
        if(whitelist[i].toString().localeCompare(currentTabUrl.toString()) === 0) {
            isInWhitelist = true;
        }
    }
    return isInWhitelist;
}

function addWhitelist() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        url = tabs[0].url.replace(/(^\w+:|^)\/\//, 'www.');
        tab = new Array();
        chrome.storage.local.get('whitelist', function(data) {
            tab = data.whitelist
            tab.push(url);
            chrome.storage.local.set({
                whitelist: tab
            });
        });

        chrome.storage.local.get('whitelist', function(data) {
            alert(data.whitelist);
        });
    });

}
// #################################################
function removeWhitelist() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        url = tabs[0].url.replace(/(^\w+:|^)\/\//, 'www.');
        tab = new Array();
        chrome.storage.local.get('whitelist', function(data) {
            tab = data.whitelist
            tab.push(url);
            chrome.storage.local.set({
                whitelist: tab
            });
        });

        chrome.storage.local.get('whitelist', function(data) {
            alert(data.whitelist);
        });
    });
}
// #################################################

var wlButton = document.getElementById("wtButton");
function setStateWhitelist(state) {
    // Confirm if you want to desactivate the extension
    let wtButtonText = document.getElementById("wtButtonText");
    //Si on désactive l'extension
    if (!state) {
        document.getElementById("filled-star").style.display = "none";
        document.getElementById("star").style.display = "inline";
        wlButton.value = 0;
        wtButtonText.innerText = chrome.i18n.getMessage("wtAddText");
    } // Sinon on active l'extension alors
    else {
        document.getElementById("star").style.display = "none";
        document.getElementById("filled-star").style.display = "inline";
        wlButton.value = 1;
        wtButtonText.innerText = chrome.i18n.getMessage("wtRemoveText");
    }
}

// ### Extension switch on click event ###
wlButton.addEventListener("click", function () {
    //Si on désactive l'extension
    if (wlButton.value == 0) {
        setStateWhitelist(true);
        addWhitelist();
    } // Sinon on active l'extension alors
    else {
        setStateWhitelist(false)
    }
});

// ### Extension switch on click event ###
var extensionButton = document.getElementById("extensionButton");
extensionButton.addEventListener("click", function () {

    // Confirm if you want to desactivate the extension
    let extensionButtonText = document.getElementById("extensionButtonText");

    //Si on désactive l'extension
    if (!extensionButton.checked && confirm(chrome.i18n.getMessage("disableExtQuestion"))) {
        // Code à éxécuter si le l'utilisateur clique sur "OK"
        extensionButtonText.innerText = chrome.i18n.getMessage("enableExtText");

    } // Sinon on active l'extension alors
    else if(extensionButton.checked) {
        extensionButtonText.innerText = chrome.i18n.getMessage("disableExtText");
    }
    // Save the state of the switch
    chrome.storage.sync.set({
        enable: document.querySelector("#extensionButton").checked
    });
});

document.querySelector('#optionsButton').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
});