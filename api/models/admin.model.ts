import { Schema, model, Model, HydratedDocument } from 'mongoose'
import { comparePassword, hash } from '../functions/hash'
import { iUser, iUserMethods } from './user.model'
import validator from 'validator'

/**
 * an admin properies interfaces definitions
 * that inherit from user model excepts carts prop
 */
export interface iAdmin extends Omit<iUser, 'carts'> {
  permissions: string[]
  owner?: boolean
}

/**
 * a admin methods extends of user methods
 */
interface iAdminMethods extends iUserMethods {
  /**
   * checks if current user is a owner
   */
  isOwner(): Promise<Boolean>
}

interface adminModel extends Model<iAdmin, {}, iAdminMethods> {
  /**
   * find a owner from Admin collections
   */
  findOwner(): Promise<HydratedDocument<iAdmin, iAdminMethods>>
}

/**
 * an admin schema
 */
const aSchema = new Schema<iAdmin, adminModel, iAdminMethods>(
  {
    permissions: {
      type: [String],
      required: true,
      default: ['basic'],
    },
    owner: {
      type: Boolean,
      required: false,
      default: false,
    },
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: [true, 'missing username'],
      minLength: [4, 'Minimum 4 caracteres.'],
      maxLength: [16, 'Maximum 16 caracteres.'],
      validate: {
        validator: (v: string) => validator.isAlpha(v, 'fr-FR'),
        message: 'Only letter are allowed',
      },
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'invalid email address',
      },
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      validate: {
        validator: (v: string) => validator.isStrongPassword(v),
        message: 'password is not strong',
      },
    },
    birthday: {
      type: Date,
      required: [true, 'missing birthday date'],
      min: ['1900-01-01', 'invalid date'],
      max: ['2005-12-31', '18 years minimum'],
    },
    emailVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    avatar: {
      type: String,
      required: false,
      default:
        'https://img2.freepng.fr/20180331/eow/kisspng-computer-icons-user-clip-art-user-5abf13db298934.2968784715224718991702.jpg',
    },
  },
  {
    timestamps: true,
  }
)

aSchema.pre('save', async function (next: Function) {
  try {
    const user = this
    if (!user.isModified('password')) return next()
    this.password = await hash(this.password!)
    return next()
  } catch (e: unknown) {
    return next(e)
  }
})

aSchema.methods.validatePassword = async function (
  password: string
): Promise<Boolean> {
  const isValid = await comparePassword(password, this.password)
  return isValid ? true : false
}

aSchema.statics.findOwner = async function () {
  return await this.findById('637e35e0b5f9ffdf6d7ea7df')
}

aSchema.methods.isOwner = async function (): Promise<boolean> {
  return this.owner === true
}

aSchema.addListener('change', () => console.log('admin changed'))

export default model<iAdmin, adminModel>('Admin', aSchema)
