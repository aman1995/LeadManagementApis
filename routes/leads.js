var express = require('express');
var router = express.Router();
const {Lead,validate} = require('../model/leads');

/* GET lead . */
router.get('/leads', function(req, res, next) {
  res.status('400').send({
    status: "failure",      
    reason: "no leadId provided"
  })
});

/* GET lead . */
router.get('/leads/:id', async function(req, res, next) {

   const lead = await Lead.findById(req.params.id);
   if(!lead) res.status('400').send({});
   res.send(lead);
});


/* Add a lead. */
router.post('/leads', async function(req, res, next) {
  
    const result = validate(req.body);
    const dupEmail = await Lead.findOne({email : req.body.email});
    const dupPhoneNumber = await Lead.findOne({mobile : req.body.mobile});

    if(result.error || dupEmail || dupPhoneNumber){
        res.status('400').send({
          status: "failure",      
          reason: "wrong input"
        });
    }
   
    let lead = new Lead({  
      first_name: req.body.first_name,           
      last_name: req.body.last_name,                       
      mobile: req.body.mobile,           
      email: req.body.email,           
      location_type: req.body.location_type,           
      location_string: req.body.location_string
  });
    await lead.save();
    res.status(201).send(lead);
});

/* Update a lead. */
router.put('/leads/:id', async function(req, res, next) {
  
  const result = validate(req.body);
  const dupEmail = await Lead.findOne({email : req.body.email, _id:{'$ne':req.params.id}});
  const dupPhoneNumber = await Lead.findOne({mobile : req.body.mobile, _id:{'$ne':req.params.id}});
  
  if(result.error || dupEmail || dupPhoneNumber){
      res.status('400').send({
        status: "failure",      
        reason: "wrong input"
      });
  }
  
    const lead = await Lead.findByIdAndUpdate(req.params.id,{  
        first_name: req.body.first_name,           
        last_name: req.body.last_name,                       
        mobile: req.body.mobile,           
        email: req.body.email,           
        location_type: req.body.location_type,           
        location_string: req.body.location_string                                                                                                                                                                                                    
    });
    if(!lead) return res.status('404').send(`The customer with given Id not found`)
    res.status(202).send({
        status : "success"
    });
});

/* Remove a lead . */
router.delete('/leads/:id', async function(req, res, next) {

  const lead = await Lead.findByIdAndRemove(req.params.id);
  if(!lead) res.status('400').send({});
  res.status(200).send({
      status : "success"
  });
});

/* Remove lead error */
router.delete('/leads', function(req, res, next) {
  res.status('400').send({
    status: "failure",      
    reason: "no leadId provided"
  })
});

/* Mark a lead */
router.put('/mark_lead/:id', async function(req, res, next) {

    if(!req.body.communication){
        res.status('400').send({
          status: "failure",      
          reason: "no communication status provided"
      })
    }
    const lead = await Lead.findByIdAndUpdate(req.params.id,{            
      status: "Contacted",
      communication: req.body.communication                                                                                                                                                                                                       
  }); 

    res.status(202).send({
      status : "Contacted",
      communication: req.body.communication
    })
    
});

/* Mark lead error */
router.put('/mark_lead', function(req, res, next) {
  res.status('400').send({
    status: "failure",      
    reason: "no leadId provided"
  })
});



module.exports = router;
