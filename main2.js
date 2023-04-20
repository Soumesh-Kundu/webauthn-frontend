import {  startAuthentication } from "@simplewebauthn/browser";
import axios from 'axios'

const username=document.querySelector("#username")

const form=document.querySelector("#loginForm")

const Axios=axios.create({
    baseURL:"http://localhost:3000",
    headers:{
        "Content-Type":"application/json"
    }
})
form.addEventListener('submit',async (e)=>{
    e.preventDefault()
    try {
        let res=await Axios.post('/generate-authenticate-option',{
            username:username.value
        })
        console.log(res.data)
        console.log("Step1")
        const attResp=await startAuthentication({
            ...res.data,
        })
        console.log("Step2")
        console.log(attResp)
        res=await Axios.post('/Verify-Authentication',{
            authenticationBody:attResp,
            username:username.value
        })
        console.log('step3')
        if(res.data && res.data.verified){
            window.location.href='/loginSucess.html'
        }
    } catch (error) {
        console.log(error)
    }
})