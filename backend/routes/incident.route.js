import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    validateIncident,
    validateUpdateIncident,
} from "../middleware/validateIncident.middleware.js";
import {
    createIncidentController,
    deleteIncidentController,
    getAllIncidentsController,
    getIncidentByIdController,
    updateIncidentsController,
} from "../controller/incident.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateIncident, createIncidentController);
router.get("/", getAllIncidentsController);
router.get("/:id", getIncidentByIdController);
router.patch("/:id", validateUpdateIncident, updateIncidentsController);
router.delete("/:id", deleteIncidentController);

export default router;
