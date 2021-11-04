from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup as bs
import requests
import json
import os, shutil
import os.path
from imageai.Classification import ImageClassification

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

def is_downloadable(url, link):
    if ".svg" not in url:
        if 'http' not in url and 'https' not in url and url[:2] == "//":
            url="https:"+url
            return url
        elif 'http' not in url and 'https' not in url and url[:1] == "/":
            pos = link.count("/") - 2
            url= link.rsplit('/', pos)[0]+url
            return url
        try:
            h = requests.head(url, allow_redirects=True)
            header = h.headers
            content_type = header.get('content-type')
        except:
            return False
        if 'text' in content_type.lower():
            return False
        if 'html' in content_type.lower():
            return False
        return url
    else:
        return False

def immaga_prediction(url_image, nb_object):
    api_key = "acc_bd445a4e53dfa84"
    api_secret = "19885794472fea086877c8edb236840f"

    response = requests.get(
        "https://api.imagga.com/v2/tags?image_url=%s" % url_image,
        auth=(api_key, api_secret))

    reponse = response.json()
    for value in reponse['result']['tags']:
        i = 0
        immaga_tab = json.loads("[ ]")
        for value in reponse['result']['tags']:
            if i < nb_object:
                immaga_tab.append({"word" : value['tag']['en'], "score" : value['confidence']})
            else:
                break
            i+=1
        return immaga_tab

@app.route("/api/phobie")
def hello():
    args = request.args

    no1 = args['url']
    no2 = args['phobies']  # Chaque phobie séparée d'un /

    page = requests.get(str(no1))
    soup = bs(page.content, "html5lib")
    final_data = json.loads('[ ]')

    for phobie in no2.split("/"):
        tableau1 = json.loads('[ ]')
        if phobie != "":
            for i in soup.find_all("img"):  # Pour chaque image sur la page
                percent = 0
                words_tab = []
                verif = False
                alt = i.get('alt')  # Récupération de l'alt de l'image
                src = i.get('src')  # Récupération du lien de l'image
                if alt != "" and alt != None and src != None and src != "":
                    with open("Dictionnaires/dico_"+str(phobie)+".json") as json_file: # Ouvre le dictionnaire de données
                        data = json.load(json_file)
                        for tab in data:
                            for language in tab:
                                for mot in tab[language]:
                                    if mot["word"] in alt and {"url" : str(src), "score" : mot["score"]} not in tableau1 and mot["score"] == 100:
                                        verif = True
                                        words_tab.append(mot["word"])
                                        tableau1.append({"url" : str(src), "score" : mot["score"]})
                                        break
                                    elif mot["word"] in alt and {"url" : str(src), "score" : 100} not in tableau1 and mot["word"] not in words_tab and mot["score"] != 0:
                                        words_tab.append(mot["word"])
                                        percent = percent + int(mot["score"])
                                        if percent > 75:
                                            verif = True
                                            tableau1.append({"url" : str(src), "score" : 100})
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
                        for texte in avant.find_all(text=True):
                            # Si le text est non-vide
                            if texte != "\n" and len(texte) != 0 and texte.parent.name not in blacklist and src != None and src != "":
                                with open("Dictionnaires/dico_"+str(phobie)+".json") as json_file:
                                    mydata = json.load(json_file)
                                    for tab in mydata:  # Pour chaque langue
                                        for langue in tab:
                                            for word in tab[langue]: #Compare les mots du dictionnaire avec le texte de la page
                                                if word["word"] in texte and {"url" : str(src), "score" : word["score"]} not in tableau1 and word["score"] == 100:
                                                    ok = True
                                                    words_tab.append(word["word"])
                                                    tableau1.append({"url" : str(src), "score" : word["score"]})
                                                    break
                                                elif word["word"] in texte and {"url" : str(src), "score" : 100} not in tableau1 and word["word"] not in words_tab and word["score"] != 0:
                                                    words_tab.append(word["word"])
                                                    percent = percent + int(word["score"])
                                                    if percent > 75:
                                                        ok = True
                                                        tableau1.append({"url" : str(src), "score" : 100})
                                                        break
                        avant = avant.parent
                if verif == False and ok == False and {"url" : str(src), "score" : percent} not in tableau1:
                    lien = src
                    lien = is_downloadable(lien, no1)
                    if lien != None and lien != "" and lien != False:
                        if phobie != "coulrophobie":
                            if os.path.exists("image_dl") == False:
                                os.makedirs("image_dl")
                            filename = ("image_dl/"+lien.rsplit('/', 1)[1])
                            r = requests.get(lien, allow_redirects=True)
                            open(filename, 'wb').write(r.content)
                            list = os.listdir('image_dl')
                            predict_score = json.loads('[ ]')
                            if list:
                                execution_path = os.getcwd()
                                prediction = ImageClassification()
                                prediction.setModelTypeAsResNet50()
                                prediction.setModelPath( execution_path + "/modeles/resnet50_imagenet_tf.2.0.h5")
                                prediction.loadModel()

                                for fichier in list:
                                    if "png" in fichier or "jpg" in fichier:
                                        try:
                                            predictions, percentage_probabilities = prediction.classifyImage(("image_dl/"+fichier), result_count=3)
                                            for index in range(len(predictions)):
                                                predict_score.append({ "score" : percentage_probabilities[index],"word" : predictions[index]})
                                            tableau1.append({"score" : predict_score,"url" : str(src) })
                                        except:
                                            continue;
                            if os.path.exists("image_dl"):
                                shutil.rmtree("image_dl")
                        else:
                            tableau1.append({"score" : immaga_prediction(lien, 3),"url" : str(src) })
                words_tab.clear
        final_data.append({phobie : tableau1})
    return jsonify(final_data)

if __name__ == "__main__":
    app.run(debug=True)
