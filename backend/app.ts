import cors from 'cors'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';

import docRouter from './routes/docRoutes'
import indexRouter from './routes/indexRoutes'
import { CheckIfEditAllowed, CheckJWTCookie, UpdateDoc } from './utils';
// import orderRouter from './routes/orderRoutes'

dotenv.config();

const app: Express = express();
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", `${process.env.CLIENT_URL}`],
    methods: ["POST", "GET"],
    credentials: true,
  },

});

const port = process.env.PORT || 5000;

io.on('connection', (socket) => {
  const cookie = socket.handshake.headers.cookie
  const user_id = CheckJWTCookie(cookie)

  socket.on("disconnect", (reason) => {
    console.log("Disconnected", reason)
  })
  // socket.on("join-doc-room", async (docId: string) => {
  //   let allowed = false
  //   if (!socket.rooms.has(docId) && user_id) {
  //     const isAutherizedToEdit = await CheckIfEditAllowed(docId, user_id)
  //     if (isAutherizedToEdit) {
  //       socket.join(docId)
  //       allowed = true
  //     }
  //   }
  // })
  socket.on("join-r", async (docId) => {
    console.log("Here", docId, user_id)
    if (!socket.rooms.has(docId) && user_id) {
      const isAutherizedToEdit = await CheckIfEditAllowed(docId, user_id)
      if (isAutherizedToEdit) {
        console.log("joined")
        socket.join(docId)
        socket.to(socket.id).emit("room-status", {
          docId,
          msg: "Joined",
        })
      } else {
        socket.to(socket.id).emit("room-status", {
          docId,
          msg: "Not Autherized",
        })
      }
    } else if (socket.rooms.has(docId)) {
      socket.to(socket.id).emit("room-status", {
        docId,
        msg: "Already joined",
      })
    } else {
      socket.to(socket.id).emit("room-status", {
        docId,
        msg: "Not Joined",
      })
    }
  })
  // socket.on("edit-doc", async (docId: string, updatedDoc: string) => {
  //   let allowed = false
  //   if (socket.rooms.has(docId)) {
  //     allowed = true
  //   } else {
  //     if (user_id) {
  //       const isAutherizedToEdit = await CheckIfEditAllowed(docId, user_id)
  //       if (isAutherizedToEdit) {
  //         socket.join(docId)
  //         allowed = true
  //       }
  //     }
  //   }
  //   if (allowed && user_id) {
  //     const updateChanges = await UpdateDoc(docId, updatedDoc, user_id)
  //     // console.log(updateChanges)
  //     io.to(docId).emit("updated-doc", {
  //       docId,
  //       updatedDoc,
  //       updatedBy: user_id
  //     })
  //   }
  // })
  // socket.on("", () => {

  // })
  // socket.join()
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  //@ts-ignore
  socket.username = username;
  next();
})

// parsing cokkie values
app.use(cookieParser())
// limit the size of incoming request body and parse i.e convert string json to js object for every incoming request
app.use(express.json({ limit: '20kb' }))
// limiting size of url
app.use(express.urlencoded({ extended: false, limit: '1kb' }));
// setting up client origin
app.use(cors({ origin: ["http://localhost:5173", `${process.env.CLIENT_URL}`], credentials: true, optionsSuccessStatus: 200 }));

mongoose.connect(process.env.MONGODB_ATLAS_URL as string)
  .then(() => { console.log("Connected to database") })
  .catch((err) => { console.error("Unable to connect database", err) })

app.use('/d', docRouter)
app.use('/', indexRouter)
// app.use('/order', orderRouter)

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app