import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

//import Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer';
import Container from './components/layout/Container';
 import Message from './components/layout/Message';
//import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

//import Pages
import Login from './components/pages/Auth/Login'
import Register from './components/pages/Auth/Register'
import Home from './components/pages/Home';
import Profile  from '../src/components/pages/User/Profile'
import MyPets from './components/pages/Auth/Pet/MyPets';
import AddPet from './components/pages/Auth/Pet/AddPet';
import EditPet from './components/pages/Auth/Pet/EditPet';

// context
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <Router>
      <UserProvider>
      <Navbar />
      <Message />
        <Container>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pet/mypets" element={<MyPets />} />
              <Route path="/pet/add" element={<AddPet />} />
              <Route path="/pet/edit/:id" element={<EditPet />} />
              <Route path="login" element={<Login/>} />
              <Route path="/allusers" element={<Navigate to="/users" />} />
              <Route path="register" element={<Register />} />
              <Route path="user/profile" element={<Profile />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  )
}


export default App;
