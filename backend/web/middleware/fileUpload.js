const albunsBackendDir = "Albuns";
const multer = require("multer");

let AlbumStorage = multer.diskStorage({ //multers disk storage settings
    destination: (req, file, cb) => {
        
        dir = __dirname + '/../../' + 'Albuns';
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        
        cb(null, file.originalname);
    }
});


exports.uploadFile = multer({ //multer settings
    storage: AlbumStorage
}).single('file');

