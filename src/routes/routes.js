const express = require("express")
const route = express.Router()
const {createUser, userLogin} =  require("../controllers/userController")
const {createEvent,updateEvent,getById,getAllEvent,deleteEvent} =  require("../controllers/eventController")

route.post("/register", createUser)
route.post("/login", userLogin)


route.post("/events" , createEvent)
route.get("/events/:id", getById)
route.get("/events", getAllEvent)
route.put ("/events/:id", updateEvent)
route.delete("/events/:id", deleteEvent)










module.exports = route