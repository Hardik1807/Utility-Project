import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/signup';
import Login from './components/Login';
import OTP from './components/OTPPage';
import NewComplaint from './components/NewComplaint'
import YourComplaint from './components/YourComplaint'

import './App.css';

const App = () => {
  const [file, setfile] = useState(false);
  const [formData, setFormData] = useState({
    FullName: '',
    email: '',
    Password: '',
    mobileNumber: '',
    Address: '',
    type: '',
    profession:'',
    profilePhoto: null,
    OTP : 0
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={<Signup formData={formData} setFormData={setFormData} file ={file}  setfile = {setfile} />}
        />
        <Route path="/" element={<Login />} />
        <Route path="/newcomplaint" element={<NewComplaint />} />
        <Route path="/yourcomplaint" element={<YourComplaint/>} />


        <Route path="/otp" element={<OTP  formData={formData} setFormData={setFormData} file ={file}  setfile = {setfile}/>} />
      </Routes>
    </Router>
  );
};

export default App;
