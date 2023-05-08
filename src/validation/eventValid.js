const Joi = require("joi")


const eventvalid = Joi.object({

    type: Joi.string().required().label("event"),    
    name: Joi.string().required().label("name"),    
    tagline: Joi.string().required().label("tagline"),    
    schedule: Joi.string().required().label("schedule"),    
    description: Joi.string().required().label("description"),
    moderator:  Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).label('userId'), 
    image: Joi.string().label("image"),    
    category: Joi.string().required().label("category"),    
    sub_category: Joi.string().required().label("sub_category"),    
    rigor_rank: Joi.number().required().label("rigor_rank"),  
    // attendees:Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/).label('UserID')),

    
    });
const updateEventValid = Joi.object({

    type: Joi.string().label("event"),    
    name: Joi.string().label("name"),    
    tagline: Joi.string().label("tagline"),    
    schedule: Joi.string().label("schedule"),    
    description: Joi.string().label("description"),
    moderator:  Joi.string().pattern(/^[0-9a-fA-F]{24}$/).label('userId'), 
    image: Joi.string().label("image"),    
    category: Joi.string().label("category"),    
    sub_category: Joi.string().label("sub_category"),    
    rigor_rank: Joi.number().label("rigor_rank"),  
    // attendees:Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/).label('UserID')),

    
    });

    module.exports = {eventvalid,updateEventValid}