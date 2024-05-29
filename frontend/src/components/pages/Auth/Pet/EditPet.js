import api from '../../../../utils/api'
import { useState ,useEffect} from 'react'
import styles from './AddPet.module.css'
import { useParams } from 'react-router-dom'
import useFlashMessage from '../../../../hooks/useFlashMessage'

function EditPet(){

    const [pet,setPet] = useState({})
    const [token] = useState(localStorage.getItem('token' || ''))
    const {id} = useParams()
    const {setFlashMassage} = useFlashMessage()

    useEffect(()=>{
        api.get(`pets/${id}`,{
            headers: {
                Authorization:`Bearer ${JSON.parse(token)}`
            }
            
        }).then((response)=>{
            setPet(response.data.pet)
        })
    },[token,id])

    return(
        <section>
       
            <div className='styles.addpet_header'>
                <h1>  Editar pet {pet.name} </h1>
                <p>Depois da edição os dados serão atualizados no sistema</p>
            </div>
        
        </section>
    )
}
export default EditPet