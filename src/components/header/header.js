import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {signOut} from "../../services/userbase";
import {useContext} from "react";
import {useNavigate} from "react-router-dom";
import {Ctx} from '../../context/store';
import Spinner from "../spinner/spinner";
import {useLocation, Link} from "react-router-dom";

const Header = () => {
  const {sassion, setSassion, loader} = useContext(Ctx);
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const expand = "lg"

  const handleLogout = () => {
    signOut()
      .then(res => {
        console.log(">>>>", res)
        const storedSassion = JSON.parse(localStorage.getItem("userbaseCurrentSession"));
        setSassion(storedSassion)
        sessionStorage.removeItem("user")
        navigate("/login")
      })
      .catch(error => console.log(error))
  }

  return (
    <>
      <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3" bg="dark" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand className="text-success">Dermatiq Panel</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
            bg="dark" data-bs-theme="dark"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                Offcanvas
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="flex-fill d-flex align-items-center text-muted">
                {(sassion?.username && sassion.signedIn) && <p className="text-capitalize m-0">{sassion?.username}</p>}
              </div>
              {(sassion && sassion.signedIn) && <Nav className="justify-content-end flex-grow-1 pe-3">
                <Link to="/" className={`${pathname === "/" ? "active" : ""} nav-link`}>Home</Link>
                <Link to="/account" className={`${pathname === "/account" ? "active" : ""} nav-link`}>Account</Link>
              </Nav>}
              {(sassion && sassion.signedIn) && <Button variant="outline-success" onClick={handleLogout}>Logout</Button>}
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      {loader && <Spinner/>}
    </>
  )
}

export default Header;