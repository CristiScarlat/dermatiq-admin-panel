import { createContext, useState } from "react";

export const Ctx = createContext({});

const Provider = ({children}) => {
  const savedSassion = localStorage.getItem("userbaseCurrentSession");
  const [sassion, setSassion] = useState(JSON.parse(savedSassion));
  const [user, setUser] = useState();

  const [loader, setLoader] = useState(false);

  return <Ctx.Provider value={{sassion, setSassion, user, setUser, loader, setLoader}}>{children}</Ctx.Provider>
}

export default Provider;