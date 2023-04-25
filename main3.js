import { startRegistration, browserSupportsWebAuthn } from "@simplewebauthn/browser";
import axios from 'axios'
import {config} from 'dotenv'
config()


const username = document.querySelector("#username")
const password = document.querySelector("#password")

const form = document.querySelector("#login2")

const Axios = axios.create({
    baseURL: process.env.APP_BACKEND,
    headers: {
        "Content-Type": "application/json"
    }
})
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    console.log("hey1")
    if (!browserSupportsWebAuthn()) {
        console.log("not supported")
        return
    }
    console.log("supported")
    try {
        let res = await Axios.post('/authenticate', {
            username: username.value,
            password: password.value
        })
        if (res.status !== 200) {
            return console.log("error")
        }

        res = await Axios.post('/register/generate-register-option', {
            username:username.value
        })

        const attResp = await startRegistration({
            ...res.data,
        })

        res = await Axios.post('/register/Verify-Registration', {
            registrationBody: attResp,
            username:username.value
        })

        if (res.data && res.data.verified) {
            sessionStorage.setItem("SessionToken", res.data.sessionToken)
            console.log("done")
            window.location.href = '/registersuccess.html'
        }
    } catch (error) {
        console.log(error)
        if (!error.response) {
            window.location.href = "error.html"
            return
        }
        if (error.response && error.response === 400) {
            console.log(error.response.data.message)
        }
    }
})