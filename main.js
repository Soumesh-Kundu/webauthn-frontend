import { startRegistration, } from "@simplewebauthn/browser";
import axios from 'axios'

const email = document.querySelector("#email")
const Phone = document.querySelector("#Phone")
const spanText = document.querySelector("#user-exists")
const token = document.querySelector('#token')
const OTPSection=document.querySelector("#OTPSection")
const tokenSpanText=document.querySelector("#tokenSpanText")

const form = document.querySelector("#registration")

const Axios = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND,
    headers: {
        "Content-Type": "application/json"
    }
})
const submitArray = [register, verification]
form.addEventListener('submit', submitArray[0])

email.addEventListener('change', (e) => {
    if (!spanText.classList.contains("invisible")) {
        spanText.classList.add('invisible')
    }
})

token.addEventListener('change',()=>{
    if (!tokenSpanText.classList.contains("invisible")) {
        tokenSpanText.classList.add('invisible')
    }
})


async function register(e) {
    e.preventDefault()
    try {
        const res = await Axios.post('/register', {
            Email: email.value,
            Phone: Phone.value
        })
        if (res.data && res.data.success) {
            console.log(res.data.token)
            OTPSection.classList.remove('hidden')
            form.removeEventListener('submit',submitArray[0])
            form.addEventListener('submit',submitArray[1])
        }
    } catch (error) {
        console.log(error)
        const { response } = error
        if (!response) {
//             window.location.href = "error.html"
            return
        }
        if (response && response.status == 403) {
            spanText.classList.remove("invisible")
        }
    }
}


async function verification(e) {
    e.preventDefault()
    try {
        let res = await Axios.post('/authenticate/token-authenticate', {
            token: token.value,
            Email: email.value
        })

        res = await Axios.post('/register/generate-register-option', {
            Email: email.value
        })

        const attResp = await startRegistration({
            ...res.data,
            user: {
                ...res.data.user,
            }
        })

        res = await Axios.post('/register/Verify-Registration', {
            registrationBody: attResp,
            Email: email.value
        })

        if (res.data && res.data.verified) {
            sessionStorage.setItem("SessionToken", res.data.sessionToken)
            localStorage.setItem(email.value, res.data.deviceID)
            window.location.href = '/registersuccess.html'
        }
    } catch (error) {
        console.log(error)
        const { response } = error
        if (!response) {
            window.location.href = "error.html"
            return
        }
        if (response && response.status === 401) {
            tokenSpanText.innerText='Please enter a valid OTP'
            tokenSpanText.classList.remove('invisible')
            return
        }
        if (response && response.status === 400) {
            tokenSpanText.innerText='Please enter a valid OTP'
            tokenSpanText.classList.remove('invisible')
            return
        }
        if (response && response.status === 408) {
            tokenSpanText.innerText='OTP has expired'
            tokenSpanText.classList.remove('invisible')
            return
        }
    }
}

