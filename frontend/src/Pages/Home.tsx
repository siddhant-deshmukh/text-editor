import axios from "axios"
import { Link } from "react-router-dom"
import { AppContext } from "../AppContext"
import { useCallback, useContext, useEffect, useState } from "react"
import NewDocModal from "../components/NewDocModal"

export default function Home() {
  const { docs, setDocs, addMsg } = useContext(AppContext)
  const [modelToggle, setToggle] = useState<boolean>(false)

  const fetchDocs = useCallback(() => {
    GetDocs()
      .then((docs) => {
        if (!docs) {
          addMsg("Error while fetching documents list", 'error', 4000)
        } else {
          setDocs(docs)
        }
      })
  }, [setDocs])

  useEffect(() => {
    fetchDocs()
  }, [])

  return (
    <main className="">
      <NewDocModal modelToggle={modelToggle} setToggle={setToggle} />
      <div className="bg-[#F3F3F3] w-full py-7 mb-5 ">
        <div className="max-w-7xl mx-auto px-4">
          <div>
            <h3 className="text-gray-700 font-medium my-2">Create a new Document</h3>
            <button
              onClick={() => { setToggle(true) }}
              className="flex items-center justify-center w-48  bg-white text-blue-300">
              {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={7} stroke="currentColor" className="w-20 h-20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg> */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full aspect-[15/17]">
                <path strokeLinecap="square" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto max-w-7xl mx-auto px-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-900 uppercase bg-blue-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3 w-48">
                Owner
              </th>
              <th scope="col" className="px-6 py-3 w-52">
                Last Modified
              </th>
            </tr>
          </thead>
          <tbody>
            {
              docs.map((doc) => {
                const date = new Date(doc.last_updated)
                return (
                  <tr key={doc._id} className="bg-white hover:bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <Link className="block w-full px-6 py-4" to={`/d/${doc._id}`}>
                        {doc.title}
                      </Link>
                    </th>
                    <td className="">
                      <Link className="block w-full px-6 py-4" to={`/d/${doc._id}`}>
                        {doc.author ? doc.author : "You"}
                      </Link>
                    </td>
                    <td className="">
                      <Link className="block w-full px-6 py-4" to={`/d/${doc._id}`}>
                        {date.toLocaleDateString()}
                      </Link>
                    </td>
                  </tr>
                )
              })
            }
            {
              docs.length === 0 &&
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  No documents to show. Create a new one.
                </th>
                <td className="px-6 py-4">
                  --
                </td>
                <td className="px-6 py-4">
                  --
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

    </main>
  )
}

async function GetDocs() {
  try {
    const { status, data } = await axios.get(`${import.meta.env.VITE_API_URL}/d`, { withCredentials: true })
    if (status === 200 && data.docs) {
      return data.docs as IDocSnippet[]
    }
    console.error("While getting docs", status, data)
    return null
  } catch (err) {
    console.error("While getting docs", err)
    return null
  }
}
