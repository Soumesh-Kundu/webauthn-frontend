import { startRegistration,} from "@simplewebauthn/browser";
import axios from 'axios'

console.log("hey")
console.log(import.meta.env.TEST || 'hello')
const username = document.querySelector("#username")
const password = document.querySelector("#password")
const spanText= document.querySelector("#user-exists")

const form = document.querySelector("#registration")

const Axios = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND,
    headers: {
        "Content-Type": "application/json"
    }
})
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    console.log("hey1")
    try {
        let res = await Axios.post('/register', {
            username: username.value,
            password: password.value
        })

        if (res.status !== 200) {
            return console.log("error")
        }
        res = await Axios.post('/register/generate-register-option', {
            username: username.value
        })
        console.log(res)
        const attResp = await startRegistration({
            ...res.data,
            user: {
                ...res.data.user,
            }
        })
        
        console.log(attResp)
        res = await Axios.post('/register/Verify-Registration', {
            registrationBody: attResp,
            username: username.value
        })

        if (res.data && res.data.verified) {
            sessionStorage.setItem("SessionToken", res.data.sessionToken)
            // window.location.href = '/registersuccess.html'
        }
    } catch (error) {
        console.log(error)
        const { response } = error
        if (!response) {
            console.log("Server is down")
            // window.location.href="error.html"
            return
        }
        if (response && response.status == 403) {
            console.log("User already exists")
            spanText.classList.remove("invisible")
        }
    }
})

username.addEventListener('change',(e)=>{
    if(!spanText.classList.contains("invisible")){
        spanText.classList.add('invisible')
    }
})