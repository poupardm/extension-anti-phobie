from imageai.Classification import ImageClassification
import os

execution_path = os.getcwd()
prediction = ImageClassification()
prediction.setModelTypeAsResNet50()
prediction.setModelPath( execution_path + "/resnet50_imagenet_tf.2.0.h5")
prediction.loadModel()


predictions, percentage_probabilities = prediction.classifyImage("https://jardinage.lemonde.fr/images/dossiers/2017-07/vipere-aspic-110804.jpg", result_count=5)
for index in range(len(predictions)):
  print(predictions[index] , " : " , percentage_probabilities[index])
