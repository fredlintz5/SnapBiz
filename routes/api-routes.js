const fs = require('fs');
const path = require("path");
const db = require("../models");
const vision = require('@google-cloud/vision')({
  projectId: '3044e1b02e1804e67502cd943c6cf51f9f13d92b',
  keyFilename: './googleServiceAccount.json'
});


module.exports = (app) => {

  app.post('/verify', (req,res) => {
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
    db.User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.pass,
      phone: req.body.phone,
    })
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


  app.post('/upload', (req, res) => {
    if (!req.files) {
      return res.status(400).send('No files were uploaded.');
    } else {

      let sampleFile = req.files.sampleFile;
      let fileName = req.files.sampleFile.name;

      sampleFile.mv(`./images/${fileName}`, (err) => {
        if (err) {
          return res.status(500).send(err);
        } else {
            let filePath = `./images/${fileName}`;

            let request = {source: {filename: filePath }};

            vision.textDetection(request)
              .then(response => {
                res.json(response[0].textAnnotations[0].description);
                fs.unlink(filePath, (err) => {
                  if (err) {
                    console.log(err)
                  }
                });
            }).catch(err => console.error(err));
        }
      })
    }
  });
};