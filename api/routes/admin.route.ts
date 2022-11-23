import { Router, Request, Response } from "express";
import AdminController from "../controllers/admin.controller";

const router = Router()

router.post('/add', AdminController.addAdmin)
router.get('/:id', AdminController.getAdmin)
router.post('/login', AdminController.loginAdmin)
router.put('/update/:id', AdminController.updateAdmin)
router.delete('/:id', AdminController.deleteAdmin)

export default router