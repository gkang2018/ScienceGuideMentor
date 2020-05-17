const express = require('express');
const app = express();

const dotenv = require("dotenv")
dotenv.config()


const port = process.env.PORT || 5000;
const bodyParser = require('body-parser')
const AuthenticationService = require("./AuthenticationService")
db = new AuthenticationService()


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


app.use(express.static(path.join(__dirname, '../client/build')));


// mentor signup route
app.post('/signup', (req, res) => {
  // check if password and confirm password match 
  try {
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send({
        message: "Your password and confirm password should not match"
      })
    }

    let languages = []
    if (req.body.secondaryLanguage === "" || req.body.secondaryLanguage === undefined) {
      languages.push(req.body.primaryLanguage)
    }
    else {
      if (req.body.primaryLanguage === req.body.secondaryLanguage) {
        return res.status(400).send({
          message: "Your primary and secondary language should not match"
        })

      }
      languages = [req.body.primaryLanguage, req.body.secondaryLanguage]
    }

    let areas = []
    if (req.body.firstArea === "" || req.body.firstArea === undefined) {
      return res.status(400).send({
        message: "You must select an initial research area"
      })
    }
    if ((req.body.secondArea !== "" && req.body.thirdArea != "") && ((req.body.secondArea !== undefined && req.body.thirdArea != undefined))) {
      if (req.body.firstArea === req.body.secondArea || req.body.secondArea === req.body.thirdArea || req.body.firstArea === req.body.thirdArea) {
        return res.status(400).send({ message: "First, Second, or Third research areas should not match" })
      }
      areas.push(req.body.firstArea, req.body.secondArea, req.body.thirdArea)
    }
    else {
      if ((req.body.secondArea === "" && req.body.thirdArea === "") || (req.body.secondArea === undefined && req.body.thirdArea === undefined)) {
        areas.push(req.body.firstArea)
      }
      else if ((req.body.secondArea === "" || req.body.secondArea === undefined) && (req.body.thirdArea !== "" && req.body.thirdArea !== undefined)) {
        areas.push(req.body.firstArea, req.body.thirdArea)
      }
      else {
        areas.push(req.body.firstArea, req.body.secondArea)
      }
    }

    db.signUpMentor(req.body.name, req.body.job, req.body.email, req.body.password, languages, areas, req.body.level).then(() => {
      return res.status(200).send({
        message: "Succesfully signed up to MyScienceGuide"
      })
    }).catch(error => {
      return res.status(400).send({
        message: error.message
      })
    })
  }
  catch (error) {
    return res.status(400).send({
      message: "Could not sign up mentor at this time, please try again later"
    })
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../client/build/index.html'));
});


// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
