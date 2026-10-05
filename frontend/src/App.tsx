import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { MapPage } from "./pages/Map";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "leaflet/dist/leaflet.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MapPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
