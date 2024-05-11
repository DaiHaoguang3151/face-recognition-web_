const fs = require("fs");
const path = require("path");

// copy onnxruntime-web WebAssembly files to public/ folder
const srcFolder = path.join(__dirname, "node_modules", "onnxruntime-web", "dist");
const destFolder = path.join(__dirname, "public", "static", "js");

// copy tfjs WebAssembly files to public/ folder
const srcFolder1 = path.join(__dirname, "node_modules", "@tensorflow", "tfjs-backend-wasm", "dist");
const destFolder1 = path.join(__dirname, "public", "static", "js");

// copy necessary files to public/ folder
const srcFolder2 = path.join(__dirname, "node_modules", "@mediapipe", "face_detection");
const destFolder2 = path.join(__dirname, "public", "static", "js");

if (fs.existsSync(destFolder)) {
  fs.rmSync(destFolder, { recursive: true, force: true });
}
fs.mkdirSync(destFolder, { recursive: true });

fs.copyFileSync(path.join(srcFolder, "ort-wasm.wasm"), path.join(destFolder, "ort-wasm.wasm"));
fs.copyFileSync(
  path.join(srcFolder, "ort-wasm-simd.wasm"),
  path.join(destFolder, "ort-wasm-simd.wasm")
);
fs.copyFileSync(
  path.join(srcFolder, "ort-wasm-threaded.wasm"),
  path.join(destFolder, "ort-wasm-threaded.wasm")
);
fs.copyFileSync(
  path.join(srcFolder, "ort-wasm-simd-threaded.wasm"),
  path.join(destFolder, "ort-wasm-simd-threaded.wasm")
);

// if (fs.existsSync(destFolder1)) {
//     fs.rmSync(destFolder1, { recursive: true, force: true });
// }
// fs.mkdirSync(destFolder1, { recursive: true });

fs.copyFileSync(path.join(srcFolder1, "tfjs-backend-wasm-simd.wasm"), path.join(destFolder1, "tfjs-backend-wasm-simd.wasm"));
fs.copyFileSync(
  path.join(srcFolder1, "tfjs-backend-wasm-threaded-simd.wasm"),
  path.join(destFolder1, "tfjs-backend-wasm-threaded-simd.wasm")
);
fs.copyFileSync(
  path.join(srcFolder1, "tfjs-backend-wasm.wasm"),
  path.join(destFolder1, "tfjs-backend-wasm.wasm")
);


fs.copyFileSync(
  path.join(srcFolder2, "face_detection_short.binarypb"), 
  path.join(destFolder2, "face_detection_short.binarypb")
)
fs.copyFileSync(
  path.join(srcFolder2, "face_detection_short_range.tflite"), 
  path.join(destFolder2, "face_detection_short_range.tflite")
)
fs.copyFileSync(
  path.join(srcFolder2, "face_detection_solution_simd_wasm_bin.js"), 
  path.join(destFolder2, "face_detection_solution_simd_wasm_bin.js")
)
fs.copyFileSync(
  path.join(srcFolder2, "face_detection_solution_simd_wasm_bin.wasm"), 
  path.join(destFolder2, "face_detection_solution_simd_wasm_bin.wasm")
)

