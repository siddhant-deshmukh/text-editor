import { useContext, useEffect } from "react"
import { Route, Routes } from "react-router-dom"

import socket from "./socket"
import Auth from "./Pages/Auth"
import Home from "./Pages/Home"
import Editor from "./Pages/Editor"
import Navbar from "./components/Navbar"
import { AppContext } from "./AppContext"
import { Spinner } from "./components/Loader"

function App() {

  const { authLoading, user } = useContext(AppContext)

  useEffect(() => {
    if (user) {
      socket.auth = { username: user._id };
      socket.connect();


      socket.on("connect_error", (err) => {
        if (err.message === "invalid username") {
          console.error("Error connection")
        }
      });
    }
    return ()=>{
      console.log("Socket off connection error")
      socket.off("connect_error");
    }
  }, [user])

  if (authLoading) {
    return <div className="w-full flex justify-center pt-[20%]">
      <Spinner size={20} />
    </div>
  } else if (!user) {
    return <Auth />
  } else {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/d/:docId" element={<Editor />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    )
  }
}

export default App
