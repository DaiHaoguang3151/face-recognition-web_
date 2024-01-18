// import * as tf from '@tensorflow/tfjs-core'
// import * as faceapi from "@vladmandic/face-api"

/**
 * calculate distance between embeddings
 * @param {ort.Tensor} embedding1  
 * @param {ort.Tensor} embedding2 
 */
export const calculateDistance = (embedding1, embedding2) => {
    let distance = 0;
    for (let i = 0; i < embedding1.size; i++) {
        distance += Math.pow(embedding1.data[i] - embedding2.data[i], 2);
    };
    // const distance = (faceapi.euclideanDistance(embedding1.data, embedding2.data)) ** 2;
    return distance;
}