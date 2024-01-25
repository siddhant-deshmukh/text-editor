import socket from '../../socket';
import { AppContext } from '../../AppContext';
import { useCallback, useContext, useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';


export default function UpdateDocFromChangesByOther() {
  const { docId } = useParams();
  const { user } = useContext(AppContext)
  const [editor] = useLexicalComposerContext();

  const handleUpdatedDocByOhter = useCallback(({ updatedBy, updatedDoc }: { docId: string, updatedBy: string, updatedDoc: string }) => {
    console.log(updatedBy != user?._id)
    if (updatedBy != user?._id) {
      const editorState = editor.parseEditorState(updatedDoc)
      console.log(updatedBy, updatedDoc)
      editor.setEditorState(editorState)
    }
    // console.log("Updated doc", )
  }, [editor, user])
 
  useEffect(() => {
    socket.on("updated-doc", handleUpdatedDocByOhter)

    return () => {
      socket.off("updated-doc", handleUpdatedDocByOhter)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const content = JSON.stringify(editor.getEditorState())
      console.log(content)
      axios.post(`${import.meta.env.VITE_API_URL}/d/${docId}`, {
        content
      }, { withCredentials: true })
        .then(({ status }) => {
          console.log("changed doc", status)
        }).catch((err) => {
          console.log("While posting changers", err)
        })
    }, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [editor])
  return (
    <div></div>
  )
}
