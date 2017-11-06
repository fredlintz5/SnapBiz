const fs = require('fs');
const path = require("path");
const db = require("../models");


module.exports = (app) => {

  // initial table load of prospects
  app.get('/user/:id/mostRecentProspects', (req,res) => {
    db.Prospect.findAll({
      where: {UserId: req.params.id},
      order: [['createdAt', 'DESC']]
    })
    .then((result) => {
      res.json(result);
    })
  })

  app.get('/api/:userID/:prospectID', (req,res) => {
    db.Prospect.findAll({
      where: {
        id: req.params.prospectID,
        UserId: req.params.userID
      }
    })
    .then((result) => {
      if (result == null) {
        res.send("noUserFound")
      } else {
        res.json(result);
      }
    })
    .catch(err => console.log(err));
  })

  app.get('/user/:id/info', (req,res) => {
    db.User.findById(req.params.id)
    .then((result) => {
      if (result == null) {
        res.send("noUserFound")
      } else {
        res.json(result);
      }
    })
    .catch(err => console.log(err));
  })

  app.post('/verifyUser', (req,res) => {
    db.User.findOne({
      where: {
        email: req.body.email,
        password: req.body.pass
      }
    })
    .then((result) => {
      if (result == null) {
        res.send("noUserFound")
      } else {
        res.json(result.id);
      }
    })
    .catch(err => console.log(err));
  })

  app.post('/newUser', (req, res) => {
    db.User.create(req.body)
    .then(result => res.json(result.id))
    .catch((err) => {
      if (err.errors[0].path) {
        res.send('email');
      }
    });
  });

  app.post('/user/:id/newProspect', (req, res) => {
    db.Prospect.create(req.body)
    .then(result => res.send("success"))
    .catch((err) => res.send("error"));
  });

  app.delete('/user/:id/deleteProspect', (req,res) => {
    db.Prospect.destroy({
      where: {
        id: req.body.id,
        UserId: req.params.id
      }
    })
    .then(result => res.send("success"))
    .catch((err) => res.send("error"));
  })

  app.put('/user/:id/updateProspect', (req,res) => {
    db.Prospect.update(
      req.body,
      {
        where: {
          id: req.params.id
        }
      })
      .then(result => res.json(result))
      .catch((err) => res.send("error"));
  })
  
};




