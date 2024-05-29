import { useNavigate } from "react-router-dom"
import styles from './Navbar.module.css'
import Logo from '../../assets/img/logo.png'

//Context
import { Context } from '../../context/UserContext'
import { useContext } from "react"


function Navbar(){

    const {authenticated, logout, profile} = useContext(Context)

    const navigate = useNavigate()
    function handleClick(){
        navigate('/register')
    }
    function handleClickLogin(){
        navigate('/login')
    }
    function handleClickProfile(){
        navigate('/user/profile')
    }
    function handleClickHome(){
        navigate('/')
    }
    function handleClickMyPets(){
        navigate('/pet/mypets')
    }
    return(
        <nav class="navbar navbar-expand-sm bg-warning d-flex justify-content-between ">
            <div className={styles.navbar_logo} >
                <img src={Logo} alt="Get A Pet" />
                <h2 class="text-primary">Get A Pet</h2>
            </div>
            <div class="mx-3">
                <ul class="navbar-nav">
                        <li class="nav-item">
                            <a href="#" onClick={handleClickProfile} >Adotar</a>
                        </li>
                    { authenticated ? (
                        <>
                        <li class="nav-item">
                            <a href="#" onClick={handleClickMyPets} >Meus Pets</a>
                        </li>
                        <li class="nav-item">
                            <a href="#" onClick={handleClickProfile} >Perfil</a>
                        </li>
                        <li class="nav-item">
                            <a href="#"onClick={logout}>Sair</a>
                        </li>
                        </>
                    ):(
                        <>
                            <li class="nav-item">
                            <a href="#" onClick={handleClickLogin} >Entrar</a>
                            </li>
                            <li class="nav-item">
                            <a href="#" onClick={handleClickHome}>Home</a>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav> 
    )
}

export default Navbar