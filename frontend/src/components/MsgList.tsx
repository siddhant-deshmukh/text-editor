import { useContext } from "react"
import { AppContext } from "../AppContext"

export default function MsgList() {

  const { msgs, deleteMsg } = useContext(AppContext)

  return (
    <div className="fixed z-[60] top-0 w-full flex justify-center">
      <div className="absolute z-[60] max-w-xl top-0 px-2">
        {
          msgs.map((msg) => {
            return <div
              key={msg.id}
              className={`
                w-full sm:w-[576px]
                flex py-2 px-3 items-center mt-5 rounded-lg shadow-sm border text-xs justify-between
                ${(msg.type === "error") ? 'bg-red-50 text-red-900'
                  : (msg.type === "warn" ? 'bg-yellow-50 text-yellow-900'
                    : 'bg-green-50 text-green-900')
                }`}>
              <span className="">{msg.msg}</span>
              <button
                onClick={() => {
                  deleteMsg(msg.id)
                }}
                className="ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          })
        }
      </div>
    </div>
  )
}
