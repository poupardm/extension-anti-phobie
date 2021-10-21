from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
import shutil
from imageai.Classification import ImageClassification

def is_downloadable(url):
    if ".jpg" not in url and ".png" not in url and ".svg" in url:
        print("Je suis là")
        return False
    h = requests.head(url, allow_redirects=True)
    header = h.headers
    content_type = header.get('content-type')
    if 'text' in content_type.lower():
        return False
    if 'html' in content_type.lower():
        return False
    return True

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/api/phobie")
def api():
    args = request.args
    os.makedirs("image_dl")

    lien = args['url']
    print(lien)
    data_images = json.loads('{ }')
    final_data = json.loads('{ }')

    if(is_downloadable(lien)):
        #if lien.find('/'):
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
            print(fichier+" :")
            try:
                predictions, percentage_probabilities = prediction.classifyImage(("image_dl/"+fichier), result_count=3)
                for index in range(len(predictions)):
                    print(predictions[index] , " : " , percentage_probabilities[index])
                    data_images.update({predictions[index]: percentage_probabilities[index]})
            except ValueError:
                print("CANT DOWNLOAD")
                continue;
    shutil.rmtree("image_dl")
    final_data.update({lien:data_images})
    return jsonify(final_data)

if __name__ == "__main__":
    app.run(debug=True)
