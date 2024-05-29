/**
 * Explicação da função de retorno cb
 *========================================================
 destination: function (req, file, cb) { ... }:
Aqui, cb é uma função de retorno de chamada fornecida pelo multer. Ela é usada para comunicar o resultado de uma operação assíncrona de volta ao multer.
Quando a função destination é chamada, ela determina o diretório de destino onde o arquivo será armazenado com base nos parâmetros recebidos (req, file) e executa a função de retorno de chamada cb.
O primeiro argumento passado para cb é null, indicando que não ocorreu um erro durante a execução da função.
O segundo argumento passado para cb é o caminho para o diretório de destino calculado pela função destination.
filename: (req, file, cb) => { ... }:
Assim como no caso anterior, cb é uma função de retorno de chamada.
Quando a função filename é chamada, ela determina o nome do arquivo que será salvo com base nos parâmetros recebidos (req, file) e executa a função de retorno de chamada cb.
O primeiro argumento passado para cb é null, indicando que não ocorreu um erro durante a execução da função.
O segundo argumento passado para cb é o nome do arquivo gerado.
fileFilter(req, file, cb) { ... }:
Neste caso, cb também é uma função de retorno de chamada.
Quando a função fileFilter é chamada, ela verifica se o arquivo enviado atende aos critérios estabelecidos (no caso, se é um arquivo PNG ou JPG) e executa a função de retorno de chamada cb com o resultado da verificação.
Se o arquivo não atender aos critérios, cb é chamado com um erro como primeiro argumento, informando que o upload não é permitido.
Se o arquivo atender aos critérios, cb é chamado com undefined como primeiro argumento, indicando que o upload é permitido.
Em resumo, em todas as ocorrências, a função cb é usada para comunicar o resultado de uma operação de volta ao multer, seja para fornecer um caminho de destino para salvar um arquivo, um nome de arquivo gerado, ou para indicar se o upload do arquivo é permitido ou não. 
 *
 */

const multer = require("multer");
const path = require("path");

// Destination to store image
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('mostre o que tem no file:;::::',file)
        let folder = "";

        if (req.baseUrl.includes('users')) {
        folder = "users";
        } else if (req.baseUrl.includes('pets')) {
        folder = "pets";
        }
        cb(null, `public/images/${folder}/`);// null, não houver erro - public/images/${folder}, caminho onde o arquivo será salvo
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + String(Math.floor(Math.random()* 100)) + path.extname(file.originalname));
    },
    });
    const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
        // upload only png and jpg format
        return cb(new Error("Por favor, envie apenas png ou jpg!"));
        }
        cb(undefined, true);
    },
});

module.exports = { imageUpload };