// Récupération de messages
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    hideIMGS(request.hide)
    return true;
});

/** Cacher les images
 * - Description : Fonction permettant de cacher les images
 *                 d'une page
 **/
function hideIMGS(state) {
    let i;
// Récupération de toutes les images de la page
    var imagesList = document.getElementsByTagName('img');
    // Si on doit cacher les images alors
    if(state) {
        // Pour chaque images on ajoute la classe hide
        for(i = 0; i < imagesList.length; i++) {
            imagesList[i].classList.add("hide");
        }
    } else {
        // Pour chaque images on enlève la classe hide
        for(i = 0; i < imagesList.length; i++) {
            imagesList[i].classList.remove("hide");
        }
    }
}


