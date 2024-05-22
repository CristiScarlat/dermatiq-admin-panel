import userbase from "userbase-js";

export const initUB = () => {
  console.log("init-userbase")
  userbase
    .init({ appId: process.env.REACT_APP_USERBASE_APP_ID})
    .then(session => {
      if(session?.user?.authToken){
          sessionStorage.setItem("user", JSON.stringify(session))
      }
    })
    .catch(error => console.log(error))

}

export const signUp = async (formData) => {
  try{
    return await userbase.signUp(formData)
  }
  catch(error){
    return {error}
  }
}

export const signIn = async (formData) => {
  try{
    return await userbase.signIn(formData)
  }
  catch(error){
    return {error}
  }
}

export const signOut = async () => {
  try{
    return await userbase.signOut()
  }
  catch(error){
    return {error}
  }
}