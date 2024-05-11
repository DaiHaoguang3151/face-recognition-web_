import * as faceapi from "@vladmandic/face-api";
import { cropImage } from "./crop_image";
import { renderBoxAndLandmarks } from "./render_box_and_landmarks";

/**
 * Detect faces using faceapi
 * @param {HTMLImageElement} image    The image to be detected
 * @param {HTMLCanvasElement} canvas  The canvas for drawing
 * @param {Boolean} useSsdDetector    Whether to use ssdDetector
 * @param {Boolean} useTinyLandmark   Whether to use TinyLandmark
 */
export const detectFace = async (image, canvas, useSsdDetector=true, useTinyLandmark=false) => {
    const options = useSsdDetector ? new faceapi.SsdMobilenetv1Options() : new faceapi.TinyFaceDetectorOptions();
    const detections = await faceapi.detectAllFaces(image, options).withFaceLandmarks(useTinyLandmark);
    
    const faceData = [];
    detections.forEach(detection => {
        const box = detection.detection._box;       
        const landmarks = detection.landmarks;      
        const leftEye = landmarks.getLeftEye();     
        const rightEye = landmarks.getRightEye();
        faceData.push({box: box, leftEye: leftEye, rightEye: rightEye});  
    });

    renderBoxAndLandmarks(canvas, faceData, image, true, true);

    if (faceData.length === 0) {
        console.log("no faces");
    } else if (faceData.length > 1) {
        console.log("more than one faces");
    } else {
        const targetFace = faceData[0];
        return {image: cropImage(image, targetFace), detections: detections};
    };

    return {image: null, detections: detections};
};