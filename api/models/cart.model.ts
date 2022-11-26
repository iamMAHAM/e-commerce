import { model, Schema } from 'mongoose'

interface ICart {
  items: object[],
  bill: number,
  userId: Schema.Types.ObjectId
}

const CartSchema = new Schema<ICart>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity can not be less then 1.'],
        default: 1,
      },
      price: Number,
    },
  ],
  bill: {
    type: Number,
    required: true,
    default: 0,
  },
})

export default model('Cart', CartSchema)
