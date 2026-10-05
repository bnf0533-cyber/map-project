import {
    createIncident,
    deleteIncident,
    getAllIncidents,
    getIncidentById,
    updateIncidents,
} from "../DAL/incident.DAL.js";

export async function createIncidentController(req, res) {
    try {
        const { location, category, description, title } = req.body;
        const newIncident = {
            title,
            description,
            category,
            status: "open",
            location,
            createdBy: req.user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await createIncident(newIncident);
        req.app.get("io").emit("incident:created", result);
        return res.status(201).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export async function getAllIncidentsController(req, res) {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const incidents = await getAllIncidents(filter);
        res.status(200).json({ success: true, data: incidents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export async function getIncidentByIdController(req, res) {
    try {
        const { id } = req.params;
        if (!id)
            return res
                .status(400)
                .json({ success: false, message: "bad request" });
        const result = await getIncidentById(id);
        if (!result) {
            return res
                .status(404)
                .json({ success: false, message: "Incident not found" });
        }
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export async function updateIncidentsController(req, res) {
    try {
        const checkOwner = await getIncidentById(req.params.id);
        if (!checkOwner) {
            return res
                .status(404)
                .json({ success: false, message: "Incident not found" });
        }
        if (checkOwner.createdBy !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Not your incident",
            });
        }
        const result = await updateIncidents(req.params.id, {
            ...req.body,
            updatedAt: new Date(),
        });
        res.app.get("io").emit("incident:updated", result);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export async function deleteIncidentController(req, res) {
    try {
        const checkOwner = await getIncidentById(req.params.id);
        if (!checkOwner) {
            return res
                .status(404)
                .json({ success: false, message: "Incident not found" });
        }
        if (checkOwner.createdBy !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Not your incident",
            });
        }
        const result = await deleteIncident(req.params.id);
        res.app.get("io").emit("incident:deleted", { id: req.params.id });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
