// src/pages/ProjectsLayout.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import AddProgress from './AddProgress';
import Achievements from './Achievements';
import Navbar from '../components/Navbar';
import ProgressNavbar from '../components/progress/ProgressNavbar';

function ProjectsLayout() {
    return (
        <>
            <ProgressNavbar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="add" element={<AddProgress />} />
                <Route path="achievements" element={<Achievements />} />
            </Routes>
        </>
    );
}

export default ProjectsLayout;
