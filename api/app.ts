import express from "express"
import connectDB from "./configs/db"

const app = express()
const PORT: number = Number(process.env.PORT) || 3000


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static('../dist/public/index.html'))


connectDB()
.then(()=>{
    app.listen(PORT, () => console.log('server started at port ', PORT))
})
.catch((e: Error) => console.log(e.message))
