import { Request, Response } from 'express'
import {
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL,
  SUCCESS,
  BAD_REQUEST,
} from '../configs/defs'
import User, { iUser } from '../models/user.model'
import { encode, decode, accessToken } from '../functions/sign'

/**
 * a user controller class for application
 */
class UserController {
  static async addUser(req: Request, res: Response) {
    const data: iUser = req.body
    if (!data) res.status(401).json(UNAUTHORIZED)
    try {
      const user = new User(data)
      await user.save()
      res.status(200).json({
        ...SUCCESS,
        message: 'confirm your email address',
      })
    } catch (e: unknown) {
      res.status(200).json({
        status: false,
        message: e instanceof Error ? e.message : String(e),
      })
    }
  }

  static async getUser(req: Request, res: Response) {
    const id = req.params.id
    const payload = req.headers.authorization
    if (!payload || !decode(payload) || !id) {
      res.status(401).json(UNAUTHORIZED)
      return
    }
    const user = await User.findById(id)
    if (!user) res.status(401).json(NOT_FOUND)
    res.status(200).json({
      status: true,
      message: encode({
        ...user?.toObject(),
        password: undefined,
      }),
      access_token: accessToken(),
    })
  }

  static async loginUser(req: Request, res: Response) {
    const data = req.body
    const user = await User.findOne({ email: data.email })
    const isAuth = await user?.validatePassword(data.password)

    if (!user || !isAuth || !user.emailVerified) {
      res.status(401).json({
        status: false,
        message: 'Bad Credentials',
      })
      return
    }
    if (isAuth)
      res.status(200).json({
        status: true,
        message: encode({
          ...user.toObject(),
          password: undefined,
        }),
        access_token: accessToken(),
      })
  }

  static async updateUser(req: Request, res: Response) {
    const data = req.body
    const id: string = req.params.id
    const payload = req.headers.authorization

    if (!id || !data || !payload || !decode(payload)) {
      res.status(401).json(UNAUTHORIZED)
      return
    }
    try {
      const user = await User.findById(id)
      if (!user) throw new Error('user not found')
      console.log(data)
      if (await user.validatePassword(data.cpassword || '')) {
        //confirm user identity
        if (data.password) {
          user.password = data.password
          await user.save()
        }
        await user.updateOne({ ...data, password: undefined })
        // await user.save()
        res.json({
          ...SUCCESS,
          access_token: accessToken(),
        })
      } else throw new Error('password is invalid')
    } catch (e) {
      console.log(e)
      res.json({
        status: false,
        message: e instanceof Error ? e.message : String(e),
      })
    }
  }

  static async deleteUser(req: Request, res: Response) {
    const id = req.params.id
    const authorization = req.headers.authorization
    if (!id || !authorization || !decode(authorization)) {
      res.status(400).json(BAD_REQUEST)
      return
    }
    try {
      await User.findByIdAndDelete(id)
      res.status(200).json(SUCCESS)
    } catch (e) {
      res.status(500).json(INTERNAL)
    }
  }
}

export default UserController
