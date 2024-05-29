import api from '../../../../utils/api'
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import RoundedImage from "../../../layout/RoudedImage"
import useFlashMessage from '../../../../hooks/useFlashMessage'
import styles from './Dashboard.module.css'

function MyPets(){
    const navigate = useNavigate()
    const[pets, setPets] = useState([])

    console.log('tem pet aqui????????',pets)
    
    const [token] = useState(localStorage.getItem('token')|| '')
    const { setFlashMessage } = useFlashMessage()

    useEffect(()=>{
        api.get('/pets/mypets',{
            headers:{
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then((response)=>{

            setPets(response.data.pets)
            
        })
    },[token])

    async function removePet(id){
        let msgType = 'success'
        const data = await api
        .delete(`/pets/:${id}`,{
            headers:{
                Authorization:`Bearer ${JSON.parse(token)}`
                
            }
        })
        .then((response)=>{
            const updatePets = pets.filter((pet)=> pet._id!== id)
            setPets(updatePets)
            return response.data
        })
        .catch((err)=>{
            msgType = 'error'
            return err.response.data
        })
        setFlashMessage(data.message, msgType)
    }

    return(
        
        <section>
            <div className="row">
                <div className="col">
                    <div className={styles.petlist_header}>
                        <h1 class="meutitulo text-center">MyPets</h1>
                        <Link to={'/pet/add'}>Cadastrar</Link>

                    </div>
                    <div className={styles.petlist_Container}>
                        { pets.length >0 &&
                        pets.map((pet)=>(
                            <div  className={styles.petlist_row} key= {pet._id}>
                                <div>
                                <RoundedImage
                                    src={`${process.env.REACT_APP_API}/images/pets/${pet.images[0]}`}
                                    alt={pet.name}
                                    width="px75"
                                />
                                <span className={styles.name}>{pet.name}</span>
                                </div>
                                <div className={styles.action}>
                                    {/* available propriedade do pet que verifica se ele está disponivel para adoção */}
                                    {pet.available ? (
                                        <>
                                            {pet.adopter &&(
                                                <>
                                                    {/* <Link  to={`/pet/edit/${pet._id}`} className={styles.concluir}>Concluir Adoção </Link> */}
                                                    <button
                                                        className={styles.conclude_btn}
                                                    >
                                                        Concluir Adoção
                                                    </button>
                                                </>
                                            )}
                                            <Link to={`/pet/edit/${pet._id}`}><button className={styles.edit_btn} >Editar</button>  </Link>

                                            <button
                                                className={styles.delete_btn}
                                                onClick={() => {
                                                    removePet(pet._id)
                                                }}
                                            >
                                                Exluir
                                            </button>
                                        
                                        </>
                                    ):(
                                        <p  className={styles.registeredButton}>Já cadastrado</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                 
            
                    { pets.length === 0 &&<p>Não há pets cadastrados</p>}
                    
                </div>
            </div>
        </section>
    )
}

export default MyPets