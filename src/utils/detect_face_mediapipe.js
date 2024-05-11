import { FaceDetection } from "@mediapipe/face_detection"
import { cropImage } from "./crop_image";
import { renderBoxAndLandmarks } from "./render_box_and_landmarks";

/**
 * Detect faces using mediapipe
 * @param {HTMLImageElement} image    The image to be detected
 * @param {HTMLCanvasElement} canvas  The canvas for drawing
 * @param {FaceDetection} faceDetection Instance of FaceDetection
 */
export const detectFaceMediapipe = async (image, canvas, faceDetection) => {
    const detectionResults = await new Promise((resolve, reject) => {
        faceDetection.onResults((results) => {   // register
            resolve(results);
            // TODO: try catch
        });
        faceDetection.send({ image: image });
    });
    const detections = detectionResults.detections;

    const faceData = []
    detections.forEach(detection => {
        // to the same formation as detectFace
        const box = getBoundingBox(detection.boundingBox, image.naturalWidth, image.naturalHeight);
        const landmarks = getLandmarks(detection.landmarks, image.naturalWidth, image.naturalHeight);
        const leftEye = [landmarks[0]];
        const rightEye = [landmarks[1]];
        faceData.push({ box: box, leftEye: leftEye, rightEye: rightEye });
    });

    // render
    renderBoxAndLandmarks(canvas, faceData, image, true, true);

    if (faceData.length === 0) {
        console.log("no faces");
    } else if (faceData.length > 1) {
        console.log("more than one faces");
    } else {
        const targetFace = faceData[0];
        return { image: cropImage(image, targetFace), detections: detections };
    };

    return { image: null, detections: detections };
}


export const getBoundingBox = (mediapipeBoundingBox, imageNaturalWidth, imageNaturalHeight) => {
    let boundingBox = {};
    // top left
    const width = mediapipeBoundingBox.width * imageNaturalWidth;
    const height = mediapipeBoundingBox.height * imageNaturalHeight;
    boundingBox._x = mediapipeBoundingBox.xCenter * imageNaturalWidth - width / 2;
    boundingBox._y = mediapipeBoundingBox.yCenter * imageNaturalHeight - height / 2;

    boundingBox._width = width;
    boundingBox._height = height;
    boundingBox.width = width;
    boundingBox.height = height;
    return boundingBox;
}

export const getLandmarks = (mediapipeLandmarks, imageNaturalWidth, imageNaturalHeight) => {
    const landmarks = [];

    mediapipeLandmarks.forEach(mediapipeLandmark => {
        landmarks.push({ _x: mediapipeLandmark.x * imageNaturalWidth, _y: mediapipeLandmark.y * imageNaturalHeight });
    });
    return landmarks;
};