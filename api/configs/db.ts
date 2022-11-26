import { config } from 'dotenv'
import { connect } from 'mongoose'
config()

const connectDB = (): Promise<Boolean> => {
  const MONGO = process.env.STRING_URI
  if (!MONGO) throw new Error('env STRING_URI is required.')
  return new Promise((resolve, reject) => {
    connect(MONGO, (err) => {
      err ? reject(err?.message) : ''
      console.log('Mongo connected')
      resolve(true)
    })
  })
}
export default connectDB
