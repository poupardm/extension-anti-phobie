chrome.webNavigation.onCompleted.addListener(function(details) {
    let url = "http://127.0.0.1:5000/api/phobie?url=";
    url += details.url + "&phobies=herpetophobie";
    getJSON(url);
});

function getJSON(url){
    fetch(url).then(response => response.json())
        .then(data => {
            for (var i in data.herpetophobie) {

            }
        })
}