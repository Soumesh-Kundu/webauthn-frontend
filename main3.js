import {  startRegistration,browserSupportsWebAuthn } from "@simplewebauthn/browser";
import axios from 'axios'

const username=document.querySelector("#username")
const password=document.querySelector("#password")

const form=document.querySelector("#login2")

const Axios=axios.create({
    baseURL:"https://543f-115-187-58-227.ngrok-free.app",
    headers:{
        "Content-Type":"application/json"
    }
})
form.addEventListener('submit',async (e)=>{
    e.preventDefault()
    if(browserSupportsWebAuthn()){
        console.log("supported")
    }
    else{
        console.log("not supported")
        return
    }
    try {
        let res=await Axios.post('/authenticate',{
            username:username.value,
            password:password.value
        })
        if(res.status!==200){
            return console.log("error")
        }
        res=await Axios.post('/generate-register-option',{
            username:username.value
        })
        console.log(res)
        console.log('step1')
        // return
        const attResp=await startRegistration({
            ...res.data,
            user:{
                ...res.data.user,
                id:new TextEncoder().encode(res.data.user.id)
            }
        })

        res=await Axios.post('/Verify-Registration',{
            registrationBody:attResp,
            username:username.value
        })
        if(res.data && res.data.verified){
            window.location.href='/registersuccess.html'
        }
    } catch (error) {
        console.log(error)
        if(!error.response){
            window.location.href="error.html"
            return
        }
        if(error.response && error.response===400){
            console.log(error.response.data.message)
        }
    }
})