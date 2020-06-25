const express = require("express");

const router = express.Router();
const checkIsAdmin = require('../middleware/checkIsAdmin');
const libraryController = require('../controllers/admin-zone/library');

router.get('/get-books' , libraryController.getBooks);
router.post('/post-book' , checkIsAdmin, libraryController.postBook);
router.delete('/delete-book' , checkIsAdmin, libraryController.deleteBook);
router.put('/edit-book' , checkIsAdmin, libraryController.updateBook);

module.exports = router;