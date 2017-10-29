
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
          console.log('no identified user')
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


  app.post('/upload', (req, res) => {
    if (!req.files) {
      return res.status(400).send('No files were uploaded.');
    } else {

      let sampleFile = req.files.sampleFile;
      let fileName = req.files.sampleFile.name;

      sampleFile.mv(`./images/${fileName}.jpg`, (err) => {
        if (err) {
          return res.status(500).send(err);
        } else {
            let filePath = `./images/${fileName}.jpg`;

            const request = {
              source: {
                filename: filePath
              }
            };

            vision.textDetection(request).then(response => {
              console.log(response[0].textAnnotations[0].description);
            }).catch(err => {
              console.error(err);
            });

            res.send('File uploaded!');
        }
      })
    }
  });
};