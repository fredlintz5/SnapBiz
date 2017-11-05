// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


const fileUpload = require('express-fileupload'); 
const bodyParser = require('body-parser');
const express    = require('express');
const db         = require("./models");
const app        = express();
const port       = process.env.PORT || 8080;


app.use(fileUpload());

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));


require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);
require("./routes/vision-routes.js")(app);


db.sequelize.sync().then(() => {
	app.listen(port, () => console.log("App listening on PORT " + port));
});





