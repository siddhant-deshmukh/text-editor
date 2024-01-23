import cors from 'cors'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';

import docRouter from './routes/docRoutes'
import indexRouter from './routes/indexRoutes'
// import orderRouter from './routes/orderRoutes'

dotenv.config();

const app: Express = express();
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", `${process.env.CLIENT_URL}`],
    methods: ["PUT", "GET"],
  }
});

const port = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log('a user connected');
});

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