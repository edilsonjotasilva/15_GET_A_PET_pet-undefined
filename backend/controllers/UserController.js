const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')


// const { use } = require('../routes/UserRoutes')

module.exports = class UserController{

    ///////////////////////////////criar usuario/////////////////////////////////////////

    static async register(req, res){
        // res.json ({message: 'Ola mundo'})
        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword

        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatoriedade' })
        return
        }
        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório!' })
        return
        }
        if (!phone) {
            res.status(422).json({ message: 'O Telefone é obrigatório!' })
        return
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' })
        return
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'A  confirmação de senha é obrigatória!' })
        return
        }

        if (password !== confirmpassword) {
            res.status(422)
            .json({message: 'As senhas não são iguais'})
            return
        }

        //check if user exists

        const userExists = await User.findOne({email:email})
        if (userExists) {
            res.status(422).json({
                message:'Esse usuário já está cadastrado, escolha outro e-mail'
            })
            return
        }


        //create a password criptografado
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //create user
    const user = new User({
// não precisa colocar name : name,porque os campos do model/User é igual aos campos vindo vindo do formulario
        name,
        email,
        phone,
        password : passwordHash
    })

    try {
        const newUser = await user.save()// user.save() => inseri esse usuario no banco de dados e manda uma copia dele para o método createUserToken, através da variável newUser para gerar um token apartir das informações do usuario (nome e id), esse token fica no localStorage enquanto o usuário estiver logado, ao fazer logout ele o token é apagado
        console.log('Novo usuario criado: ', newUser)
        //chamando a função createUserTonke do helpers importado acima
        await createUserToken(newUser,req,res)

    } catch (error) {   
        res.status(500).json({message: error})
    }

    }
    ////////////////////////////////////fazer login ////////////////////////////////////////////////////

    static async login(req, res){
      
      
        const { email, password } = req.body

        if (!email) {
            res.status(422).json({message : "O email é obrigatório"})
            return
        }
        if (!password) {
            res.status(422).json({message : "O password é obrigatório"})
            return
        }

        //check if user exists

        const user = await User.findOne({email:email})
        console.log('xxxxxxxxxxxxxxx user vindo do banco: ', user)
        if (!user) {
            res.status(422).json({
                message:'Não existe usuário cadastrado com esse e-mail'
            })
            return
        }

        // check if password match with db password

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({message : "Senha incorreta"})
        }else{
            await createUserToken(user, req, res)
            return
        }

    }
////////////////////////////////////////////// check if user exists///////////////////////////////////////////////////
    static async checkUser(req, res){
        let currentUser
        // console.log(req.headers.authorization)

        if (req.headers.authorization) {//Verifica se há um cabeçalho de autorização na solicitação.
            const token = getToken(req)//obtém o token da solicitação usando a função getToken para remover o a palavra Bearer que vem junto com o token.
            const decoded = jwt.verify(token, 'nossosecret')//Decodifica o token usando a chave secreta 'nossosecret' com a função jwt.verify
    
                currentUser = await User.findById(decoded.id)//Obtém o usuário atual do banco de dados com base no ID extraído do token decodificado.
        
                currentUser.password = undefined//Remove a senha do usuário antes de enviá-lo.
            } else {
                // Se não houver cabeçalho de autorização, define currentUser como null.
                currentUser = null
            }
            //Envia a resposta HTTP com o status 200 e o objeto currentUser.
        res.status(200).send({currentUser})
    }

    /////////////////////////////////fim checkUser///////////////////////////////////////////////////////

    static async getUserById(req, res) {
        const id = req.params.id;
    
        try {
            // const user = await User.findById(id);
            
            //retorna todos os campos do user menos o password
            const user = await User.findById(id).select('-password')
            if (!user) {
                return res.status(422).json({ message: 'Usuário não encontrado!' });
            }

    // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            // Criar um novo objeto de usuário sem a password para devolver a requisão GET
            // essa função está comentada porque faz o mesmo que a linha:  const user = await User.findById(id).select('-password')
            // const userLessPassword = {
            //     name: user.name,
            //     email: user.email,
            //     id : user._id
                
            // };
    // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            res.status(200).json({ user });
        } catch (error) {
            // Lidar com erros
            console.error('Erro ao buscar usuário por ID:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
    /////////////////////////////////fim getUerById///////////////////////////////////////////////////////

    static async editUser(req, res) {
        const token = getToken(req)
    
        //console.log(token);
    
        const user = await getUserByToken(token)
    
        // console.log(user);
        // console.log(req.body)
        // console.log(req.file.filename)
    
        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword
    
        let image = ''
    
        if (req.file) {
            image = req.file.filename
            }
        
            // validations
            if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
            }
        
            user.name = name
        
            if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
            }
        
            // check if user exists
            const userExists = await User.findOne({ email: email })
        
            if (user.email !== email && userExists) {
            res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
            return
        }
    
        user.email = email
    
        if (image) {
            const imageName = req.file.filename
            user.image = imageName
            }
        
            if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório!' })
            return
            }
    
        user.phone = phone
    
        // check if password match
            if (password != confirmpassword) {
            res.status(422).json({ error: 'As senhas não conferem.' })
        
            // change password
            } else if (password == confirmpassword && password != null) {
            // creating password
            const salt = await bcrypt.genSalt(12)
            const reqPassword = req.body.password
        
            const passwordHash = await bcrypt.hash(reqPassword, salt)
        
            user.password = passwordHash
            }
        
            try {
            // returns updated data
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true },
            )
            res.json({
                message: 'Usuário atualizado com sucesso!',
                data: updatedUser,
            })
            } catch (error) {
            res.status(500).json({ message: error })
            }
        }
    }