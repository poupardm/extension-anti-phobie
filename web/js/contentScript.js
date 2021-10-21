
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.hide) {
            var imagesList = document.getElementsByTagName('img');
            for(var i = 0; i < imagesList.length; i++) {
                imagesList[i].classList.add("blur");
            }
            sendResponse({farewell: "goodbye"});
        }
    return true;
});