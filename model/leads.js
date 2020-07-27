const mongoose = require('mongoose');
const Joi = require('joi');

const Lead =  mongoose.model('Lead', new mongoose.Schema({

  first_name : {
      type : String,
      required : true
  },
  last_name : {
      type : String,
      required : true
  },
  mobile : {
      type : String,
      required : true,
      unique: true
  },
  email : {
      type : String,
      required : true,
      unique: true
  },
  location_type : {
      type: String,
      enum:['Country','City','Zip']
      //required : true
  },
  location_string : {
      type : String,
      required: true
  },
  status : {
    type: String,  
    enum:['Created','Contacted'],
    default:'Created'
  },
  communication : {
    type: String,
    default:null
  }

}));

const validateLead = ((lead)=>{
    const schema = {
        first_name : Joi.string().required(),
        last_name : Joi.string().required(),
        mobile : Joi.string().min(10).max(10).required(),
        email: Joi.string().required().email(),
        location_type: Joi.string().valid('Country','City','Zip'),
        location_string: Joi.string().required(),
        status: Joi.string().valid('Created','Contacted'),
        communication: Joi.string()
     };
     return Joi.validate(lead , schema)
})

module.exports.Lead = Lead;
module.exports.validate = validateLead;