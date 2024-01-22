import { Editor as OldEditor } from "./Editor/Editor"
import Editor from "./MainEditor/Editor"
import TextEditor from "./TextEditor/TextEditor"

function App() {

  return (
    <div className="bg-[#F3F3F3] min-h-screen">
      {/* <TextEditor /> */}
      <Editor />
      {/* <OldEditor /> */}
    </div>
  )
}

export default App
