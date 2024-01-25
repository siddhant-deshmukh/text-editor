import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function PermissionModal({ modelToggle, permission, setPermissions, setToggle }: {
  modelToggle: boolean
  setToggle: React.Dispatch<React.SetStateAction<boolean>>
  permission: IPermissions
  setPermissions: React.Dispatch<React.SetStateAction<IPermissions | undefined>>
}) {

  const { docId } = useParams();
  const [emailInput, setEmailInput] = useState<string>("")
  const [emailsList, setEmailsList] = useState<(string | undefined)[]>([])
  // const [emailInput2, setEmailInput2] = useState<string>("")

  useEffect(() => {
    if (permission) {
      const promiseArr = permission.write_access.map(async (_id) => {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/get_mail?_id=${_id}`)
          return data?.user?.email as string | undefined
        } catch (err) {
          console.error("While getting email", _id, err)
          return undefined
        }
      })
      Promise.all(promiseArr)
        .then((emails) => {
          console.log(emails)
          const list = emails.filter((e) => e != undefined)
          setEmailsList(list)
        })
    }
  }, [permission])

  function CloseModal() {
    setToggle(false)
  }

  return (
    <div className={`fixed z-50 top-0 left-0 ${modelToggle ? 'flex' : 'hidden'} items-center justify-center w-full h-screen bg-black bg-opacity-25`}>

      <div className="flex flex-col space-y-10 bg-white p-5 rounded-xl">
        <div className="flex justify-between space-x-14 items-center">
          <h1 className="text-2xl font-bold">Edit Document Access</h1>
          <button
            onClick={() => { CloseModal() }}
            className="">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col">
          <label htmlFor="emailInput">Give read/write access:</label>
          <div className="flex justify-end">
            <input
              id="emailInput" type="text" minLength={3} maxLength={50}
              className="p-2 border-2 outline-none w-full"
              value={emailInput}
              onChange={(event) => {
                setEmailInput(event.target.value)
              }}
              placeholder="write email" />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3"
              onClick={() => {
                CheckIfEmailExist(emailInput)
                  .then(() => {

                  })
              }}>
              Add
            </button>
          </div>
          <div className="mt-3">
            {
              emailsList.map((mail, index) => {
                if (mail) {
                  return <span key={index} className="mr-2 px-3 py-1 font-bold rounded-lg text-xs bg-blue-600 text-white">
                    {mail}
                  </span>
                }
                return <span key={index}></span>
              })
            }
          </div>
        </div>


        <div className="flex justify-between space-x-7">
          <button
            onClick={() => { CloseModal() }}
            className="w-full font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 border px-5 py-2">
            Cancel
          </button>
          <button
            onClick={() => {
              UpdateAccess(docId, permission)
            }}
            className="w-full font-bold text-white bg-blue-700 hover:bg-blue-800 border px-5 py-2">
            Update
          </button>
        </div>
      </div>
    </div>
  )
}


async function CheckIfEmailExist(email: string) {
  try {
    const { status, data } = await axios.get(`${import.meta.env.VITE_API_URL}/from_email?email=${email}`, { withCredentials: true })
    if (status === 200 && data.user) {
      return true
    }
    return false
  } catch (err) {
    console.error("While checking if eamil exist", err)
    return null
  }
}

async function UpdateAccess(docId?: string, permissions?: IPermissions) {
  try {
    const { status, data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/d/permissions/${docId}`,
      {
        ...permissions
      },
      { withCredentials: true }
    )
    if (status === 200 && data.doc) {
      return true
    }
    return false
  } catch (err) {
    console.error("While updating document access", err)
    return null
  }
}