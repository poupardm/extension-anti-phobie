// Load text from locale files
document.title = chrome.i18n.getMessage("optionPageTitle");
document.querySelector("#optionsTitle").innerHTML = chrome.i18n.getMessage("optionPageTitle");
//document.querySelector("#settingsText").innerHTML = chrome.i18n.getMessage("settings");
document.querySelector("#typeOfPhobiaText").innerHTML = chrome.i18n.getMessage("typeOfPhobiaText");
document.querySelector("#araText").innerHTML = chrome.i18n.getMessage("araText");
document.querySelector("#reptText").innerHTML = chrome.i18n.getMessage("reptText");
document.querySelector("#saveButtonText").innerHTML = chrome.i18n.getMessage("save");
document.querySelector(".tab-general").classList.add("hideTab");
document.querySelector(".tab-blacklist").classList.add("hideTab");


// ### Extension switch on click event ###
document.getElementById("whitelist-link").addEventListener("click", function () {
    selectedMenu("whitelist")
});
document.getElementById("general-link").addEventListener("click", function () {
    selectedMenu("general")
});
document.getElementById("blacklist-link").addEventListener("click", function () {
    selectedMenu("blacklist")
});

/** Select and change the menu display
 *      - Params : string linkName
 **/
function selectedMenu(linkName) {
    var tabGeneral = document.querySelector(".tab-general");
    var tabWhitelist = document.querySelector(".tab-whitelist");
    var tabBlacklist = document.querySelector(".tab-blacklist");
    switch (linkName) {
        case "whitelist":
            var whitelistLink = document.getElementById("whitelist-link");
            document.getElementById("general-link").classList.remove("active");
            document.getElementById("blacklist-link").classList.remove("active");
            whitelistLink.className = "active";
            if(!tabGeneral.classList.contains("hideTab")) tabGeneral.classList.add("hideTab");
            if(!tabBlacklist.classList.contains("hideTab")) tabBlacklist.classList.add("hideTab");
            if(tabWhitelist.classList.contains("hideTab")) tabWhitelist.classList.remove("hideTab");
            break;
        case "blacklist":
            var blacklistLink = document.getElementById("blacklist-link");
            document.getElementById("general-link").classList.remove("active");
            document.getElementById("whitelist-link").classList.remove("active");
            blacklistLink.className = "active";
            if(!tabGeneral.classList.contains("hideTab")) tabGeneral.classList.add("hideTab");
            if(tabBlacklist.classList.contains("hideTab")) tabBlacklist.classList.remove("hideTab");
            if(!tabWhitelist.classList.contains("hideTab")) tabWhitelist.classList.add("hideTab");
            break;
        default:
            var generalLink = document.getElementById("general-link");
            document.getElementById("blacklist-link").classList.remove("active");
            document.getElementById("whitelist-link").classList.remove("active");
            generalLink.className = "active";
            if(tabGeneral.classList.contains("hideTab")) tabGeneral.classList.remove("hideTab");
            if(!tabBlacklist.classList.contains("hideTab")) tabBlacklist.classList.add("hideTab");
            if(!tabWhitelist.classList.contains("hideTab")) tabWhitelist.classList.add("hideTab");
            break;
    }
}

/** Remove a website from the whitelist
 *      - Event type : onclick
**/
document.getElementById("removeButtonWhitelist").addEventListener("click", function () {
    // For each website in the list do
    var whitelistDropdown = document.querySelector("#whitelistDropdown");
    Array.from(whitelistDropdown.options).forEach(function(option_element) {
        // Get information from the current value
        if(option_element.selected && option_element.value != 0 && confirm("Êtes-vous sûr(e) de vouloir supprimer '" + option_element.text + "' de la liste blanche ?")) whitelistDropdown.remove(whitelistDropdown.selectedIndex);
        if (whitelistDropdown.length === 1) { whitelistDropdown[0].text = "Aucun site dans la liste..."; whitelistDropdown.setAttribute("disabled", "true");}
    });
});

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

/*
// ### Extension switch on click event ###
var wtButton = document.getElementById("wtButton");
wtButton.addEventListener("click", function () {
    var tab = new Array("https://google.fr", "https://google.com");
    var nb = tab.push("http://banane.fr/");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log(tabs[0].url);
        chrome.storage.sync.set({
            activeTabUrl: tab.push(tabs[0].url)
        });
    });
    tab.forEach(function(item, index, array) {
        console.log(item, index);
    });

    chrome.storage.sync.get('activeTabUrl', function(data) {
        console.log(data);
    });

});
*/


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