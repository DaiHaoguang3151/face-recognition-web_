import * as faceapi from 'face-api.js';

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

    // const ctx = canvas.getContext("2d");
    // const color = "#FF3838";
    // const colorRGBA = 'rgba(255, 56, 56, 0.2)'; 

    // faceData.forEach(singleFace => {
    //     // draw boxes
    //     const box = singleFace.box
    //     const x1 = box._x;
    //     const y1 = box._y;
    //     const width = box._width;
    //     const height = box._height;

    //     ctx.fillStyle = colorRGBA;   
    //     ctx.fillRect(x1, y1, width, height);

    //     ctx.strokeStyle = color;
    //     ctx.lineWidth = Math.max(Math.min(ctx.canvas.width, ctx.canvas.height) / 200, 2.5);
    //     ctx.strokeRect(x1, y1, width, height);
    // })

    if (faceData.length === 0) {
        console.log("no faces");
    } else if (faceData.length > 1) {
        console.log("more than one faces");
    } else {
        const targetFace = faceData[0];
        return {image: cropImage(image, targetFace), detections: detections};
    };

    return {image: null, detections: detections};
}

/**
 * Crop the roi region after face alignment
 * @param {HTMLImageElement} image   // Original image
 * @param {Array} targetFace 
 */
export const cropImage = (image, targetFace) => {
    // align
    const box = targetFace.box;
    const leftEye = targetFace.leftEye;
    const rightEye = targetFace.rightEye;

    let leftEyeCenterX = 0;
    let leftEyeCenterY = 0;
    let rightEyeCenterX = 0;
    let rightEyeCenterY = 0;

    for (let i = 0; i < leftEye.length; i++) {
        leftEyeCenterX += leftEye[i]._x;
        leftEyeCenterY += leftEye[i]._y;
        rightEyeCenterX += rightEye[i]._x;
        rightEyeCenterY += rightEye[i]._y;
    };

    leftEyeCenterX /= leftEye.length;
    leftEyeCenterY /= leftEye.length;
    rightEyeCenterX /= rightEye.length;
    rightEyeCenterY /= rightEye.length;

    const angle = Math.atan2(leftEyeCenterY - rightEyeCenterY, rightEyeCenterX - leftEyeCenterX);
    const faceCenterX = targetFace.box._x + targetFace.box._width / 2;
    const faceCenterY = targetFace.box._y + targetFace.box._height / 2;
    
    const croppedImage = new Image();

    const canvas = document.createElement("canvas");
    canvas.width = box.width;
    canvas.height = box.height;
    
    const ctx = canvas.getContext("2d");

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.drawImage(image, -faceCenterX, -faceCenterY);

    croppedImage.src = canvas.toDataURL("image/png");
    // document.body.appendChild(canvas);
    return croppedImage;
}