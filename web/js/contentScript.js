
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        hideIMGS(request.hide)
    sendResponse({farewell: "goodbye"});
    return true;
});

function hideIMGS(state) {
    var imagesList = document.getElementsByTagName('img');
    if(state) {
        for(var i = 0; i < imagesList.length; i++) {
            imagesList[i].classList.add("blur");
        }
    } else {
        for(var i = 0; i < imagesList.length; i++) {
            imagesList[i].classList.remove("blur");
        }
    }
}


