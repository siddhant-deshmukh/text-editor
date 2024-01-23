import axios from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";

export const AppContext = createContext<{
  user?: IUser,
  authLoading: boolean,
  docs: IDocSnippet[],
  msgs: IMsg[],
  deleteMsg(id: number): void,
  setDocs: React.Dispatch<React.SetStateAction<IDocSnippet[]>>,
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>,
  setAuthLoading: React.Dispatch<React.SetStateAction<boolean>>,
  addMsg(msg: string, type: IMsg['type'], time: IMsg['time']): void,
}>({
  user: undefined,
  authLoading: false,
  docs: [],
  msgs: [],
  addMsg: () => { },
  setUser: () => { },
  setDocs: () => { },
  deleteMsg: () => { },
  setAuthLoading: () => { },
})

export const AppProvider = ({ children }: { children: ReactNode }) => {

  const [msgs, setMsgs] = useState<IMsg[]>([])
  const [docs, setDocs] = useState<IDocSnippet[]>([])
  const [authLoading, setAuthLoading] = useState<boolean>(true)
  const [user, setUser] = useState<IUser | undefined>(undefined)

  function addMsg(msg: string, type: IMsg['type'], time: IMsg['time']) {
    const id = Math.floor(Math.random() * 100000)
    setMsgs((prev) => {
      return [{
        id,
        msg,
        type,
        time
      }, ...prev]
    })
    if(time){
      setTimeout(() => {
        setMsgs((prev) => {
          return prev.filter((msg) => msg.id != id).slice()
        })
      }, time)
    }
  }

  function deleteMsg(id: number) {
    setMsgs((prev) => {
      return prev.filter((msg) => msg.id != id).slice()
    })
  }
  useEffect(() => {
    setAuthLoading(true)
    axios.get(`${import.meta.env.VITE_API_URL}`, { withCredentials: true })
      .then(({ status, data }) => {
        if (status === 200 && data?.user?._id) {
          setUser(data.user)
        } else {
          if (typeof (data?.msg) === 'string') {
            addMsg(data?.msg, 'error', 4000)
          } else {
            addMsg("Error while login", 'error', 4000)
          }
          console.log(status, data)
        }
      }).catch((err) => {
        console.error("while geting user data", err)
        if (typeof (err.response?.data?.msg) === 'string') {
          addMsg(err.response?.data?.msg, 'error', 4000)
        } else {
          addMsg("Error while login", 'error', 4000)
        }
      }).finally(() => {
        setAuthLoading(false)
      })
  }, [setUser, setAuthLoading])

  return (
    <AppContext.Provider value={{
      user, setUser,
      docs, setDocs,
      msgs, addMsg, deleteMsg,
      authLoading, setAuthLoading
    }}>
      {children}
    </AppContext.Provider>
  )
}


/**
 msgs

 { id: 1, msg: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae voluptatem neque animi.", type: 'error' },
 { id: 2, msg: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae voluptatem neque animi.", type: 'normal' },
 { id: 3, msg: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae voluptatem neque animi.", type: 'warn' },

 */