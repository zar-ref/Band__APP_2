const express = require("express");
const router = express.Router();

const userController = require('../controllers/admin-zone/users');
const albunsController = require('../controllers/admin-zone/albuns');
const checkIsAdmin = require('../middleware/checkIsAdmin');
const fileUpload = require('../middleware/fileUpload')

//Users
router.get('/users/users', checkIsAdmin  , userController.getUsers );
router.put('/users/update-user-type', checkIsAdmin  , userController.putUpdateUserRole );
router.delete('/users/delete-user' , checkIsAdmin  , userController.deleteUser);

//Albuns
router.get('/albuns/get-max-album-id' , checkIsAdmin , albunsController.getAlbunsMaxId);
router.post('/albuns/upload-file' ,  checkIsAdmin , fileUpload.uploadFile, albunsController.postUploadFile );
router.post('/albuns/create-album' ,  checkIsAdmin , albunsController.postCreateAlbum );
router.get('/albuns/get-albuns' ,  checkIsAdmin , albunsController.getAlbuns );
router.delete('/albuns/delete-file' , checkIsAdmin, albunsController.deleteFile);
router.get( '/albuns/download-file/'  , checkIsAdmin , albunsController.getDownloadFile );
router.put('/albuns/update-album-name' , checkIsAdmin , albunsController.putUpdateAlbumName);
router.put('/albuns/update-album-description' , checkIsAdmin , albunsController.putUpdateAlbumDescription);
router.delete('/albuns/delete-album' , checkIsAdmin, albunsController.deleteAlbum);
module.exports = router;