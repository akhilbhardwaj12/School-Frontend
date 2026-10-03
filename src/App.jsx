import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Attendance from "./pages/Attendance";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* Students */}
                <Route
                    path="/students"
                    element={<Students />}
                />

                {/* Teachers */}
                <Route
                    path="/teachers"
                    element={<Teachers />}
                />

                {/* Classes */}
                <Route
                    path="/classes"
                    element={<Classes />}
                />

                {/* Attendance */}
                <Route
                    path="/attendance"
                    element={<Attendance />}
                />

                {/* Default */}
                <Route
                    path="*"
                    element={<Dashboard />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;