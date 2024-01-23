import { useContext } from "react"
import { AppContext } from "./AppContext"
import { Route, Routes } from "react-router-dom"
import { Spinner } from "./components/Loader"
import Auth from "./Pages/Auth"
import Home from "./Pages/Home"
import Editor from "./Pages/Editor"
import Navbar from "./components/Navbar"

function App() {

  const { authLoading, user} = useContext(AppContext)
  
  if(authLoading){
    return <div className="w-full flex justify-center pt-[20%]">
      <Spinner size={20}/>
    </div>
  } else if(!user){
    return <Auth />
  } else {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/d/:formId" element={<Editor />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    )
  }
}

export default App
