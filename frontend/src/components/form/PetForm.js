import { useState } from 'react'

import formStyles from './Form.module.css'

import Input from './Input'
import Select from './Select'

//O motivo para definir petData no componente PetForm é para casos em que você pode querer reutilizar este formulário para editar um pet existente ou preencher o formulário com dados iniciais. Mesmo que não seja usado no contexto atual (cadastro de um novo pet), ter essa flexibilidade permite reutilizar o componente em diferentes cenários sem precisar modificá-lo.
function PetForm({ handleSubmit, petData, btnText }) {
  console.log('recebendo registerPet', handleSubmit)
  const [pet, setPet] = useState(petData || {})
  const [preview, setPreview] = useState([])
  const colors = ['Branco', 'Preto', 'Cinza', 'Caramelo']

  function onFileChange(e) {
    console.log(Array.from(e.target.files))
    setPreview(Array.from(e.target.files))// Array.from -  transforma um filelist e array
    setPet({ ...pet, images: [...e.target.files] })
  }

  function handleChange(e) {
    setPet({ ...pet, [e.target.name]: e.target.value })
  }

  function handleColor(e) {
    setPet({...pet, color: e.target.options[e.target.selectedIndex].text,
    })
  }

  //Quando o usuário envia o formulário, a função submit do PetForm é chamada. Esta função chama a função handleSubmit (que é registerPet, passada como prop) com os dados do pet.
  const submit = (e) => {
    e.preventDefault()
    //handleSubmit é o mesmo que registerPet, pois o valor de randleSubmit é registerPet, dessa forma eu estou acionando registerPet(pet) do script addPet
    handleSubmit(pet)
    console.log(pet)
  }

  return (
    <form onSubmit={submit} className={formStyles.form_container}>
      <div className={formStyles.preview_pet_images}>
        {preview.length > 0
          ? preview.map((image, index) => (
              <img
                src={URL.createObjectURL(image)}
                alt={pet.name}
                key={`${pet.name}+${index}`}
              />
            ))
          : pet.images &&
            pet.images.map((image, index) => (
              <img
                src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                alt={pet.name}
                key={`${pet.name}+${index}`}
              />
            ))}
      </div>
      <Input
        text="Imagens do Pet"
        type="file"
        name="images"
        handleOnChange={onFileChange}
        multiple={true}
      />
      <Input
        text="Nome do Pet"
        type="text"
        name="name"
        placeholder="Digite o nome"
        handleOnChange={handleChange}
        value={pet.name || ''}
      />
      <Input
        text="Idade do Pet"
        type="number"
        name="age"
        placeholder="Digite a idade"
        handleOnChange={handleChange}
        value={pet.age || ''}
      />
      <Input
        text="Peso do Pet"
        type="number"
        name="weight"
        placeholder="Digite o peso aproximado"
        value={pet.weight || ''}
        handleOnChange={handleChange}
      />
      <Select
        name="color"
        text="Selecione a categoria"
        options={colors}
        handleOnChange={handleColor}
        value={pet.color || ''}
      />
      <input type="submit" value={btnText} />
    </form>
  )
}

export default PetForm