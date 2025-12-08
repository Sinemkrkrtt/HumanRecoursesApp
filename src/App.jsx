import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DrawerComponent from './DrawerComponent';

// Örnek sayfalar
import Home from './Home';
import Employees from './Employees';
import Departments from './Departments';
import Permissions from './Permissions';
import Attendances from './Attendances';
import Payrolls from './Payrolls';
import Documents from './Documents';
import Announcements from './Announcements';
import Settings from './Settings';
import Login from './login';

function App() {
  return (
    <div>
      <DrawerComponent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/permissions" element={<Permissions />} />
        <Route path="/attendances" element={<Attendances />} />
        <Route path="/payrolls" element={<Payrolls />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
