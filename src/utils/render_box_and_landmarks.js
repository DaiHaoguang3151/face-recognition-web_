/**
 * Render boundingboxes and landmarks of faces
 * @param {HTMLCanvasElement} canvas   The canvas for drawing
 * @param {Array} faceData             The detected face data (boundingbox & eye landmarks)
 * @param {HTMLImageElement} image     The origin image
 * @param {Boolean} drawBox            Whether to draw a box
 * @param {Boolean} drawLandmarks      Whether to draw landmarks
 */
export const renderBoxAndLandmarks = async (canvas, faceData, image, drawBox, drawLandmarks) => {
    // faceData need to be converted before rendering
    const ctx = canvas.getContext("2d");
    const ratio_x = image.width / image.naturalWidth;
    const ratio_y = image.height / image.naturalHeight;

    if (drawBox) {
        // color for boxes
        const color = "#FF3838";
        const colorRGBA = 'rgba(255, 56, 56, 0.2)'; 

        faceData.forEach(singleFace => {
            // draw boxes
            const box = singleFace.box
            const x1 = box._x * ratio_x;
            const y1 = box._y * ratio_y;
            const width = box._width * ratio_x;
            const height = box._height * ratio_y;
    
            ctx.fillStyle = colorRGBA;   
            ctx.fillRect(x1, y1, width, height);
    
            ctx.strokeStyle = color;
            ctx.lineWidth = Math.max(Math.min(ctx.canvas.width, ctx.canvas.height) / 200, 2.5);
            ctx.strokeRect(x1, y1, width, height);
        });
    };

    if (drawLandmarks) {
        faceData.forEach(singleFace => {
            // draw landmarks (eye)
            const leftEye = singleFace.leftEye[0];
            const rightEye = singleFace.rightEye[0];
    
            ctx.beginPath();
            ctx.arc(leftEye._x * ratio_x, leftEye._y * ratio_y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
    
            ctx.beginPath();
            ctx.arc(rightEye._x * ratio_x, rightEye._y * ratio_y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = 'blue';
            ctx.fill();
        });
    };
}
