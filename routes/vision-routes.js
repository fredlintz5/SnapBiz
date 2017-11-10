const fs     = require('fs');
const db     = require("../models");

// fs.writeFile("/googleCreds.json", content, 'utf8', function (err) {
//     if (err) {
//         return console.log(err);
//     }

//     console.log("The file was saved!");
// });

const vision = require('@google-cloud/vision')({
  projectId: '3044e1b02e1804e67502cd943c6cf51f9f13d92b',
  // keyFilename: './googleServiceAccount.json'
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



