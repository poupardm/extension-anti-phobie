from flask import Flask, request, jsonify
from flask_cors import CORS
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
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/api/phobie")
def hello():
    args = request.args

    no1 = args['url']
    no2 = args['phobies']  # Chaque phobie séparée d'un /

    page = requests.get(str(no1))
    soup = bs(page.content, "html5lib")
    final_data = json.loads('{ }')

    for phobie in no2.split("/"):
        z = json.loads('{ }')
        if phobie != "":
            for i in soup.find_all("img"):  # Pour chaque image sur la page
                percent = 0
                words_tab = []
                verif = False
                alt = i.get('alt')  # Récupération de l'alt de l'image
                src = i.get('src')  # Récupération du lien de l'image
                if alt != "" and alt != None and src != None and src != "":
                    with open('dico_'+phobie+'.json') as json_file: # Ouvre le dictionnaire de données
                        data = json.load(json_file)
                        for language in data:
                            for mot in data[language]:
                                if mot in alt and data[language][mot] == 100:
                                    verif = True
                                    words_tab.append(mot)
                                    z.update({str(src): data[language][mot]})
                                    break
                                elif mot in alt and mot not in words_tab and data[language][mot] != 0:
                                    words_tab.append(mot)
                                    percent = percent + int(data[language][mot])
                                    if percent > 75:
                                        verif = True
                                        if percent <= 100:
                                            z.update({str(src): percent})
                                        else:
                                            z.update({str(src): 100})
                                        break
                
                ok = False
                max_parent = 0
                count_parent = 0

                if verif == False:
                    back = i.parent
                    while(back != None):  # Calcul le nombre de parents de l'image
                        max_parent = max_parent+1
                        back = back.parent
                    avant = i.parent
                    # Tant qu'un mot déterminant à 100% la phobie n'est pas trouvé et que le corps à un parent
                    while(ok == False and count_parent < max_parent/2):
                        count_parent = count_parent + 1
                        for t in avant.find_all(text=True):
                            # Si le text est non-vide
                            if t != "\n" and len(t) != 0 and t.parent.name not in blacklist:
                                with open('dico_'+phobie+'.json') as json_file:
                                    mydata = json.load(json_file)
                                    for langue in mydata:  # Pour chaque langue
                                        for word in mydata[langue]: #Compare les mots du dictionnaire avec le texte de la page
                                            if word in t and mydata[langue][word] == 100:
                                                ok = True
                                                words_tab.append(word)
                                                z.update({str(src): mydata[langue][word]})
                                                break
                                            elif word in t and word not in words_tab and mydata[langue][word] != 0:
                                                words_tab.append(word)
                                                percent = percent + int(mydata[langue][word])
                                                print(word,":",percent)
                                                if percent > 75:
                                                    ok = True
                                                    if percent <= 100:
                                                        z.update({str(src): percent})
                                                    else:
                                                        z.update({str(src): 100})
                                                    break
                        avant = avant.parent
                if verif == False and ok == False:
                    z.update({str(src): percent})
                words_tab.clear
            final_data.update({phobie: z})
    return jsonify(final_data)

if __name__ == "__main__":
    app.run(debug=True)
