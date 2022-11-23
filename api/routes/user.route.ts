import { Router } from "express";
import UserController from "../controllers/user.controller";

const router = Router()

router.post('/add', UserController.addUser)
router.post('/login', UserController.loginUser)
router.get('/:id', UserController.getUser)
router.put('/update/:id', UserController.updateUser)
router.delete('/:id', UserController.deleteUser)

export default router