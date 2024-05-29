import api from "../../../../utils/api"
import { useState, useEffect } from "react"

import { useNavigate } from "react-router-dom"
import styles from './AddPet.module.css'
//component
import PetForm from "../../../form/PetForm"

//hooks 
import useFlashMessage from "../../../../hooks/useFlashMessage"


function AddPet(){
    const navigate = useNavigate()
    
    // Recupera o token de autenticação armazenado no localStorage e o inicializa no estado.
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()

    // http://localhost:3000/pet/add#

async function registerPet(pet) {
    let msgType = 'success'

    const formData = new FormData()

    const petFormData = await Object.keys(pet).forEach((key) => {
        if (key === 'images') {
        for (let i = 0; i < pet[key].length; i++) {
            formData.append(`images`, pet[key][i])
        }
        } else {
        formData.append(key, pet[key])
        }
    })
    
        formData.append('pet', petFormData)

    const data = await api
        .post(`pets/create`, formData, {
        headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
            'Content-Type': 'multipart/form-data',
        },
        })
        .then((response) => {
        console.log(response.data)
        return response.data
        })
        .catch((err) => {
        console.log(err)
        msgType = 'error'
        return err.response.data
        })

    setFlashMessage(data.message, msgType)
    navigate('/pet/mypets')
    }
    return(
        <section className={styles.addpet_header}>
            <div className="row">
                <div className="col">
                <h1 className="meutitulo">Cadastre um Pet</h1>
                <p>Depois ele estará disponível para adoção</p>
                </div>
            </div>
            {/* passa a função registerPet como prop para o component PetForm, quando o formulario é submentido
            lá no component PertForm, a função register é devolvida contendo os valores de pet atualizados */}
            <PetForm handleSubmit={registerPet} btnText="Cadastrar Pet"/>
        </section>
    )
}

export default AddPet