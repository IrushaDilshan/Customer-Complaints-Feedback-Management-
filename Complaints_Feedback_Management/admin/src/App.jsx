import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import ComplaintsList from "./pages/ComplaintsList";
import ComplaintDetails from "./pages/ComplaintDetails";
import Analytics from "./pages/Analytics";

import Feedback from "./pages/Feedback";


export default function App() {
  return (
    <>
      <nav className="w-full py-3 px-4 bg-white shadow flex gap-4">
        <Link to="/admin/complaints" className="hover:underline">Complaints</Link>
        <Link to="/admin/feedback" className="hover:underline">Feedback</Link>
        <Link to="/admin/analytics" className="hover:underline">Analytics</Link>

      </nav>
      <Routes>
        <Route path="/admin/complaints" element={<ComplaintsList />} />
        <Route path="/admin/complaints/:ref" element={<ComplaintDetails />} />
        <Route path="/admin/feedback" element={<Feedback />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/admin/complaints" replace />} />
      </Routes>
    </>
  );
}
