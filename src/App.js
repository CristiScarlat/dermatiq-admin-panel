import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import PrivateRoute from "./components/privateRoute/privateRoute";
import Header from "./components/header/header";
import {useEffect} from "react";
import {initUB} from "./services/userbase";
import AccountPage from "./pages/account";
import FourZeroFour from "./pages/fourZeroFour";

function App() {
  useEffect(() => {
    initUB();
  }, [])

  console.log("render app")

  return (
    <>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>}/>
          <Route path="/account" element={<PrivateRoute><AccountPage/></PrivateRoute>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path={'*'} element={<FourZeroFour/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
