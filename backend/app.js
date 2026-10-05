import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import "dotenv/config";
import authRouter from "./routes/auth.route.js";
import incidentRouter from "./routes/incident.route.js";
import helmet from "helmet";
const app = express();
app.use(helmet())
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/incidents", incidentRouter);
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});
app.set("io" , io)

server.listen(process.env.PORT, () => {
    console.log(`server running on ${process.env.PORT}`);
});
