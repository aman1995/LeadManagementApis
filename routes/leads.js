var express = require('express');
var router = express.Router();
const { Lead, validate } = require('../model/leads');
const mongoose = require('mongoose');
const failure = "failure";
const reason = "no leadId provided";
const invalidInput = "wrong input";
const success = "success";

/* Get lead error. */
router.get('/leads', function (req, res, next) {
  res.status('400').send({
    status: failure,
    reason: reason
  })
});

/* GET lead . */
router.get('/leads/:id', async function (req, res, next) {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({
      status: failure,
      reason: invalidInput
    })
  }
  const lead = await Lead.findById(id);
  if (!lead) res.status(404).send({});
  else res.status(200).send(lead);
});


/* Add a lead. */
router.post('/leads', async function (req, res, next) {

  const result = validate(req.body);
  const dupEmail = await Lead.findOne({ email: req.body.email });
  const dupPhoneNumber = await Lead.findOne({ mobile: req.body.mobile });

  if (result.error || dupEmail || dupPhoneNumber) {
    res.status('400').send({
      status: failure,
      reason: invalidInput
    });
  }

  let lead = new Lead({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    mobile: req.body.mobile,
    email: req.body.email,
    location_type: req.body.location_type,
    location_string: req.body.location_string,
  });
  await lead.save();
  res.status(201).send(lead);
});

/* Update a lead. */
router.put('/leads/:id', async function (req, res, next) {

  const result = validate(req.body);
  const id = req.params.id;
  let dupEmail,dupPhoneNumber;
  
  if(mongoose.Types.ObjectId.isValid(id)){
      dupEmail = await Lead.findOne({ email: req.body.email, _id: { '$ne': id } });
      dupPhoneNumber = await Lead.findOne({ mobile: req.body.mobile, _id: { '$ne': id } });
  }

  if (result.error || dupEmail || dupPhoneNumber || !mongoose.Types.ObjectId.isValid(id)) {
    res.status('400').send({
      status: failure,
      reason: invalidInput
    });
  }

  const lead = await Lead.findByIdAndUpdate(id, {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    mobile: req.body.mobile,
    email: req.body.email,
    location_type: req.body.location_type,
    location_string: req.body.location_string
  });
  if (!lead) return res.status('404').send(`The customer with given Id not found`)
  res.status(202).send({
    status: success
  });
});

/* Remove a lead . */
router.delete('/leads/:id', async function (req, res, next) {

  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status('400').send({
      status: failure,
      reason: invalidInput
    })
  }

  const lead = await Lead.findByIdAndRemove(id);
  if (!lead) res.status('400').send({});
  res.status(200).send({
    status: success
  });
});

/* Remove lead error */
router.delete('/leads', function (req, res, next) {
  res.status('400').send({
    status: failure,
    reason: reason
  })
});

/* Mark a lead */
router.put('/mark_lead/:id', async function (req, res, next) {

  const id = req.params.id;

  if (!req.body.communication || !mongoose.Types.ObjectId.isValid(id)) {
    res.status('400').send({
      status: failure,
      reason: invalidInput
    })
  }
  await Lead.findByIdAndUpdate(id, {
    status: "Contacted",
    communication: req.body.communication
  });

  res.status(202).send({
    status: "Contacted",
    communication: req.body.communication
  })

});

/* Mark lead error */
router.put('/mark_lead', function (req, res, next) {
  res.status('400').send({
    status: failure,
    reason: reason
  })
});



module.exports = router;
