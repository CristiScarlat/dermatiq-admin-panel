import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import { Button, Form, ButtonGroup } from 'react-bootstrap';
import {signUp, signIn, signOut} from "../services/userbase";
import { Ctx } from "../context/store";
import { teamCards } from "../utils/uiConstants";

const Login = () => {
  const [formType, setFormType] = useState('signIn');
  const [username, setUsername] = useState();

  const { setSassion, setLoader } = useContext(Ctx);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true)
    const formData = {};
    for(let i=2; i<7; i++){
      if(e.target[i]?.id) formData[e.target[i].id] = e.target[i].value;
    }
    if(formType === "signUp"){
      if(formData.password === formData.confirmPassword){
        formData.rememberMe = "local";
        signUp(formData)
          .then(res => {
            if(res.error){
              alert(res.error.message)
            }
            else {
              sessionStorage.setItem("user", JSON.stringify(res))
              const storedSassion = JSON.parse(localStorage.getItem("userbaseCurrentSession"));
              setSassion(storedSassion)
              navigate("/")
            }
          })
          .catch(error => {
            console.log(error)
          })
          .finally(() => {
            setLoader(false);
          })
      }
      else {
        alert("Password and Confirm Password do not match! \n\nPassword și Confirm Password nu sunt la fel!")
      }
    }
    else if(formType === "signIn"){
      formData.rememberMe = "local";
      signIn(formData)
        .then(res => {
          if(res.error){
            console.log(res)
            alert(res.error.message)
            signOut()
          }
          else {
            sessionStorage.setItem("user", JSON.stringify(res))
            const storedSassion = JSON.parse(localStorage.getItem("userbaseCurrentSession"))
            setSassion(storedSassion)
            navigate("/")
          }
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          setLoader(false);
        })
    }
  }

  const handleSelectUser = (e) => {
    if(e.target.value >= 0){
      setUsername(teamCards["ro"][e.target.value])
    }
  }

  return (
    <div className="max-w-40 m-auto mt-5 p-3 shadow bg-dark rounded">
      <Form onSubmit={handleSubmit}>
        <ButtonGroup aria-label="signin-signup-select" className="mb-3 w-100">
          <Button
            variant={`${formType === "signIn" ? "success" : "outline-secondary"}`}
            onClick={() => setFormType("signIn")}>Sign In</Button>
          <Button
            variant={`${formType === "signUp" ? "success" : "outline-secondary"}`}
            onClick={() => setFormType("signUp")} >Sign Up</Button>
        </ButtonGroup>
        <Form.Select aria-label="Default select user" onChange={handleSelectUser} className="mb-3">
          <option value={-1}>Selectează user din listă</option>
          {teamCards["ro"].map((user, index) => (
            <option value={index} key={user.title + "-" + index}>{user.title}</option>
          ))}
        </Form.Select>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Username" value={username?.title || ""} onChange={e => setUsername(e.target.value)}/>
          {formType === "signUp" && <Form.Text className="text-muted" data-bs-theme="dark">
            Crează un username, poate fi numele tău întreg sau selectează-te din lista de mai sus.
          </Form.Text>}
        </Form.Group>

        {formType === "signUp" &&
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Email"/>
            {formType === "signUp" && <Form.Text className="text-muted" data-bs-theme="dark">
              Adresa email este folosită doar pentru a-ți transmite o parolă temporară
              în cazul în care îți vei uita parola ta de access creată la sign-up.
            </Form.Text>}
          </Form.Group>
        }

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password"/>
          {formType === "signUp" && <Form.Text className="text-muted" data-bs-theme="dark">
            Crează o parolă.
          </Form.Text>}
        </Form.Group>
        {formType === "signUp" &&
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirmă Password"/>
            {formType === "signUp" && <Form.Text className="text-muted" data-bs-theme="dark">
              Tastează din nou parola creată.
            </Form.Text>}
          </Form.Group>
        }

        <Button variant="outline-success" type="submit">
          {"Sign" + formType.split("sign").join(" ")}
        </Button>
      </Form>
    </div>
  )
}

export default Login;