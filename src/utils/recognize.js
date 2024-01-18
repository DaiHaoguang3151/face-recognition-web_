import { Tensor } from "onnxruntime-web";
import { detectFace } from "./detect_face";
import { calculateDistance } from "./calculate_distance";

/**
 * Output embedding vector for single face
 * @param {HTMLImageElement} image         Input image
 * @param {ort.InferenceSession} session   Face recognition session
 * @param {Number[]} inputShape            Model input shape
 */
export const embed = async (image, session, inputShape) => {
    const [modelWidth, modelHeight] = inputShape.slice(2);

    // Data preprocessing
    const mat = cv.imread(image);    
    const matC3 = new cv.Mat(mat.rows, mat.cols, cv.CV_8UC3);
    cv.cvtColor(mat, matC3, cv.COLOR_RGBA2BGR)

    // padding image to [n x n] dim
    const maxSize = Math.max(matC3.rows, matC3.cols); // get max size from width and height
    const xPad = maxSize - matC3.cols, // set xPadding
        xRatio = maxSize / matC3.cols; // set xRatio
    const yPad = maxSize - matC3.rows, // set yPadding
        yRatio = maxSize / matC3.rows; // set yRatio
    const matPad = new cv.Mat(); // new mat for padded image
    cv.copyMakeBorder(matC3, matPad, 0, yPad, 0, xPad, cv.BORDER_CONSTANT, [0, 0, 0, 255]); // padding black


    // Normalization
    const input = cv.blobFromImage(
        matPad,
        1 / 255.0,
        new cv.Size(modelWidth, modelHeight),
        new cv.Scalar(0, 0, 0),
        true,
        false
    )

    const tensor = new Tensor("float32", input.data32F, inputShape); // to ort.Tensor
    const { output } = await session.run({ images: tensor }); // run session and get output layer

    // Memory release
    mat.delete();
    matC3.delete();
    matPad.delete();
    input.delete();

    return output;
};


/**
 * face recognition (facenet) (face detection using face-api)
 * @param {HTMLImageElement} image1    
 * @param {HTMLImageElement} image2    
 * @param {HTMLCanvasElement} canvas1  
 * @param {HTMLCanvasElement} canvas2  
 * @param {ort.InferenceSession} session   facenet session
 * @param {Number[]} inputShape        model input shape
 * @param {Boolean} useSsdDetector     Whether to use SSD detector
 * @param {Boolean} useTinyLandmark    Whether to use tiny landmark detector
 */
export const recognize = async (image1, image2, canvas1, canvas2, session, inputShape, useSsdDetector, useTinyLandmark) => {
    const start = performance.now();
    if (image1 && image2) {
        // Set canvas width and height
        canvas1.width = image1.width;
        canvas1.height = image1.height;
        canvas2.width = image2.width;
        canvas2.height = image2.height;

        // Face detection
        const det1 = await detectFace(image1, canvas1, useSsdDetector, useTinyLandmark);
        const det2 = await detectFace(image2, canvas2, useSsdDetector, useTinyLandmark);

        if (!(det1 && det2)) {
            return;
        }

        // Face recognition/comparison
        const face1 = det1.image;
        const face2 = det2.image;
        const embedding1 = await embed(face1, session, inputShape);
        const embedding2 = await embed(face2, session, inputShape);
        const distance = calculateDistance(embedding1, embedding2);

        console.log("Distance between embeddings: ", distance);
        if (distance > 0.85) {
            console.log("Two persons");
        } else {
            console.log("Same person");
        }

    } else {
        console.log("At least 2 images");
    };
    console.log("consume==> ", performance.now() - start);
}