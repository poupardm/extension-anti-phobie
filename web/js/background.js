chrome.runtime.onInstalled.addListener(() => {
});



chrome.webNavigation.onCompleted.addListener(function(details) {
    let url = "http://127.0.0.1:5000/api/phobie?url=";
    url += details.url + "&phobies=herpetophobie";
    // IF activate \/
    //getJSON(url);
});




function getJSON(url){
    var el = document.querySelector("img");
    for (var t in el) {
        console.log(t);
    }
    fetch(url).then(response => response.json())
        .then(data => {
            for (var i in data.herpetophobie) {
                console.log(i);
            }
        })
}