const Pet = require('../models/Pets')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')


const { use } = require('../routes/PetRoutes')

module.exports = class PetController{
    
    ///////////////////////////////criar pet/////////////////////////////////////////
    
    static async create(req, res){
        // res.json ({message: 'Ola mundo'})
        const { name, age, weight, color } = req.body
        
        const images = req.files
        
        const available = true
        
        //images upload
        
        //validadtion
        if (!name) {
            res.status(422).json({message: 'O nome é obrigátorio'})
            return
        }
        if (!age) {
            res.status(422).json({message: 'A idade é obrigátorio'})
            return
        }
        if (!weight) {
            res.status(422).json({message: 'O peso é obrigátorio'})
            return
        }
        if (!color) {
            res.status(422).json({message: 'A cor é obrigátorio'})
            return
        }
        if (images.length === 0) {
            res.status(422).json({message: 'A imagem é obrigátorio'})
            return
        }
        
        //get pet owner
        const token = getToken(req)
        const user =  await getUserByToken(token)
        
        // crate a pet
        const pet = new Pet ({
            name,
            age,
            weight,
            color,
            available,
            images : [], 
            user :{
                _id : user._id,
                name: user.name,
                image: user.image,
                phone: user.phone   
            }
        })
        
        images.map((image)=>{
            pet.images.push(image.filename)
        })
        try {
            const newPet = await pet.save()
            res.status(201).json({
                message: 'Pet cadastrado com sucesso:',newPet
            })
        } catch (error) {
            res.status(500).json({message: error})
        }
    }
    
    ////////////////////////////Pegar todos os pets///////////////////////////////////////////////
    static async getAll(req,res){
      
        const pets = await Pet.find().sort('-createdAt')// -createdAt, pega os dados em ordem decrescente
        res.status(200).json({message: 'Todos os Pets:', pets})
        return
    }
    
    ////////////////////////////Pegar somente os pets do usuário///////////////////////////////////////////////
    // get all user pets
    static async getAllUserPets(req, res) {
       
        // get user
        const token = getToken(req)
        console.log('tokem do Usuario:::::::::::', token)
        const user = await getUserByToken(token)
        console.log('retorno do nome do Usuario pelo token :', user.name)
        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')
        console.log('REQ.BODY Pegar todos os pets:::::',pets)
        
        res.status(200).json({
            pets,
        })
    }
    
    ////////////////////////////Adoções os usuário///////////////////////////////////////////////
    static async getAllUserAdoptions(req, res){
        // get user from token
        const token = getToken(req)
        console.log('tokem do Usuario:::::::::::', token)
        const user = await getUserByToken(token)
        console.log('retorno do token do Usuario :', user)
        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')
        
        res.status(200).json({
            pets,
        })
    }
    
    
    ////////////////////////////Busca o pet por ID///////////////////////////////////////////////
    static async getPetById(req, res){
        const id = req.params.id
        console.log('ID DENTRO DO BACKEND', id)
        // check if id is valid
        
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }
        const pets = await Pet.findById({_id: id})
        if (!pets) {
            res.status(404).json({ message: 'Pet não encontraduuuuss' })
            return
        }
        
        res.status(200).json({message: pets})
        return
    }
    
    ////////////////////////////Remove o pet por ID///////////////////////////////////////////////
    static async removePtById(req, res){
        const id = req.params.id
        
        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }
        const pet = await Pet.findById({_id: id})
        console.log('pet resgatado pelo id do token: ', pet)
        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' })
            return
        }
        
        // verifica se o usuario logado foi quem registrou o PET
        const token = getToken(req)
        const user =  await getUserByToken(token)
        
        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(404).json({message: "Voce não pode excluir um registro criado por outra pessoa"})
            return
        }
        
        await Pet.findByIdAndDelete(id)
        
        res.status(200).json({message : "Pet removido com sucesso"})
    }
    
    /////////////////////////////update pets//////////////////////////////////////////////////////
    
    static async updatePet(req, res){
        const id = req.params.id
        
        const { name, age, weight, color } = req.body

        const available = req.body.available
        
        const images = req.files
        
        const updateData = {}
        
        // check if pet existe
        const pets = await Pet.findOne({_id: id})
        if (!pets) {
            res.status(404).json({ message: 'Pet não encontrado!' })
            return
        }
        
        // verifica se o usuario logado foi quem registrou o PET
        
        const token = getToken(req)
        const user =  await getUserByToken(token)
        
        if (pets.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: "Voce não pode atualizar um registro criado por outra pessoa"})
            return
        }
        
        // field validation
        if (!name) {
            res.status(422).json({message: 'O nome é obrigátorio'})
            return
        }else{
            updateData.name = name
        }
        if (!age) {
            res.status(422).json({message: 'A idade é obrigátorio'})
            return
        }else{
            updateData.age = age
        }
        if (!weight) {
            res.status(422).json({message: 'O peso é obrigátorio'})
            return
        }else{
            updateData.weight = weight
        }
        if (!color) {
            res.status(422).json({message: 'A cor é obrigátorio'})
            return
        }else{
            updateData.color = color
        }
        if (images.length === 0) {
            res.status(422).json({message: 'A imagem é obrigátorio'})
            return
        }else{
            updateData.images = []
            images.map((image)=>{
                updateData.images.push(image.filename)
            })
        }
        
        await Pet.findByIdAndUpdate(id, updateData)
        res.status(200).json({message: 'Pet Alterado com Sucesso!'})
        return
    }
    
    //////////////////////////////Agendamento de adoção///////////////////////////////////////////
    
    static async schedule(req, res){
        const id = req.params.id
        
        // check if pet existe
        const pet = await Pet.findOne({_id: id})
        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' })
            return
        }
        
        // verifica se o usuario logado foi quem registrou o PET
        const token = getToken(req)
        const user =  await getUserByToken(token)
        
        // if (pet.user._id.toString() === user._id.toString()) {
        if(pet.user._id.equals(user.id)){
            res.status(422).json({message: "voce não pode adotar agendar visita para adotar seu próprio pet"})
            return
        }
        
        // verifique se existe uma adotante e se o adotante é o próprio usuário que está logado
        
        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
                res.status(422).json({message: "voce já agendou visita para esse PET"})
                return
            }
        }   
        
        // Add user visit to pet
        // Se a condição anterior não foi atendida, então é agendada uma visita ao pet com id, nome e imagem do usuario logado
        pet.adopter = {
            _id : user._id,
            name : user.name,
            image : user.image
        }
        
        await Pet.findByIdAndUpdate(id, pet)
        
        res.status(200).json({message: `A visita foi agendada com sucess, entre em contado com ${pet.user.name}, Fone: ${pet.user.phone} `})
    }
    
    ///////////////////////////////////conclude Adopter/////////////////////////////////////////////////
    
    static async concludeAdopter(req, res){
        const id = req.params.id
        
        // check if pet existe
        const pet = await Pet.findOne({_id: id})
        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' })
            return
        }
        
        // verifica se o usuario logado foi quem registrou o PET
        
        const token = getToken(req)
        const user =  await getUserByToken(token)
        
        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: "Voce não pode atualizar um registro criado por outra pessoa"})
            return
        }
        
        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)
        res.status(200).json({message: "Parabéns ! Processo de adoção concluido com sucesso!"})
        return
    }
}