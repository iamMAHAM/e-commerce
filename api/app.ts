import express from "express"
import connectDB from "./configs/db"
import userRoutes from "./routes/user.route"
import adminRoutes from "./routes/admin.route"
import v1Routes from "./routes/v1.route"


const app = express()
const PORT: number = Number(process.env.PORT) || 4000


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static('../dist/public/index.html'))

app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/v1', v1Routes)

connectDB()
.then(()=>{
    app.listen(PORT, () => console.log('server started at port ', PORT))
})
.catch((e: Error) => console.log(e.message))
