import { Request, Response} from "express";
import { BAD_REQUEST, INTERNAL, NOT_FOUND, SUCCESS, UNAUTHORIZED } from "../configs/defs";
import { accessToken, decode, encode } from "../functions/sign";
import Admin, { iAdmin } from "../models/admin.model"

/** A controller for admin api */
class AdminController{

    /**
     * Adds an admin information to database
     * @params {Request} req - the request handler
     * @params {Response} res - the response handler
     */
    static async addAdmin(req: Request, res: Response): Promise<void>{
        const data: iAdmin = req.body
        if (!data) res.status(401).json(UNAUTHORIZED)
        try{
            const user = new Admin(data)
            console.log(user)
            await user.save()
            res.status(200).json(SUCCESS)
        } catch (e: unknown){
            res.status(200).json({ 
                status: false,
                message: e instanceof Error ? e.message : String(e)
            })
        }
    }
    /**
     * Retrieves an admin information
     * @params {Request} req - the request handler
     * @params {Response} res - the response handler
     */
    static async getAdmin(req: Request, res: Response): Promise<void>{
        const id = req.params.id
        const auth = req.headers.authorization

        if (!id || !auth || !decode(auth)){ // invalid paramss of invalid token
            res.status(401).json(UNAUTHORIZED)
            return
        }

        const admin = await Admin.findById(id).select('-password')
        console.log(admin)
        if (!admin) {
            res.status(404).json(NOT_FOUND)
            return
        }

        res.status(200).json({
            ...SUCCESS,
            message: encode({...admin.toObject()}),
            access_token: accessToken()
        })
    }


    /**
     * Authenticates an admin
     * @params {Request} req - the request handler
     * @params {Response} res - the response handler
     */
    static async loginAdmin(req: Request, res: Response): Promise<void>{
        const adminname = req.params.adminname
        const password = req.params.password
        const admin = await Admin.findOne({ adminname: adminname})

        if (!admin?.validatePassword(password)){ // invalid params or invalid token
            res.status(401).json({
                ...UNAUTHORIZED,
                message: 'Bad credentials'
            })
            return
        }

        res.status(200).json({
            ...SUCCESS,
            message: encode({...admin.toObject()}),
            access_token: accessToken()
        })
    }


    /**
     * Updates an admin informations
     * @params {Request} req - the request handler
     * @params {Response} res - the response handler
     */
    static async updateAdmin(req: Request, res: Response): Promise<void>{

        const data = req.body
        const id: string = req.params.id
        const payload = req.headers.authorization
        
        if (!id || !data || !payload || !decode(payload)){
            res.status(401).json(UNAUTHORIZED)
            return
        }
        try{
            const admin = await Admin.findById(id)
            if (!admin) throw new Error('admin not found' )
            console.log(data)
            if (await admin.validatePassword(data.cpassword || '')){ //confirm admin identity
                if (data.password){
                    admin.password = data.password
                    await admin.save()
                }
                await admin.updateOne({...data, password: undefined})
                // await admin.save()
                res.json({
                    ...SUCCESS,
                    access_token: accessToken()
                })
            } else throw new Error('password is invalid')
        } catch (e){
            console.log(e)
            res.json({
                status: false,
                message: e instanceof Error ? e.message : String(e)
            })
        }
    }
    /**
     * Deletes an admin from database
     * @params {Request} req - the request handler
     * @params {Response} res - the response handler
     */
    static async deleteAdmin(req: Request, res: Response): Promise<void>{
        const id = req.params.id
        const authorization = req.headers.authorization
        if (!id || !authorization || !decode(authorization)){
            res.status(400).json(BAD_REQUEST)
            return
        }
        const decoded = decode(authorization)
        const ownerId = (await Admin.findOwner())._id.toHexString()

        console.log(decoded, ownerId)
        if (ownerId !== decoded || ownerId === id) {
            res.status(401).json(UNAUTHORIZED)
            return
        }
        try{
            await Admin.findByIdAndDelete(id)
            res.status(200).json(SUCCESS)
        } catch (e){
            res.status(500).json(INTERNAL)
        }
    }
}

export default AdminController