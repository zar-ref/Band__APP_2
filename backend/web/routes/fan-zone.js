const express = require("express");

const router = express.Router();

const fanZoneController = require('../controllers/fan-zone');
const checkIsAdminOrActive= require('../middleware/checkIsAdminOrActive');


router.post('/post-access-to-album' , checkIsAdminOrActive,  fanZoneController.postAccessToAlbum);
router.get('/get-albuns/' , checkIsAdminOrActive, fanZoneController.getAlbuns);
module.exports = router