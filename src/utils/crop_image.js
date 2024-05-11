/**
 * Crop the roi region after face alignment
 * @param {HTMLImageElement} image   // Original image
 * @param {Array} targetFace         // Detected face (boundingbox & eye landmarks)
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
    canvas.width = box.width;      // box.width == box._width
    canvas.height = box.height;
    
    const ctx = canvas.getContext("2d");

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.drawImage(image, -faceCenterX, -faceCenterY);

    croppedImage.src = canvas.toDataURL("image/png");
    document.body.appendChild(canvas);
    return croppedImage;
}