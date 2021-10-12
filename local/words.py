from bs4 import BeautifulSoup as bs
import requests
import json

page = requests.get("https://fr.wikipedia.org/wiki/Boa")

soup = bs(page.content, "html5lib")

output = ''

blacklist = [
    '[document]',
    'noscript',
    'header',
    'html',
    'meta',
    'head',
    'input',
    'script',
    # there may be more elements you don't want, such as "style", etc.
]

for i in soup.find_all('img'):
    verif = False
    alt = i.get('alt')
    if alt != "":
        with open('file.json') as json_file:
            data = json.load(json_file)
            for p in data:
                if p in alt and data[p] == 5:
                    verif = True
                    print(alt, " : ", data[p])

    ok = False
    if verif == False: 
        avant = i.parent
        while(ok == False and avant != None):
            for t in avant.find_all(text=True):
                if t != "\n" and len(t) != 0 and t.parent.name not in blacklist:
                    with open('file.json') as json_file:
                        mydata = json.load(json_file)
                        for pi in mydata:
                            if pi in t and mydata[pi] == 5:
                                #Définir le fait qu'il y a un serpent à 100% 
                                ok = True
            avant = avant.parent                
