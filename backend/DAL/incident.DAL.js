import { ObjectId } from "mongodb";
import { db } from "../db/config.db.js";

const incident = db.collection("incidents");

export async function createIncident(incidentData) {
    const result = await incident.insertOne(incidentData);
    return { ...incidentData, _id: result.insertedId };
}

export async function getAllIncidents(filter = {}) {
    const result = await incident.find(filter).toArray();
    return result;
}

export async function getIncidentById(id) {
    return await incident.findOne({ _id: new ObjectId(id) });
}

export async function updateIncidents(id, data) {
    return await incident.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: "after" }
    );
}

export async function deleteIncident(id) {
    return await incident.findOneAndDelete({ _id: new ObjectId(id) });
}

