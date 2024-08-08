import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
// import Navbar from './Navbar'

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        Password: '',
        type:''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/user/login', formData,{ withCredentials: true });
            toast.success(response.data.message)
            navigate('/newcomplaint');
        } catch (error) {
            // console.log(error)
            toast.error(error.response.data.message)
        }

    };

    return (
        <>
        {/* <Navbar/> */}
        <div className="app">
            <div className="signup-form-container">
                <div className="signup-form">
                    <h2>Login</h2>
                    <form className='form' onSubmit={handleSubmit}>
                        <div className="input-container">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                                />
                            <div className="input-underline"></div>
                        </div>
                        <div className="input-container">
                            <input
                                type="Password"
                                name="Password"
                                value={formData.Password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                />
                            <div className="input-underline"></div>
                        </div>
                        <div className="input-container">
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                >
                                <option value="">Select Type</option>
                                <option value="Tradeperson">Professional</option>
                                <option value="Resident">Resident</option>
                            </select>
                            <div className="input-underline"></div>
                        </div>
                        <button type="submit">Login</button>
                        <div className="signup-prompt">
                            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
    );
};

export default Signup;
