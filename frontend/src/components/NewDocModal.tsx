import axios from "axios"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../AppContext"

export default function NewDocModal({ modelToggle, setToggle }: {
  modelToggle: boolean
  setToggle: React.Dispatch<React.SetStateAction<boolean>>
}) {

  const navigate = useNavigate()
  const { addMsg } = useContext(AppContext)
  const [titleInput, setIpnut] = useState<string>("")


  function CloseModal() {
    setIpnut("")
    setToggle(false)
  }

  function CreateNewDoc(title: string) {
    CreateDoc(title)
      .then((doc) => {
        if (doc) {
          CloseModal()
          navigate(`/d/${doc._id}`)
        } else {
          addMsg("Error while create new doc", 'error', 4000)
        }
      })
  }
  return (
    <div className={`fixed z-50 top-0 left-0 ${modelToggle ? 'flex' : 'hidden'} items-center justify-center w-full h-screen bg-black bg-opacity-25`}>

      <div className="flex flex-col space-y-10 bg-white p-5 rounded-xl">
        <div className="flex justify-between space-x-14 items-center">
          <h1 className="text-2xl font-bold">Create new Document</h1>
          <button
            onClick={() => { CloseModal() }}
            className="">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col">
          <label htmlFor="titleInput">Enter the title of the document:</label>
          <input
            id="titleInput" type="text" minLength={3} maxLength={50}
            className="p-2 border-2 outline-none"
            value={titleInput}
            onChange={(event) => {
              setIpnut(event.target.value)
            }} />
        </div>

        <div className="flex justify-between space-x-7">
          <button
            onClick={() => { CloseModal() }}
            className="w-full font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 border px-5 py-2">
            Cancel
          </button>
          <button
            onClick={() => {
              CreateNewDoc(titleInput)
            }}
            className="w-full font-bold text-white bg-blue-700 hover:bg-blue-800 border px-5 py-2">
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

async function CreateDoc(title: string) {
  try {
    const { status, data } = await axios.post(`${import.meta.env.VITE_API_URL}/d`, { title }, { withCredentials: true })
    if (status === 201 && data.doc) {
      return data.doc as IDocSnippet
    }
    console.error("While creating doc", status, data)
    return null
  } catch (err) {
    console.error("While creating doc", err)
    return null
  }

}
