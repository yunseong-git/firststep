import express from "express";
import mongoose from "mongoose";
import noteRouter from "./routes/noteRouter";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT;
const db_url = process.env.DB_URL;

app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname,"views")));

const server = async () => {
    try {
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.listen(port, () => {
            console.log(`Server is running on ${port}`);
        });

        await mongoose.connect(db_url,{dbName:"step"});
        console.log("MongoDB connected");

        app.use("/note", noteRouter); //라우터 등록
        
        app.get("/", (req, res) => {
            res.sendFile(path.join(process.cwd(), "src", "views", "index.html"));
        });

        app.use((req, res) => {
            res.status(404).send("404 Not Found");
        });

    } catch (err) {
        console.log("Server Error", err);
    }
}

server();