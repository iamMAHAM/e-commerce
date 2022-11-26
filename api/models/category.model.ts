import { Schema, model, Model } from 'mongoose'

interface iCategory {
  name: string
  logo: string
}

const cSchema = new Schema<iCategory>({
  name: {
    type: String,
    required: [true, 'missing category name'],
    unique: true,
  },
  logo: {
    type: String,
    required: true,
  },
})

export default model('Category', cSchema)
