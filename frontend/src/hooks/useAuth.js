import api from '../utils/api'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFlashMessage from './useFlashMessage'

export default function useAuth(){
    const [authenticated, setAuthenticated] = useState(false)
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()
    
    // Envia uma requisição POST para a rota /users/login com os dados do usuário.
    // Se a requisição for bem-sucedida, o token de autenticação e outras informações do usuário são retornados.
        async function register(user){
        let msgText = 'Cadastro realizado com sucesso!'
        let msgType= 'success'

        try {
            const data = await api.post('/users/register',user).then((response)=>{
                return response.data
            })
            
        await authUser(data)
        } catch (error) {
            msgText = error.response.data.message
            msgType= 'error'
        }
        setFlashMessage(msgText, msgType)
    }

    /////////////////////////////////////function login///////////////////////////////////////////

    async function login(user){
        let msgText = 'Login realizado con sucesso'
        let msgType = 'success'
        try {
            const data = await api.post('/users/login',user).then((response)=>{
                
                return response.data
            })
            console.log('Resposta vinda do backend login:', data)

            await authUser(data)

        } catch (error) {
            msgText = error.response.data.message
            msgType = 'error'
        }
        setFlashMessage(msgText,msgType)
    }
//////////////////////////////////logout///////////////////////////////////////////////
    function logout(){
        const msgText = 'Logout realizado com sucesso'
        const msgType = 'success'

        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined

        navigate('/')

        setFlashMessage(msgText,msgType)
    }


    async function authUser(data){

        setAuthenticated(true)

        localStorage.setItem('token',JSON.stringify(data.token))

        navigate('/')
    }

    
    return {register, authenticated, logout, login}
}
