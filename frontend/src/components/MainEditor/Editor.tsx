import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  $getRoot,
  $getSelection,
  EditorState,

} from "lexical";
import Toolbar from "./ToolBar";
import { useCallback, useEffect } from "react";
import socket from "../../socket";
import { useParams } from "react-router-dom";



export default function Editor() {

  const { docId } = useParams();
  // console.log(docId)

  const onChange = useCallback((editorState: EditorState) => {
    // console.log(editorState)
    socket.emit("edit-doc", docId, JSON.stringify(editorState))
  }, [docId])

  function HandleUpdatedDocByOhter(res: any){
    console.log("Updated doc", res) 
  }
  useEffect(()=>{
    socket.on("updated-doc", HandleUpdatedDocByOhter)
    return ()=>{
      socket.off("updated-doc", HandleUpdatedDocByOhter)
    }
  }, [])
  return (
    <div className="relative rounded-sm shadow-sm border bg-[#F3F3F3]">
      <div className="w-full bg-white border max-w-[816px] mx-auto min-h-[1056px] mt-20  mb-5 p-12">
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
              namespace: 'the-main-editor',
              onError(error) {
                throw error;
              },
            }}
          >
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
            <OnChangePlugin onChange={onChange} />
            <HistoryPlugin />
          </LexicalComposer>
        </div>
      </div>
    </div>
  )
}


