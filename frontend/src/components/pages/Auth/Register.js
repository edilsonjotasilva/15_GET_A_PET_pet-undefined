
import {  useState,useContext } from "react"
import { useNavigate } from "react-router-dom"
import Input from '../../form/Input'
import styles from '../../form/Form.module.css'

//context
import { Context } from '../../../context/UserContext'

function Register(){
    const navigate = useNavigate()
    const[user,setUser] = useState({})
    const { register } = useContext(Context)
    
    function handleChange(e){
        setUser({...user,[e.target.name] : e.target.value})
        console.log(e.target.value)
    }
  async  function handleSubmit(e){
       e.preventDefault()
       //envia o usuario para o banco
       await register(user)
    }

    function handleClickLogin(){
        navigate('/login')
    }
    return (
        <section className={styles.form_container}>
        <div className="row">
            <div className="col">
            <h1>Cadastro:</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    text="Nome"
                    type="text"
                    name="name"
                    placeholder="Digite o seu nome"
                    handleOnChange={handleChange}
                />
                <Input
                    text="Telefe"
                    type="text"
                    name="phone"
                    placeholder="Digite o seu telefone"
                    handleOnChange={handleChange}
                />
                <Input
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite seu email"
                    handleOnChange={handleChange}
                />
                <Input
                    text="Senha"
                    type="password"
                    name="password"
                    placeholder="Digite sua senha"
                    handleOnChange={handleChange}
                />
                <Input
                    text="Corfirme a senha"
                    type="password"
                    name="confirmpassword"
                    placeholder="Repita sua senha"
                    handleOnChange={handleChange}
                />
            <div className="d-grid">
            {/* <button type="submit" className="btn btn-success btn-block">Cadastrar</button> */}
            <input type="submit" value="Cadastrar" />
            </div>
        </form>
        <p class="mt-3">
                Já tem conta ?
                <a href="#" class="style-none" onClick={handleClickLogin}> clique aqui</a> 
                </p>
        </div>
    </div>
    </section>
    );
}

export default Register
