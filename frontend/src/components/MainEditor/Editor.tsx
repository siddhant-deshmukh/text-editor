import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  EditorState,
} from "lexical";
import Toolbar from "./ToolBar";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import socket from "../../socket";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "../Loader";
import PermissionModal from "./PermissionsModal";
import { AppContext } from "../../AppContext";
import UpdateDocFromChangesByOther from "./UpdateDocFromChangesByOther";



export default function Editor() {

  const { docId } = useParams();
  const initialEditorState = useRef("")

  const [error, setError] = useState<string>("")
  const [loding, setLoding] = useState<boolean>(true)
  const [permissionModal, setPermissionModal] = useState<boolean>(false)
  const [permission, setPermissions] = useState<IPermissions | undefined>(undefined)

  const { user } = useContext(AppContext)
  // console.log(docId)

  // const onChange = useCallback((editorState: EditorState) => {
  //   // console.log(editorState)
  //   socket.emit("edit-doc", docId, JSON.stringify(editorState))
  // }, [docId])


  useEffect(() => {
    console.log("In here", docId)
    if (socket.connected && docId) {
      console.log(socket.connected , "Connecting")
      console.log("Joining room", docId)
      socket.emit("join-r", docId)
    } 

    socket.on("room-status", (res)=>{
      console.log("room status", res)
    })

    return ()=>{
      socket.off("room-status")
    }
  }, [docId])

  
  useEffect(() => {
    setLoding(true)
    axios.get(`${import.meta.env.VITE_API_URL}/d/${docId}`, { withCredentials: true })
      .then(({ status, data }) => {
        if (status === 200 && data.doc) {
          initialEditorState.current = data.doc.content
          // console.log(data.doc.content, initialEditorState.current)
          if (user?._id === data.doc.author_id) {
            setPermissions({
              is_public: data.doc.is_public ? data.doc.is_public : false,
              read_access: (data.doc.read_access ? data.doc.read_access : []),
              write_access: (data.doc.write_access ? data.doc.write_access : [])
            })
          }
          setError("")
        } else {
          setError("Document didn't load properly")
        }
      }).catch((err) => {
        console.error("While fetching the document content", err)
        setError("Document didn't load properly")
      }).finally(() => {
        setLoding(false)
      })
  }, [initialEditorState, user, docId, setLoding, setPermissions])

  if (loding || error.length > 0) {
    return <div className="w-full pt-[10%] flex justify-center h-screen">
      {
        loding &&
        <Spinner size={20} />
      }
      {
        !loding &&
        <div>
          {error}
        </div>
      }
    </div>
  }
  return (
    <div className="relative rounded-sm shadow-sm border bg-[#F3F3F3]">
      {
        permissionModal && permission &&
        <PermissionModal
          modelToggle={permissionModal}
          setToggle={setPermissionModal}
          permission={permission}
          setPermissions={setPermissions} />
      }
      <div className="w-full relative bg-white border max-w-[816px] mx-auto min-h-[1056px] mt-20  mb-5 p-12">
        {
          permission &&
          <div
            className="ml-auto">
            <button
              onClick={() => {
                setPermissionModal(true)
              }}
              className="absolute right-0 -top-7 text-white font-semibold bg-blue-600 hover:bg-blue-700 text-xs rounded-lg px-4 py-1">
              Edit Access
            </button>
          </div>
        }
        <div className="hover:cursor-text">
          <LexicalComposer
            initialConfig={{
              theme: {
                // ltr: 'ltr',
                // rtl: 'rtl',
                paragraph: 'mb-1',
                rtl: 'text-right',
                ltr: 'text-left',
                text: {
                  bold: 'font-bold',
                  italic: 'italic',
                  underline: 'underline',
                  strikethrough: 'line-through',
                },
              },
              editorState: initialEditorState.current,
              namespace: 'the-main-editor',
              onError(error) {
                throw error;
              },
            }}
          >
            <UpdateDocFromChangesByOther />
            <Toolbar />
            <RichTextPlugin
              ErrorBoundary={() => {
                return <div>Error!</div>
              }}
              contentEditable={
                <ContentEditable className="min-h-[450px] outline-none py-[15px] px-2.5 resize-none overflow-hidden text-ellipsis" />
              }
              placeholder={null}
            />
            {/* <OnChangePlugin onChange={onChange} /> */}
            <HistoryPlugin />
          </LexicalComposer>
        </div>
      </div>
    </div>
  )
}


