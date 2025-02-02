from detector import ObjectDetector
import numpy as np
import cv2
import argparse
import os

# ap = argparse.ArgumentParser()
# ap.add_argument("-d","--detector",required=True,help="path to trained detector to load...")
# ap.add_argument("-i","--image",required=True,help="path to an image for object detection...")
# ap.add_argument("-a","--annotate",default=None,help="text to annotate...")
# args = vars(ap.parse_args())

# detector = ObjectDetector(loadPath=args["detector"])

# imagePath = args["image"]
detector = ObjectDetector(loadPath="gun.svm")
for file_type in ['test']:
    for img1 in os.listdir(file_type):
        current_image_path = str(file_type) + "/" + str(img1)
        image = cv2.imread(current_image_path)

        detector.detect(image,annotate="Gun",image_path=current_image_path)
