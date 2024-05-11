/**
 * calculate distance between embeddings
 * @param {ort.Tensor} embedding1  
 * @param {ort.Tensor} embedding2 
 */
export const calculateSimilarity = (embedding1, embedding2) => {
    
    let dotProduct = 0;
    for (let i = 0; i < 128; i++) {
        dotProduct += embedding1.data[i] * embedding2.data[i];
    }
    // console.log(embedding1[0], embedding2[0], embedding1[0] * embedding2[0])

    // 计算每个向量的长度（模）
    let lengthEmbedding1 = 0;
    let lengthEmbedding2 = 0;
    for (let i = 0; i < 128; i++) {
        lengthEmbedding1 += embedding1.data[i] * embedding1.data[i];
        lengthEmbedding2 += embedding2.data[i] * embedding2.data[i];
    }
    lengthEmbedding1 = Math.sqrt(lengthEmbedding1);
    lengthEmbedding2 = Math.sqrt(lengthEmbedding2);
    console.log(dotProduct, lengthEmbedding1)

    // 计算余弦相似度
    let cosineSimilarity = dotProduct / (lengthEmbedding1 * lengthEmbedding2);
    return cosineSimilarity;
}