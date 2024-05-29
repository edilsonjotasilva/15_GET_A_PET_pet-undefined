
import { useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import Input from '../../form/Input'
import styles from '../../form/Form.module.css'


//context
import { Context } from "../../../context/UserContext"



function Login(){
    const navigate = useNavigate()

    const [user, setUser] = useState({})
    const {login} = useContext(Context)
    
    function handleSubmit(e){
        e.preventDefault() 
        login(user)
    }
    function handleClickCadastrar(){
        navigate('/register')
    }
    function handleChange(e){
        setUser({...user,[e.target.name] : e.target.value})
        console.log(user)
    }
    return(
        <section className={styles.form_container}>
        <div className="row">
            <div className="col">
                <h1 className="meutitulo">Login</h1>
                <form onSubmit={handleSubmit}>
                    {/* let senha = "silva123" */}
                    <Input
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite seu email"
                    handleOnChange = {handleChange}
                    />
                    <Input
                    text="Senha"
                    type="text"
                    name="password"
                    placeholder="Digite sua senha"
                    handleOnChange = {handleChange}
                    />
                    <input type="submit" value="Entrar" />
                </form>
                <p class="mt-3">
                Não tem conta ?
                <a href="#" class="style-none" onClick={handleClickCadastrar}> clique aqui</a> 
                </p>
            </div>
        </div>
        </section>
    )
}

export default Login

