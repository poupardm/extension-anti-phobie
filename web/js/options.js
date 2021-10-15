// Load text from locale files
document.title = chrome.i18n.getMessage("optionPageTitle");
document.querySelector("#optionsTitle").innerHTML = chrome.i18n.getMessage("optionPageTitle");
document.querySelector("#settingsText").innerHTML = chrome.i18n.getMessage("settings");
document.querySelector("#typeOfPhobiaText").innerHTML = chrome.i18n.getMessage("typeOfPhobiaText");
document.querySelector("#araText").innerHTML = chrome.i18n.getMessage("araText");
document.querySelector("#reptText").innerHTML = chrome.i18n.getMessage("reptText");
document.querySelector("#saveButtonText").innerHTML = chrome.i18n.getMessage("save");


// ### Window load event ###
window.addEventListener("load", function () {
    // Get state of the extension switch
    chrome.storage.sync.get('extensionButton', function(data) {
        document.querySelector("#extensionButton").checked = data.extensionButton
        // Set the text of the extension button
        let extensionButtonText = document.getElementById("extensionButtonText");
        if(data.extensionButton) extensionButtonText.innerText = chrome.i18n.getMessage("disableExtText");
        else extensionButtonText.innerText = chrome.i18n.getMessage("enableExtText");
    });

    // Set state of the arachnophobia checkbox
    chrome.storage.sync.get('araCheckbox', function(data) {
        document.querySelector("#araCheckbox").checked = data.araCheckbox
    });

    // Set state of the reptile phobia checkbox
    chrome.storage.sync.get('reptCheckbox', function(data) {
        document.querySelector("#reptCheckbox").checked = data.reptCheckbox
    });
});

// ### Extension switch on click event ###
var extensionButton = document.getElementById("extensionButton");
extensionButton.addEventListener("click", function () {
    // Confirm if you want to desactivate the extension
    let extensionButtonText = document.getElementById("extensionButtonText");
    if (!extensionButton.checked && confirm( chrome.i18n.getMessage("disableExtQuestion") ) ) {
        // Code à éxécuter si le l'utilisateur clique sur "OK"
        extensionButtonText.innerText = chrome.i18n.getMessage("enableExtText");
    } else extensionButton.checked = true;

    if(extensionButton.checked) extensionButtonText.innerText = chrome.i18n.getMessage("disableExtText");

    // Save the state of the switch
    chrome.storage.sync.set({
        extensionButton: document.querySelector("#extensionButton").checked
    });
});

// ### Save button on click event ###
var saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", function () {
    // Save the states of the phobia checkbox
    chrome.storage.sync.set({
        araCheckbox: document.querySelector('#araCheckbox').checked,
        reptCheckbox: document.querySelector('#reptCheckbox').checked
    });
});