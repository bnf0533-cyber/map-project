import { useEffect, useState } from "react";
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMapEvents,
} from "react-leaflet";
import { useAuthStore } from "../store/authStore";
import { io } from "socket.io-client";
import {
    createIncidentApi,
    deleteIncidentApi,
    getIncidentsApi,
    updateIncidentApi,
    type Incident,
} from "../services/api";

function MapClickHandler({
    onSelect,
}: {
    onSelect: (lat: number, lng: number) => void;
}) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export function MapPage() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("fire");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        getIncidentsApi(selectedCategory).then((res) => {
            if (res.success && res.data) setIncidents(res.data);
        });
    }, [selectedCategory]);

    useEffect(() => {
        const socket = io(
            import.meta.env.VITE_API_URL || "http://localhost:3001"
        );

        socket.on("incident:created", (newInc: Incident) => {
            setIncidents((prev) => [
                ...prev.filter((i) => i._id !== newInc._id),
                newInc,
            ]);
        });

        socket.on("incident:updated", (updatedInc: Incident) => {
            setIncidents((prev) =>
                prev.map((i) => (i._id === updatedInc._id ? updatedInc : i))
            );
        });

        socket.on("incident:deleted", ({ id }: { id: string }) => {
            setIncidents((prev) => prev.filter((i) => i._id !== id));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLocation) return;
        await createIncidentApi({
            title,
            description,
            category,
            location: selectedLocation,
        });
        setTitle("");
        setDescription("");
        setCategory("fire");
        setSelectedLocation(null);
    };

    const handleStatusChange = async (id: string, status: string) => {
        await updateIncidentApi(id, { status });
    };

    const handleDelete = async (id: string) => {
        await deleteIncidentApi(id);
    };

    return (
        <div>
            <header>
                <h2>Incident Map</h2>
                <button onClick={logout}>Logout</button>
                <div>
                    <label>Filter by category: </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="fire">Fire</option>
                        <option value="flood">Flood</option>
                        <option value="accident">Accident</option>
                        <option value="medical">Medical</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </header>

            {selectedLocation && (
                <form onSubmit={handleCreate}>
                    <h3>Report Incident</h3>
                    <div>
                        <label>Title: </label>
                        <input
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Description: </label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Category: </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="fire">Fire</option>
                            <option value="flood">Flood</option>
                            <option value="accident">Accident</option>
                            <option value="medical">Medical</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <button type="submit">Create</button>
                    <button
                        type="button"
                        onClick={() => setSelectedLocation(null)}
                    >
                        Cancel
                    </button>
                </form>
            )}

            <MapContainer
                center={[32.0853, 34.7818]}
                zoom={8}
                style={{ height: "80vh", width: "100%" }}
            >
                <MapClickHandler
                    onSelect={(lat, lng) => setSelectedLocation({ lat, lng })}
                />
                {incidents.map((inc) => {
                    const isOwner =
                        user &&
                        (user.id === inc.createdBy ||
                            (user as any)._id === inc.createdBy ||
                            user.role === "admin");

                    return (
                        <Marker
                            key={inc._id}
                            position={[inc.location.lat, inc.location.lng]}
                        >
                            <Popup>
                                <h3>{inc.title}</h3>
                                <p>{inc.description}</p>
                                <p>Category: {inc.category}</p>

                                {isOwner ? (
                                    <div>
                                        <label>Status: </label>
                                        <select
                                            value={inc.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    inc._id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="open">Open</option>
                                            <option value="in_progress">
                                                In Progress
                                            </option>
                                            <option value="closed">
                                                Closed
                                            </option>
                                        </select>
                                        <button
                                            onClick={() =>
                                                handleDelete(inc._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ) : (
                                    <p>Status: {inc.status}</p>
                                )}
                            </Popup>
                        </Marker>
                    );
                })}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    );
}
