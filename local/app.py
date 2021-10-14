from flask import Flask, request, jsonify
from bs4 import BeautifulSoup as bs
import requests
import json

blacklist = [
    '[document]',
    'noscript',
    'header',
    'html',
    'meta',
    'head',
    'input',
    'script',
]

app = Flask(__name__)


@app.route("/api/phobie")
def hello():
    args = request.args

    no1 = args['url']
    no2 = args['phobies']  # Chaque phobie séparée d'un /

    page = requests.get(str(no1))
    soup = bs(page.content, "html5lib")
    fg = json.loads('{ }')

    for phobie in no2.split("/"):
        z = json.loads('{ }')
        if phobie != "":
            for i in soup.find_all('img'):  # Pour chaque image sur la page
                verif = False
                alt = i.get('alt')  # Récupération de l'alt de l'image
                src = i.get('src')  # Récupération du lien de l'image
                if alt != "" and alt != None and src != None and src != "":
                    print(src)
                    # Ouvre le dictionnaire de données
                    with open('dico_'+phobie+'.json') as json_file:
                        data = json.load(json_file)
                        for language in data:
                            for mot in data[language]:
                                if mot in alt and data[language][mot] == 5:
                                    verif = True
                                    z.update({str(src): 100})# Mettre la stat (Ex: serpent=100%)
                                    break

                ok = False
                if verif == False:
                    avant = i.parent
                    # Tant qu'un mot déterminant à 100% la phobie n'est pas trouvé et que le corps à un parent
                    while(ok == False and avant != None):
                        for t in avant.find_all(text=True):
                            # Si le text est non-vide
                            if src != None and t != "\n" and len(t) != 0 and t.parent.name not in blacklist:
                                with open('dico_'+phobie+'.json') as json_file:
                                    mydata = json.load(json_file)
                                    for langue in mydata: #Pour chaque langue 
                                        for word in mydata[langue]: # Compare les mots du dictionnaire avec le texte de la page
                                            if word in t and mydata[langue][word] == 5:
                                                ok = True  # Définir le fait qu'il y a la phobie à 100%
                                                z.update({str(src): 100})
                                                break
                        avant = avant.parent
            fg.update({phobie:z})
    return jsonify(fg)

if __name__ == "__main__":
    app.run(debug=True)
