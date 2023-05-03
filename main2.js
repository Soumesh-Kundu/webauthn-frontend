import { startAuthentication } from "@simplewebauthn/browser";
import axios from 'axios'

const username = document.querySelector("#username")

const form = document.querySelector("#loginForm")

const Axios = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND,
    headers: {
        "Content-Type": "application/json"
    }
})


form.addEventListener('submit', async (e) => {
    e.preventDefault()
    try {
        let res = await Axios.post('/authenticate/generate-authenticate-option', {
            username: username.value
        })
        const attResp = await startAuthentication({
            ...res.data,
            user: {
                ...res.data.user,
            }
        })

        res = await Axios.post('/authenticate/Verify-Authentication', {
            authenticationBody: attResp,
            username: username.value
        })


        if (res.data && res.data.verified) {
            sessionStorage.setItem('SessionToken', res.data.sessionToken)
            window.location.href = '/loginSucess.html'
        }

    } catch (error) {
        console.log(error)
        if (!error.response || error.response.status === 500) {
            window.location.href="error.html"
            return
        }
        const { response } = error
        if (response && response.status === 401) {
            window.location.href = "login2.html"
            return
        }
    }
})