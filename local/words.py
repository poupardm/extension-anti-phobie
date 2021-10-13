from bs4 import BeautifulSoup as bs
import requests
import json

page = requests.get("https://jardinage.lemonde.fr/dossier-1296-vipere.html#:~:text=Les%20vip%C3%A8res%20sont%20nombreuses%2C%20autour,de%20Seoane%20(Vipera%20seonaei).")

soup = bs(page.content, "html5lib")

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

for i in soup.find_all('img'): #Pour chaque image sur la page
    verif = False
    alt = i.get('alt') #Récupération de l'alt de l'image
    if alt != "":
        with open('file.json') as json_file: #Ouvre le dictionnaire de données
            data = json.load(json_file)
            for p in data: #Pour chaque mot du dictionnaire
                if p in alt and data[p] == 5: #Si le mot est trouvé
                    verif = True
                    print(alt, " : ", data[p]) #Mettre la stat (Ex: serpent=100%)
                    break

    ok = False
    if verif == False: 
        avant = i.parent
        while(ok == False and avant != None): #Tant qu'un mot déterminant à 100% la phobie n'est pas trouvé et que le corps à un parent
            for t in avant.find_all(text=True):
                if t != "\n" and len(t) != 0 and t.parent.name not in blacklist: #Si le text est non-vide
                    with open('file.json') as json_file:
                        mydata = json.load(json_file) 
                        for pi in mydata:
                            if pi in t and mydata[pi] == 5: #Compare les mots du dictionnaire avec le texte de la page 
                                #Définir le fait qu'il y a la phobie à 100% 
                                ok = True
                                break
            avant = avant.parent                  
