var button = document.getElementById("extension-button");
button.addEventListener("click", (function () {

    var textButton = document.getElementById("text-extension-button");
    if (!button.checked && confirm( "Êtes-vous sûr(e) de vouloir désactiver l'extension ?" ) ) {
        // Code à éxécuter si le l'utilisateur clique sur "OK"
        textButton.innerText = "Activer l'extension";
    }
    else if(button.checked) textButton.innerText = "Désactiver l'extension";

}));