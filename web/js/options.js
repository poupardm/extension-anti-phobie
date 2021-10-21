// Load text from locale files
document.title = chrome.i18n.getMessage("optionPageTitle");
document.querySelector("#optionsTitle").innerHTML = chrome.i18n.getMessage("optionPageTitle");
document.querySelector("#saveButtonText").innerHTML = chrome.i18n.getMessage("save");
document.querySelector("#mainSettingsTitle").innerHTML = chrome.i18n.getMessage("mainSettings");

document.querySelector("#settingsHeaderText").innerHTML = chrome.i18n.getMessage("settings");
document.querySelector("#sidebarMain").innerHTML = chrome.i18n.getMessage("mainMenu");
document.querySelector("#sidebarWhitelist").innerHTML = chrome.i18n.getMessage("whitelist");
document.querySelector("#sidebarBlacklist").innerHTML = chrome.i18n.getMessage("blacklist");

document.querySelector("#addButtonWhitelistText").innerHTML = chrome.i18n.getMessage("addWebsiteButton");
document.querySelector("#removeButtonWhitelistText").innerHTML = chrome.i18n.getMessage("removeWebsiteButton");
document.querySelector("#descWhitelist").innerHTML = chrome.i18n.getMessage("whitelistDesc");
document.querySelector("#titleWhitelist").innerHTML = chrome.i18n.getMessage("whitelist");
document.querySelector("#input-whitelist").placeholder = chrome.i18n.getMessage("inputWebsitePlaceholder");
document.querySelector("#input-whitelist").title = chrome.i18n.getMessage("inputWebsiteTitle");
document.querySelector("#settingsHeaderText").innerHTML = chrome.i18n.getMessage("settings");

document.querySelector("#addWebsiteBLButton").innerHTML = chrome.i18n.getMessage("addWebsiteButton");
document.querySelector("#removeWebsiteBLButton").innerHTML = chrome.i18n.getMessage("removeWebsiteButton");
document.querySelector("#descBlacklist").innerHTML = chrome.i18n.getMessage("blacklistDesc");
document.querySelector("#titleBlacklist").innerHTML = chrome.i18n.getMessage("blacklist");
document.querySelector("#input-blacklist").placeholder = chrome.i18n.getMessage("inputWebsitePlaceholder");
document.querySelector("#input-blacklist").title = chrome.i18n.getMessage("inputWebsiteTitle");
document.querySelector("#input-blacklist").title = chrome.i18n.getMessage("inputWebsiteTitle");
document.querySelector("#whitelistDropdown")[0].text = chrome.i18n.getMessage("websitesDropdownFirst");
document.querySelector("#blacklistDropdown")[0].text = chrome.i18n.getMessage("websitesDropdownFirst");


// ### Extension switch on click event ###
document.getElementById("whitelist-link").addEventListener("click", function () {
    loadSelectedMenu("#whitelist")
});
document.getElementById("general-link").addEventListener("click", function () {
    loadSelectedMenu("#general")
});
document.getElementById("blacklist-link").addEventListener("click", function () {
    loadSelectedMenu("#blacklist")
});

// ### Window load event ###
window.addEventListener("load", function () {
    loadSelectedMenu(location.hash);
});

/** Select, load and change the menu display
 *      - Params : string locationHash
 **/
function loadSelectedMenu(locationHash) {
    // Get menus link
    var tabGeneral = document.querySelector(".tab-general");
    var tabWhitelist = document.querySelector(".tab-whitelist");
    var tabBlacklist = document.querySelector(".tab-blacklist");
    switch (locationHash) {
        // If the whitelist menu is selected
        case "#whitelist":
            // Set the whitelist item menu active in the sidebar
            document.getElementById("general-link").classList.remove("active");
            document.getElementById("blacklist-link").classList.remove("active");
            document.getElementById("whitelist-link").className = "active";
            // Display the great div for the whitelist tab and hide other tab
            if(!tabGeneral.classList.contains("hideTab")) tabGeneral.classList.add("hideTab");
            if(!tabBlacklist.classList.contains("hideTab")) tabBlacklist.classList.add("hideTab");
            if(tabWhitelist.classList.contains("hideTab")) tabWhitelist.classList.remove("hideTab");
            // Load the whitelist dropdown
            loadListDropdown(document.querySelector("#whitelistDropdown"),"whitelist");
            break;
        // If the blacklist menu is selected
        case "#blacklist":
            // Set the blacklist item menu active in the sidebar
            document.getElementById("general-link").classList.remove("active");
            document.getElementById("whitelist-link").classList.remove("active");
            document.getElementById("blacklist-link").className = "active";
            // Display the great div for the blacklist tab and hide other tab
            if(!tabGeneral.classList.contains("hideTab")) tabGeneral.classList.add("hideTab");
            if(tabBlacklist.classList.contains("hideTab")) tabBlacklist.classList.remove("hideTab");
            if(!tabWhitelist.classList.contains("hideTab")) tabWhitelist.classList.add("hideTab");
            // Load the blacklist dropdown
            loadListDropdown(document.querySelector("#blacklistDropdown"),"blacklist");
            break;
        // If other menu is selected
        default:
            // Set the general item menu active in the sidebar
            document.getElementById("blacklist-link").classList.remove("active");
            document.getElementById("whitelist-link").classList.remove("active");
            document.getElementById("general-link").className = "active";
            // Display the great div for the general tab and hide other tab
            if(tabGeneral.classList.contains("hideTab")) tabGeneral.classList.remove("hideTab");
            if(!tabBlacklist.classList.contains("hideTab")) tabBlacklist.classList.add("hideTab");
            if(!tabWhitelist.classList.contains("hideTab")) tabWhitelist.classList.add("hideTab");
            // Load and set the text from language file to general tab
            document.querySelector("#typeOfPhobiaText").innerHTML = chrome.i18n.getMessage("typeOfPhobiaText");
            document.querySelector("#araText").innerHTML = chrome.i18n.getMessage("araText");
            document.querySelector("#reptText").innerHTML = chrome.i18n.getMessage("reptText");

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
            break;
    }
}

