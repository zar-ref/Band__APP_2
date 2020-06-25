const Albuns = require('../../models/albuns');
const AlbunsRelations = require('../../models/albunsUsersRelation');
const connection = require('../../util/database');
const albunsDir = __dirname + '/../../../Albuns/';
const fsExtra = require("fs-extra");
const fs = require("fs");
const path = require("path");

const imageTypes = ['jpeg', 'JPEG', 'jpg', 'JPG', 'png', 'PNG'];

exports.getAlbunsMaxId = (req, res, next) => {
    let maxAlbumId;
    console.log("cheguei aqui na get albns max id");
    
    connection.query("SELECT `AUTO_INCREMENT` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'band_app' AND TABLE_NAME = 'albuns'", {raw:true})
        .then(result => {
            maxAlbumId = result[0][0].AUTO_INCREMENT;
            res.status(200).json({
                message:"Identificador do último album encontrado.",
                maxAlbumId: maxAlbumId
            });
        }).catch(err => {
            res.status(401).json({
                message: 'Falha ao obter o identificador do último album.',
                maxAlbumId: -1
            });
        })

}

exports.postUploadFile =  (req, res, next) => {
    console.log("no upload File com req.body = ", req.body);
    const dir = albunsDir + `${req.body.dir}/`;
    console.log("dir = " ,dir);
    console.log("albuns dir temp = " ,albunsDir + req.file.filename);
    fsExtra.move(albunsDir + req.file.filename, dir+req.file.filename, { overwrite: true } , err =>{
        if(err){
            console.log(err);
            res.status(401).json({
                message: "Upload de Ficheiro Falhou"
            });
        }
        else {
            res.status(200).json({
                message: "Upload de Ficheiro completo"
            });
        }        
    });
   
}

exports.deleteFile = (req, res, next) => {
    const fileToDelete = albunsDir + `${req.query.albumId}/${req.query.fileToDelete}`;
    
    try {
        fsExtra.removeSync(fileToDelete )
        return res.status(200).json({        
            message:"Ficheiro Apagado com sucesso"
        });
                   
    }
    catch (err) {
        console.log(err);       
        return res.status(401).json({
            message: "Apagar Ficheiro Falhou"
        }); 
    }
    
    
}


exports.getDownloadFile =  (req, res, next) => {
    console.log(req.query)
    const dir =  req.query.dir;
    const music = req.query.music;
    const filePath = albunsDir + dir + '/' + music;
    res.sendFile(path.resolve(filePath) , err => {
        if (err) {
            console.log(err);
            res.status(err.status).end();
          }
    });
}

exports.putUpdateAlbumName = (req, res, next) => {
    console.log(req.body);
    
    const albumId= req.body.albumId;
    const newAlbumName = req.body.newAlbumName;
    console.log("na post update " , albumId);
    Albuns.update(
        {name: newAlbumName} ,
        {where: {albumId: albumId}} 
      ).then(()=> {
        res.status(200).json({
            message: "Nome alterado com sucesso"
        });
      }).catch(err => {
          res.status(401).json({
          message: "Alteração do Nome falhou"
        });
      })     
     
}
exports.putUpdateAlbumDescription = (req, res, next) => {
    console.log(req.body);
    const albumId = req.body.albumId;
    const newAlbumDescription = req.body.newAlbumDescription

        Albuns.update(
            {description: newAlbumDescription} ,
            {where: {albumId: albumId}} 
          ).then(()=> {
            res.status(200).json({
                message: "Descrição alterada com sucesso"
            });
          }).catch(err => {
            res.status(401).json({
            message: "Alteração da Descrição falhou"
          });
        })   
    
}

exports.deleteAlbum = (req, res, next) => {
    const dir =  req.query.albumId;
    console.log(dir);

    try {
        fsExtra.removeSync(albunsDir + dir );
        Albuns.destroy({
            where: {
                albumId: dir
            }
        })
        .then(()=>{
            let promise;
            promise = AlbunsRelations.destroy({where: {albumId: albumToDelete} })
            return Promise.resolve(promise)      
        
        })
        .then(result => {
            return res.status(200).json({
                message:"Album Apagado com sucesso"
            });
        })
                   
    }
    catch (err) {
        console.log(err);       
        return res.status(401).json({
            message: "Apagar Album Falhou"
        }); 
    }
    
}


exports.postCreateAlbum =  (req, res, next) => {
    console.log("no create album ",req.body.newAlbumDir);
    const newAlbumName = req.body.newAlbumName;
    const newAlbumDescription = req.body.newAlbumDescription;
    const newAlbumUserRole = req.body.newAlbumUserRole;

    Albuns.findOne({where:{name: newAlbumName}})
        .then(album => {
            if(album){
                const error = new Error('Já existe um album com esse nome.');
                error.statusCode = 401;
                throw error;               
            }
            else {
                const newAlbumDir = albunsDir + req.body.newAlbumDir
                Albuns.create({
                    name: newAlbumName,
                    path: newAlbumDir,
                    date: new Date(),
                    description: newAlbumDescription,
                    role: newAlbumUserRole
                }).then(response =>{
                    console.log(response);
                    return res.status(200).json({
                    message: "Album Criado com Sucesso!"
                    });
                })
            }
            
            
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
                err.message = 'Upload de Album falhou por erro no servidor.\n Por favor contactar o administrador.'
            }
            res.status(err.statusCode).send({
                message: err.message
              });
        })

}

exports.getAlbuns =  (req, res, next) => {
    let fetchedAlbuns = [];
    
    Albuns.findAll({attributes: ['albumId', 'name', 'path', 'date', 'description' , 'role'], order:[['albumId' , 'DESC']]})
        .then(albuns => {
            // console.log("na get albuns com --> ", albuns.length);
            // fetchedAlbuns = albuns;
             albuns.forEach(album =>{
                // console.log("album no for each");
                // console.log(album);
                let imgUrl = "";
                let musicsUrls = [];

                fs.readdirSync(album.path).forEach(file => {
                    // let pathToFile = album.path + '/' + file;
                    let pathToFile = file;
                    console.log(pathToFile);
                    if(   imageTypes.includes(file.split('.')[1]) ){
                        imgUrl = pathToFile;
                        
                    }
                    else {
                            musicsUrls.push(pathToFile);
                    }   
                    
                        
                });   
                fetchedAlbuns.push({
                    albumId:  album.albumId,
                    name: album.name,
                    path: album.path,
                    date: album.date,
                    description: album.description,
                    imgUrl: imgUrl,
                    musicsUrls: musicsUrls,
                    userRole: album.role
                });            
               
            });
            // console.log("terminou");
            return res.status(200).json({
                albuns: fetchedAlbuns
            });
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({
                message: "Erro ao obter os Albuns"
            })
        });
        

}