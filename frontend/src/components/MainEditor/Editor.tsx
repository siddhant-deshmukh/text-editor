import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  $getSelection,
  EditorState,

} from "lexical";
import Toolbar from "./ToolBar";



export default function Editor() {
  return (
    <div className="relative rounded-sm shadow-sm border ">
      <div className="w-full bg-white max-w-[816px] mx-auto min-h-[1056px] mt-20  mb-5 p-12">
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

function onChange(editorState: EditorState) {
  editorState.read(() => {
    // const root = $getRoot();
    const selection = $getSelection();

    // console.log(selection);
  });
}
