import { useNavigate } from "react-router-dom"

function Footer(){
    const navigate = useNavigate()
    function handleClick(){
        navigate('/login')
        navigate('/register')
    }
    return(
        <section className="fixed-bottom p-3 bg-warning">
            <div class="panel-footer">Panel Footer</div>
        </section>
    )
}

export default Footer