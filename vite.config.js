import { defineConfig } from "vite";
import {resolve} from 'path'

export default defineConfig({
    build:{
        rollupOptions:{
            input:{
                main:resolve(__dirname,'index.html'),
                login:resolve(__dirname,'login.html'),
                login2:resolve(__dirname,'login2.html'),
                error:resolve(__dirname,'error.html'),
                loginSuccess:resolve(__dirname,'loginSucess.html'),
                registerSuccess:resolve(__dirname,'registersuccess.html')
            }
        }
    },
    define:{
        "process.env":process.env
    },
    server:{
        port:5000
    }
})