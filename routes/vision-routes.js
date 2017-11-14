const fs     = require('fs');
const db     = require("../models");

const vision = require('@google-cloud/vision')({
  projectId: '3044e1b02e1804e67502cd943c6cf51f9f13d92b',
  // use this line to access google-vision locally
  // keyFilename: './googleServiceAccount.json'
  
  // use this line to access google vision when deployed to heroku
  credentials: JSON.parse(process.env.GOOGLE_CREDS)  
});


module.exports = (app) => {

  app.post('/upload', (req, res) => {
      if (!req.files) {
        return res.status(400).send('No files were uploaded.');
      } else {

        let sampleFile = req.files.sampleFile;
        let fileName = req.files.sampleFile.name;

        sampleFile.mv(`./public/images/${fileName}`, (err) => {
          if (err) {
            return res.status(500).send(err);
          } else {
              let filePath = `./public/images/${fileName}`;

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
}



