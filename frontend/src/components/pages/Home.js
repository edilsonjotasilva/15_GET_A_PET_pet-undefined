import { useNavigate } from "react-router-dom"

function Home(){
    const navigate = useNavigate()
    function handleClick(){
        navigate('/login')
    }
    return(
        <section className="mx-3 mt-4">
            <h1 class="meutitulo">Home</h1>
        </section>
    )
}

export default Home