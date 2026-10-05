import { incidentSchema, updateIncidentsSchema } from "../utils/validation.js";

export function validateIncident(req, res, next) {
    const result = incidentSchema.safeParse(req.body);
    if (!result.success) {
        return res
            .status(400)
            .json({ success: false, message: "invalid input" });
    }
    next();
}

export function validateUpdateIncident(req, res, next) {
    const result = updateIncidentsSchema.safeParse(req.body);
    if (!result.success) {
        return res
            .status(400)
            .json({ success: false, message: "invalid input" });
    }
    next();
}
