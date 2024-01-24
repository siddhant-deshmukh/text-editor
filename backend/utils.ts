import * as jwt from 'jsonwebtoken'
import Doc from './models/doc'

export function CheckJWTCookie(cookie: string | undefined) {
  try {
    if (cookie) {
      const pairs = cookie.split(";")
      let access_token
      pairs.forEach((pair) => {
        const splitted = pair.split("=")
        if (splitted.length >= 2 && splitted[0].trim() === "access_token") {
          access_token = splitted[1].trim() as string
        }
      })
      if (access_token) {
        const decoded = jwt.verify(access_token, process.env.TOKEN_KEY || 'zhingalala');
        if (typeof decoded != 'string' && decoded._id) {
          return decoded._id as string
        }
      }
    }
  } catch (err) {

  }
}

export async function CheckIfEditAllowed(docId: string, user_id: string) {
  try {
    const doc = await Doc.findById(docId).select({ author_id: 1, write_access: 1 })
    if (!doc) return false;

    const docObj = doc.toObject()
    console.log(docObj)
    if (docObj.author_id.toString() === user_id || docObj.write_access.filter((id) => id.toString() === user_id).length > 0) {
      return true
    }
  } catch (err) {
    return false
  }
}

export async function UpdateDoc(docId: string, updated_doc: string, user_id: string) {
  try {
    const doc = await Doc.findById(docId)

    if (doc) {
      doc.content = updated_doc
      const newDoc = await doc.save()
      return newDoc
    }

    return false
  } catch (err) {
    return false
  }
}