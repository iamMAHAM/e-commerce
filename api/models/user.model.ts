import { Schema, model, Date } from "mongoose";
import validator from "validator";
import { comparePassword, hash } from "../functions/hash";

export interface iUser {
    fullname: string,
    username: string,
    email: string,
    password: string,
    birthday: Date,
    avatar: string,
    emailVerified? : boolean,
    carts?: object[]
}

interface iUserMethods {
    validatePassword(password: string): Promise<Boolean>
}

const uSchema = new Schema<iUser, {}, iUserMethods>({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'missing username'],
        minLength: [4, 'Minimum 4 caracteres.'],
        maxLength: [16, 'Maximum 16 caracteres.'],
        validate: {
            validator: (v: string) => validator.isAlpha(v, 'fr-FR'),
            message: 'Only letter are allowed'
        }
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        trim: true,
        validate: {
            validator: (v: string) => validator.isEmail(v),
            message: 'invalid email address'
        }
    },
    password: {
        type: String,
        require: [true, 'password is required'],
        validate: {
            validator: (v: string) => validator.isStrongPassword(v),
            message: 'password is not strong'
        }
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
        default: 'https://img2.freepng.fr/20180331/eow/kisspng-computer-icons-user-clip-art-user-5abf13db298934.2968784715224718991702.jpg' 
    },
    carts: {
        type: [Object],
        require: false,
    }
}, {
    timestamps: true
})

uSchema.pre('save', async function (next: Function){
    try{
        const user = this
        if (!user.isModified('password')) return next()
        this.password = await hash(this.password!)
        return next()
    } catch(e: unknown){
        return next(e)
    }
})

uSchema.methods.validatePassword = async function (password: string): Promise<Boolean>{
    const isValid = await comparePassword(password, this.password)
    return isValid
        ? true
        : false
}

export default model('User', uSchema)