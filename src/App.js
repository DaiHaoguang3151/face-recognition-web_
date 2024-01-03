import React, { useState, useRef, useEffect } from "react";
import { Tensor, InferenceSession } from "onnxruntime-web";
import * as faceapi from 'face-api.js'
import Loader from "./components/loader";
import { recognize } from "./utils/recognize";
import "./style/App.css";
import * as tf from '@tensorflow/tfjs';
import { setWasmPaths } from "@tensorflow/tfjs-backend-wasm";


const App = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState("Loading OpenCV.js...");
    const [image1, setImage1] = useState(null);   
    const [image2, setImage2] = useState(null);
    // input
    const inputImage1 = useRef(null);
    const inputImage2 = useRef(null);
    // image
    const imageRef1 = useRef(null);
    const imageRef2 = useRef(null);  
    // canvas
    const canvasRef1 = useRef(null);
    const canvasRef2 = useRef(null);

    // model info of facenet -> face recognition
    const modelInfo = {
        name: "facenet.onnx",
        inputShape: [1, 3, 160, 160]
    }

    // model selection -> face detection
    let useSsdDetector = true;
    let useTinyLandmark = false;

    // set backend wasm
    async function init() {
        // setWasmPaths('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/');
        // setWasmPaths('../node_modules/@tensorflow/tfjs-backend-wasm/dist/');
        // copy wasm files from '../node_modules/@tensorflow/tfjs-backend-wasm/dist/'  and 
        setWasmPaths(`${process.env.PUBLIC_URL}/static/js/`);   
        await tf.setBackend('wasm');
        await tf.ready();
        console.log(tf.getBackend())  // webgl
    }
    init();
    
    cv["onRuntimeInitialized"] = async () => {
        setLoading("Loading FaceNet model...");
        const facenet = await InferenceSession.create(`${process.env.PUBLIC_URL}/model/${modelInfo.name}`);
        setSession(facenet);

        if (useSsdDetector) {
            await faceapi.nets.ssdMobilenetv1.loadFromUri("/model");
        } else {
            await faceapi.nets.tinyFaceDetector.loadFromUri("/model");
        };
        
        if (useTinyLandmark) {
            await faceapi.nets.faceLandmark68TinyNet.loadFromUri("/model");
        } else {
            await faceapi.nets.faceLandmark68Net.loadFromUri("/model");
        };

        console.log("backend==> ", tf.getBackend())  // webgl
        setLoading(false);
    }

    return (
        <div className="App">
            {loading && <Loader>{loading}</Loader>}
            <div className="header">
                <h1>FaceNet App</h1>
                <p>
                    FaceNet application live on browser powered by {" "}
                    <code>onnxruntime-web</code>
                </p>
                <p>
                    Serving : <code className="code">{modelInfo.name}</code>
                </p>
            </div>

            <input
                type="file"
                ref={inputImage1}
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                    if (image1) {
                        URL.revokeObjectURL(image1);
                        setImage1(null);
                    }

                    const url = URL.createObjectURL(e.target.files[0]);
                    imageRef1.current.src = url;
                    setImage1(url);
                }}
            />

            <input
                type="file"
                ref={inputImage2}
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                    if (image2) {
                        URL.revokeObjectURL(image2);
                        setImage2(null);
                    }

                    const url = URL.createObjectURL(e.target.files[0]);
                    imageRef2.current.src = url;
                    setImage2(url);
                }}
            />


            <div className="content">
                <img
                    ref={imageRef1}
                    src="#"
                    alt=""
                    style={{ display: image1 ? "block" : "none" }}
                    onLoad={() => {
                        //
                    }}
                />

                <canvas
                    id="canvas1"
                    width={modelInfo.inputShape[2]}
                    height={modelInfo.inputShape[3]}
                    ref={canvasRef1}
                />
            </div>

            <div className="content">
                <img
                    ref={imageRef2}
                    src="#"
                    alt=""
                    style={{ display: image2 ? "block" : "none" }}
                    onLoad={() => {
                        //
                    }}
                />

                <canvas
                    id="canvas2"
                    width={modelInfo.inputShape[2]}
                    height={modelInfo.inputShape[3]}
                    ref={canvasRef2}
                />
            </div>

            <div className="btn-container">
                <button
                    onClick={() => {
                        inputImage1.current.click();
                    }}
                >
                    Upload image1
                </button>

                <button
                    onClick={() => {
                        inputImage2.current.click();
                    }}
                >
                    Upload image2
                </button>
                
                <button onClick={() => {
                    recognize(
                        imageRef1.current,
                        imageRef2.current,
                        canvasRef1.current,
                        canvasRef2.current,
                        session,
                        modelInfo.inputShape,
                        useSsdDetector,
                        useTinyLandmark
                        )
                }}>
                Calculate Distance
                </button>
            </div>
        </div>
    );
};

export default App;