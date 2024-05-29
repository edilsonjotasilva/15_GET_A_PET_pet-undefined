import { createContext  } from "react";

import useAuth from "../hooks/useAuth";


const Context = createContext()

// UserProvider: Este componente é um provedor de contexto que envolve a aplicação ou parte dela, fornecendo dados e funções de autenticação.O componente UserProvider fornece essas funções e estado através do Context


function UserProvider({ children }){

// Chama o hook useAuth que retorna as funções e o estado de autenticação        
const { authenticated, register, logout, login  } = useAuth()

{/* <Context.Provider value={...}>: Envolve os componentes filhos (children) e fornece o valor do contexto (neste caso, register, authenticated, logout, e login) para qualquer componente que consuma este contexto. */}
return (<Context.Provider value={{register,authenticated, logout, login } }>
                {children}
        </Context.Provider>)
}

// Context: Exporta o contexto para ser utilizado por outros componentes.
// UserProvider: Exporta o provedor de contexto para envolver a aplicação ou partes dela.
export { Context, UserProvider }