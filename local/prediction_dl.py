from bs4 import BeautifulSoup as bs
import requests
import os, shutil
from imageai.Classification import ImageClassification

link = "https://fr.wikipedia.org/wiki/Araneae"

def is_downloadable(url):
    if 'http' not in url and 'https' not in url and url[:2] == "//":
        url="https:"+url
        return url
    elif 'http' not in url and 'https' not in url and url[:1] == "/":
        pos = link.count("/") - 2
        url= link.rsplit('/', pos)[0]+url
        return url
    h = requests.head(url, allow_redirects=True)
    header = h.headers
    content_type = header.get('content-type')
    if 'text' in content_type.lower():
        return False
    if 'html' in content_type.lower():
        return False
    return url

page = requests.get(link)

soup = bs(page.content, "html5lib")

os.makedirs("image_dl")
for image in soup.find_all('img'):
    lien = image.get('src')
    lien = is_downloadable(lien)
    if(lien != None and lien != "" and lien != False):
        if lien.find('/'):
            filename = ("image_dl/"+lien.rsplit('/', 1)[1])
            print("filename = "+filename)
            r = requests.get(lien, allow_redirects=True)
            open(filename, 'wb').write(r.content)
            print("ok : "+lien)

list = os.listdir('image_dl')

if list:
    execution_path = os.getcwd()
    prediction = ImageClassification()
    prediction.setModelTypeAsResNet50()
    prediction.setModelPath( execution_path + "/resnet50_imagenet_tf.2.0.h5")
    prediction.loadModel()

    for fichier in list:
        if "png" in fichier or "jpg" in fichier:
            print(fichier+" :")
            try:
                predictions, percentage_probabilities = prediction.classifyImage(("image_dl/"+fichier), result_count=3)
                for index in range(len(predictions)):
                    print(predictions[index] , " : " , percentage_probabilities[index])
            except ValueError:
                print("OOPS")
                continue;

shutil.rmtree("image_dl")