/** onclick Event listener of add and remove button of whitelist/blacklist tab **/
document.getElementById("removeButtonWhitelist").addEventListener("click", function () {removeInList(document.querySelector("#whitelistDropdown"),"whitelist");});
document.getElementById("removeButtonBlackList").addEventListener("click", function () {removeInList(document.querySelector("#blacklistDropdown"),"blacklist");});
document.getElementById("addButtonWhitelist").addEventListener("click", function () {addInList("whitelist");});
document.getElementById("addButtonBlackList").addEventListener("click", function () {addInList("blacklist");});

/** Add a website to white/black-list
*      - Params : string type
**/
function addInList(type) {
    // Get website input
    var websiteInput = document.getElementById("input-"+type)
    // If the pattern of the website input is valid and the value of the input not equals to ""
    if(websiteInput.checkValidity() && websiteInput.value != "") {
        var tab = new Array();
        var isInList = false;
        // If type is whitelist
        if(type == "whitelist") {
            // Get all data from whitelist
            chrome.storage.local.get("whitelist", function (data) {
                tab = data.whitelist;
                // Check if the new input already exist in the whitelist
                tab.forEach(function (itemTab) {
                    data.whitelist.forEach(function (itemWhitelist) {
                        //console.log("itemWhitelist = " + itemWhitelist + ", itemTab = " + itemTab);
                        if (itemWhitelist == websiteInput.value && itemTab == websiteInput.value) {
                            isInList = true;
                        }
                    });
                });
                // If the new input is not whitelisted -> add in whitelist
                if (!isInList) {
                    tab.push(websiteInput.value);
                    chrome.storage.local.set({
                        whitelist: tab
                    });
                }
            });
            // Load whitelist in dropdown
            loadListDropdown(document.querySelector("#whitelistDropdown"), "whitelist");
        } else { // Else is blacklist
            // Get all data from blacklist
            chrome.storage.local.get("blacklist", function (data) {
                tab = data.blacklist;
                // Check if the new input already exist in the blacklist
                tab.forEach(function (itemTab) {
                    data.blacklist.forEach(function (itemBlacklist) {
                        if (itemBlacklist == websiteInput.value && itemTab == websiteInput.value) {
                            isInList = true;
                        }
                    });
                });
                // If the new input is not blacklisted -> add in blacklist
                if (!isInList) {
                    tab.push(websiteInput.value);
                    chrome.storage.local.set({
                        blacklist: tab
                    });
                }
            });
            // Load blacklist in dropdown
            loadListDropdown(document.querySelector("#blacklistDropdown"), "blacklist");
        }
    }
}

/** Remove a website to white/black-list
 *      - Params : object dropdown
 *                 string type
 **/
function removeInList(dropdown, type) {
    // For each website in the list do
    Array.from(dropdown.options).forEach(function(option_element) {
        // If the current option is selected, the value not equal at 0 and the confirm was true then
        if(option_element.selected && option_element.value != 0 && confirm("Êtes-vous sûr(e) de vouloir supprimer '" + option_element.text + " de cette liste ?")) {
            var tab = new Array();
            // Get all data from param type list
            chrome.storage.local.get(type, function(data) {
                if(type == "whitelist") tab = data.whitelist;
                else if(type == "blacklist") tab = data.blacklist;

                // Removing the element from local list
                for(var i = 0; i < tab.length; i++){
                    if ( tab[i] === option_element.text) {
                        tab.splice(i, 1);
                    }
                }
                // Set the new list in storage
                if(type == "whitelist") {
                    chrome.storage.local.set({
                        whitelist: tab
                    });
                } else if(type == "blacklist"){
                    chrome.storage.local.set({
                        blacklist: tab
                    });
                }
            });
        }
    });
    // Load the list in dropdown
    loadListDropdown(dropdown, type);
}


/** Load website in whitelist dropdown from storage **/
function loadListDropdown(dropdown, type) {
    // Clear all things except the first one
    var i, L = dropdown.options.length - 1;
    for(i = L; i > 0; i--) {
        dropdown.remove(i);
    }
    // If is whitelist
    if (type == "whitelist") {
        // Get all data from whitelist and add it in dropdown
        chrome.storage.local.get('whitelist', function (data) {
            data.whitelist.forEach(function (item, index, array) {
                let newOption = new Option(item, index + 1);
                dropdown.add(newOption, undefined);
            });
            // If the whitelist don't have website display it in dropdown
            if (data.whitelist.length == 0) {
                dropdown[0].text = chrome.i18n.getMessage("websitesDropdownNothing");
                dropdown.setAttribute("disabled", "true");
            } else {
                dropdown[0].text = chrome.i18n.getMessage("websitesDropdownFirst");
                dropdown.removeAttribute("disabled");
            }
        });
    } else if(type == "blacklist") {
        // Get all data from blacklist and add it in dropdown
        chrome.storage.local.get('blacklist', function (data) {
            data.blacklist.forEach(function (item, index, array) {
                let newOption = new Option(item, index + 1);
                dropdown.add(newOption, undefined);
            });
            // If the blacklist don't have website display it in dropdown
            if (data.blacklist.length == 0) {
                dropdown[0].text = chrome.i18n.getMessage("websitesDropdownNothing");
                dropdown.setAttribute("disabled", "true");
            } else {
                dropdown[0].text = chrome.i18n.getMessage("websitesDropdownFirst");
                dropdown.removeAttribute("disabled");
            }
        });
    }
}

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