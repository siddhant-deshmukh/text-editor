interface IUserCreate {
  name: string
  email: string
  password: string
}

interface IUser {
  _id: string
  name: string
  email: string
  docs?: string[]
}

interface IDocSnippet {
  _id: string
  title: string
  last_updated: number
  access_to?: 'read' | 'write'
  owner: string
  author_id: string
}

interface IMsg {
  type: 'error' | 'warn' | 'normal'
  msg: string 
  id: number
  time? : number
}

interface IPermissions {
  write_access: string[]
  read_access: string[]
  is_public: boolean
}