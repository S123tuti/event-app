const express = require("express");
const router = express.Router();


const {createUser, userLogin} = require("../controllers/userController")
const {createEvent, getById, getAllEvent, updateEvent, deleteEvent, attendees} = require("../controllers/eventController");
const {authentication,authorization} = require("../middleware/auth")


// ===================================user====================================================================================

router.post('/register', createUser);
router.post('/login', userLogin);

// =================================events=====================================================================================
router.post('/events',authentication, createEvent);
router.get('/events/:id',authentication,authorization ,getById);
router.get('/events',authentication,getAllEvent);
router.put('/events/:id',authentication,authorization ,updateEvent);
router.delete('/events/:id',authentication,authorization , deleteEvent);

// =====================================AttendieesApi==========================================================================
router.post("/attendees/:userId",authentication,attendees)

module.exports = router;
