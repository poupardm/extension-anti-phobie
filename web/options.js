
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

// ### Save button on click event ###
var saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", function () {
    // Save the states of the phobia checkbox
    chrome.storage.sync.set({
        araCheckbox: document.querySelector('#araCheckbox').checked,
        reptCheckbox: document.querySelector('#reptCheckbox').checked
    });
});