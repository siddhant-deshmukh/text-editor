import mongoose, { Types } from "mongoose";

export interface IDocSnippet {

}
export interface IDocCreate {
  title: string
  author_id: Types.ObjectId
  write_access: Types.ObjectId[]
  content: string
  last_updated: number
}
export interface IDoc extends IDocCreate {
  _id: Types.ObjectId,
}

const DocSchema = new mongoose.Schema<IDoc>({
  title: { type: String, required: true, maxLength: 50, minlength: 3 },
  author_id: { type: mongoose.Schema.ObjectId, ref: "User", index: 1 },
  last_updated: { type: Number },
  write_access: [{ type: mongoose.Schema.ObjectId, ref: "User", index: 1 }],
  content: { type: String, default: "" }
})

const Doc = mongoose.model<IDoc>("Doc", DocSchema);
export default Doc;