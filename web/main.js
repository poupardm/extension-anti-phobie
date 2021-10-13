title = chrome.i18n.getMessage("extName");
document.querySelector("#popupTitle").innerHTML = chrome.i18n.getMessage("extName");

// ### Window load event ###
window.addEventListener("load", function () {
    // Get state of the extension switch
    chrome.storage.sync.get('extensionButton', function(data) {
        document.querySelector("#extensionButton").checked = data.extensionButton
        // Set the text of the extension button
        let extensionButtonText = document.getElementById("extensionButtonText");
        if(data.extensionButton) extensionButtonText.innerText = "Désactiver l'extension";
        else extensionButtonText.innerText = "Activer l'extension";
    });
});

// ### Extension switch on click event ###
var extensionButton = document.getElementById("extensionButton");
extensionButton.addEventListener("click", function () {
    // Confirm if you want to desactivate the extension
    let extensionButtonText = document.getElementById("extensionButtonText");
    if (!extensionButton.checked && confirm( "Êtes-vous sûr(e) de vouloir désactiver l'extension ?" ) ) {
        // Code à éxécuter si le l'utilisateur clique sur "OK"
        extensionButtonText.innerText = "Activer l'extension";
    }
    else if(extensionButton.checked) extensionButtonText.innerText = "Désactiver l'extension";
    // Save the state of the switch
    chrome.storage.sync.set({
        extensionButton: document.querySelector("#extensionButton").checked
    });
});

document.querySelector('#optionsButton').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
});