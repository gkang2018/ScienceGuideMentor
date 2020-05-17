const firebase = require("firebase")
require("firebase/auth");
require("firebase/database");
const dotenv = require("dotenv")
dotenv.config()

module.exports = class AuthenticationService {
    constructor() {
        let firebaseConfig = {
            apiKey: process.env.API_KEY,
            authDomain: process.env.AUTH_DOMAIN,
            databaseURL: process.env.DATABASE_URL,
            projectId: process.env.PROJECT_ID,
            storageBucket: process.env.STORAGE_BUCKET,
            messagingSenderId: process.env.MESSAGING_SENDER_ID,
            appId: process.env.APP_ID,
            measurementId: process.env.MEASUREMENT_ID,
        }
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    signUpMentor(name, job, email, password, languages, areas, level) {
        return new Promise((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(email, password).then((cred) => {
                firebase.firestore().collection("mentors").doc(cred.user.uid).set({
                    name: name,
                    job: job,
                    email: email,
                    languages: languages,
                    researchAreas: areas,
                    researchLevel: level,
                    students: [],
                    chatRooms: []
                }).then(() => {
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            }).catch(error => {
                reject(error)
            })
        })
    }

}
