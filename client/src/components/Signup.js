import React, { useState } from 'react'
import '../App.css';
import { Formik } from "formik";
import * as Yup from "yup";
import axios from 'axios'
import { interestsData } from "../areas"

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';




const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  submitIndicator: {
    marginTop: 10
  },

  select: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  errors: {
    color: "red"
  },
  snackbar: {
    top: 0,
    bottom: 'auto',
    left: (window.innerWidth) / 2,
  }
}));





export default function Signup() {

  const [snackbarShow, setSnackbarShow] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarAlert, setSnackbarAlert] = useState("")


  const classes = useStyles();
  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    job: Yup.string().required("Job is required"),
    level: Yup.string().required("Must provide a research level"),
    primaryLanguage: Yup.string().required("Must select a primary language"),
    secondaryLanguage: Yup.string().test("secondary-language-test", "Primary and Secondary Language should not match",
      function (value) {
        return value !== this.parent.primaryLanguage;
      }),
    firstArea: Yup.string().required("Must select a first research area").test("first-research-area-test", "Should not select duplicate research areas", function (value) {
      return value !== this.parent.secondArea && value !== this.parent.thirdArea
    }),
    secondArea: Yup.string().test("second-research-area-test", "Should not select duplicate research areas", function (value) {
      return value !== this.parent.firstArea && value !== this.parent.thirdArea
    }),
    thirdArea: Yup.string().test("third-research-area-test", "Should not select duplicate research areas", function (value) {
      return value !== this.parent.secondArea && value !== this.parent.firstArea
    }),
    email: Yup.string().email("Must include a valid email address").required("Am email is required"),
    password: Yup.string().min(6, "A password must have at least 6 characters").required("Must include a password"),
    confirmPassword: Yup.string().required("You must include a confirmed password").test("confirm-password-test", "Password and Confirm Password must match",
      function (value) {
        return value === this.parent.password;
      })
  })

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values, actions) => axios.post("/signup", { name: values.name, job: values.job, level: values.level, primaryLanguage: values.primaryLanguage, secondaryLanguage: values.secondaryLanguage, firstArea: values.firstArea, secondArea: values.secondArea, thirdArea: values.thirdArea, email: values.email, password: values.password, confirmPassword: values.confirmPassword }).then(resp => {
        console.log(resp.data.message)
        setSnackbarShow(true)
        setSnackbarMessage(resp.data.message)
        setSnackbarAlert("success")
      }).catch(error => {
        setSnackbarShow(true)
        setSnackbarMessage(error.response.data.message)
        setSnackbarAlert("error")
      })}
      initialValues={{
        name: '',
        job: '',
        email: '',
        password: '',
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
        isSubmitting
      }) => (
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                Sign Up
          </Typography>

              <Snackbar open={snackbarShow} autoHideDuration={6000} className={classes.snackbar} onClose={() => setSnackbarShow(false)}>
                <Alert severity={snackbarAlert}>
                  {snackbarMessage}
                </Alert>
              </Snackbar>

              <form className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoFocus
                  onChange={handleChange}
                  value={values.name}
                />
                <p className={classes.errors}>{errors.name}</p>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="job"
                  label="Current Occupation"
                  name="job"
                  autoFocus
                  onChange={handleChange}
                  value={values.job}
                />
                <p className={classes.errors}>{errors.job}</p>

                <InputLabel id="label">Research Level</InputLabel>
                <Select labelId="label" id="select" onChange={handleChange("level")} value={values.level ? values.level : ""}>
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
                <p className={classes.errors}>{errors.level}</p>

                <InputLabel id="label">Primary Language</InputLabel>
                <Select labelId="label" id="select" onChange={handleChange("primaryLanguage")} value={values.primaryLanguage ? values.primaryLanguage : ""}>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                </Select>
                <p className={classes.errors}>{errors.primaryLanguage}</p>

                <InputLabel id="label">Secondary Language</InputLabel>
                <Select labelId="label" id="select" onChange={handleChange("secondaryLanguage")} value={values.secondaryLanguage ? values.secondaryLanguage : ""}>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                </Select>
                <p className={classes.errors}>{errors.secondaryLanguage}</p>

                <InputLabel id="label">First Research Area</InputLabel>
                <Select labelId="label" id="select" onChange={handleChange("firstArea")} value={values.firstArea ? values.firstArea : ""}>
                  {interestsData.map((item) => {
                    return (
                      <MenuItem value={item.interest}>{item.interest}</MenuItem>
                    )
                  })}
                </Select>
                <p className={classes.errors}>{errors.firstArea}</p>

                <InputLabel id="label">Second Research Area</InputLabel>
                <Select labelId="label" id="select" onChange={handleChange("secondArea")} value={values.secondArea ? values.secondArea : ""}>
                  {interestsData.map((item) => {
                    return (
                      <MenuItem value={item.interest}>{item.interest}</MenuItem>
                    )
                  })}
                </Select>
                <p className={classes.errors}>{errors.secondArea}</p>

                <InputLabel id="label">Third Research Area</InputLabel>
                <Select labelId="label" id="select" onChange={handleChange("thirdArea")} value={values.thirdArea ? values.thirdArea : ""}>
                  {interestsData.map((item) => {
                    return (
                      <MenuItem value={item.interest}>{item.interest}</MenuItem>
                    )
                  })}
                </Select>
                <p className={classes.errors}>{errors.thirdArea}</p>

                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleChange}
                  value={values.email}
                />
                <p className={classes.errors}>{errors.email}</p>

                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                  value={values.password}
                />
                <p className={classes.errors}>{errors.password}</p>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="password"
                  autoComplete="confirm-password"
                  onChange={handleChange}
                  value={values.confirmPassword}
                />
                <p className={classes.errors}>{errors.confirmPassword}</p>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                {isSubmitting ? (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleSubmit}
                    disabled
                  >
                    Sign Up
                  </Button>
                ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={handleSubmit}
                      disable
                    >
                      Sign Up
                    </Button>)}
              </form>
            </div>
          </Container>

        )}
    </Formik>
  );
}




