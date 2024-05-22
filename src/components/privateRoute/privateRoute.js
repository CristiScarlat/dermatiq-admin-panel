import { useNavigate } from "react-router-dom";
import { Ctx } from "../../context/store";
import {useEffect, useContext} from "react";

const PrivateRoute = ({children}) => {
  const navigate = useNavigate();
  const { sassion } = useContext(Ctx);

  useEffect(() => {
    if(!sassion || !sassion.signedIn){
      navigate("/login");
    }
  }, [sassion])

  if(sassion && sassion.signedIn){
    return(
      <div>
        {children}
      </div>
    )
  }
  else {
    return null;
  }

}
export default PrivateRoute;