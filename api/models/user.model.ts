import { Schema, model } from "mongoose";
import validator from "validator";

const uSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: [true, 'Username already taken !']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        validate: {
            validator: (v: string) => validator.isEmail(v),
            message: 'invalid email address'
        }
    },
    password: {
        type: String
    }
})
