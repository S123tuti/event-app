const express = require("express");
const router = express.Router();

const {createEvent, getById, getAllEvent, updateEvent, deleteEvent} = require("../controllers/eventController");
const {createUser, userLogin} = require("../controllers/userController")
const {authentication,authorization} = require("../middleware/auth")


// ===================================user==========================================================================

router.post('/register', createUser);
router.post('/login', userLogin);

// =================================events========================================================================
router.post('/events', createEvent);
router.get('/events/:id', getById);
router.get('/events', getAllEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);


module.exports = router;
