import express from "express"
import connectDB from "./configs/db"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static('../dist/public/index.html'))

connectDB()
.then(()=>{
    app.listen()
})
