import axios, { AxiosError } from "axios"
import { useCallback, useContext, useRef, useState } from "react"
import { AppContext } from "../AppContext"
import { Spinner } from "../components/Loader"

export default function Auth() {

  const [authType, setAuthType] = useState<"login" | "register">("register")
  const [loding, setLoding] = useState<boolean>(false)

  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const emailInputRef = useRef<HTMLInputElement | null>(null)
  const passwordInputRef = useRef<HTMLInputElement | null>(null)

  const { setUser, addMsg } = useContext(AppContext)

  const onSubmitForm = useCallback(() => {
    if (!loding && emailInputRef.current && passwordInputRef.current) {
      setLoding(true)
      axios.post(
        `${import.meta.env.VITE_API_URL}/${authType === "register" ? 'register' : 'login'}`,
        {
          email: emailInputRef.current.value,
          name: nameInputRef.current?.value,
          password: passwordInputRef.current.value
        } as IUserCreate,
        { withCredentials: true }
      ).then(({ status, data }) => {
        if ((status === 200 || status === 201) && data.user) {
          setUser(data.user)
        } else {
          console.warn("Special case", status, data)
          addMsg("Error while authentication", "error", 4000);
        }
      }).catch((err: AxiosError) => {
        console.error("While authenticating ", err)
        let status = err.response?.status
        if (err.response?.status) {
          switch (status) {
            case 400:
              addMsg("Bad request. Check password length is more than 5", "error", 4000);
              break;
            case 404:
              addMsg("Register. As user does not exist", "error", 4000);
              break;
            case 409:
              addMsg("Login. As user already exist", "error", 4000);
              break;
            case 406:
              addMsg("Wrong email or password", "error", 4000);
              break;
            case 500:
              addMsg("Internal servor error", "error", 4000);
              break;
            default:
              addMsg("Error while authentication", "error", 4000);
          }
        } else {
          addMsg("Error while authentication", "error", 5000)
        }
      }).finally(() => {
        setLoding(false)
      })
    }
  }, [authType, loding])

  return (
    <div className="w-full h-screen flex bg-blue-900 items-center justify-center">
      <div className="px-4 md:px-0 border bg-white shadow-lg w-full max-w-[600px]">
        <div className="p-10">
          <div className="text-center">
            <h4 className="mb-12 mt-1 pb-1 text-5xl font-extrabold">
              Doc Writer
            </h4>
          </div>

          <form
            className="flex flex-col"
            onSubmit={(event) => {
              console.log("Here submit!")
              event.preventDefault()
              onSubmitForm()
            }}>


            {
              (authType === "register") &&
              <div className="relative my-4 " data-te-input-wrapper-init>
                <input
                  ref={nameInputRef}
                  type="text"
                  className="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="nameInput"
                  placeholder="Name"
                  minLength={3}
                  maxLength={50}
                  required />
                <label
                  htmlFor="nameInput"
                  className="text-xs text-gray-700 -top-4 absolute"
                >Name
                </label>
              </div>
            }

            <div className="relative my-4 " data-te-input-wrapper-init>
              <input
                ref={emailInputRef}
                type="email"
                className="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                id="exampleFormControlInput1"
                placeholder="Email"
                minLength={3}
                maxLength={50}
                required />
              <label
                htmlFor="exampleFormControlInput1"
                className="text-xs text-gray-700 -top-4 absolute"
              >Email
              </label>
            </div>


            <div className="relative my-4 " data-te-input-wrapper-init>
              <input
                ref={passwordInputRef}
                type="password"
                className="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                id="exampleFormControlInput11"
                placeholder="Password"
                minLength={5}
                maxLength={20}
                required />
              <label
                htmlFor="exampleFormControlInput11"
                className="text-xs text-gray-700 -top-4 absolute"
              >Password
              </label>
            </div>


            <div className="my-10 pb-1 pt-1 text-center">
              {
                loding &&
                <div
                  className="flex justify-center mb-3 border text-white bg-blue-50 w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium "
                >
                  <Spinner size={4} />
                </div>
              }
              {
                !loding &&
                <button
                  className="mb-3 inline-block border text-white bg-blue-900 hover:bg-blue-800 w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normalshadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                  type="submit"
                  data-te-ripple-init
                  data-te-ripple-color="light">
                  {
                    (authType === "register") ? "Register" : "Login"
                  }
                </button>
              }
            </div>


            <div className="flex items-center justify-between pb-6">
              <p className="mb-0 mr-2">
                {
                  (authType === "register") ? "Already " : "Don't "
                }
                have an account?
              </p>
              <button
                type="button"
                className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                data-te-ripple-init
                data-te-ripple-color="light"
                onClick={() => {
                  setAuthType((prev) => (prev === "login") ? "register" : "login")
                }}>
                {
                  (authType === "register") ? "Login" : "Register"
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}