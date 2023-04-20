import {  startRegistration,browserSupportsWebAuthn } from "@simplewebauthn/browser";
import axios from 'axios'
import { Buffer } from "buffer";

const username=document.querySelector("#username")
const password=document.querySelector("#password")

const form=document.querySelector("#registration")

const Axios=axios.create({
    baseURL:" https://a8ed-115-187-58-227.ngrok-free.app",
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
        let res=await Axios.post('/register',{
            username:username.value,
            password:password.value
        })
        console.log(res)
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
    }
})