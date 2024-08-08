import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import toast from 'react-hot-toast'

const Signup = ({formData , setFormData , file , setfile}) => {
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const response = await axios.post('http://localhost:8000/user/signup', formData);
            // console.log(response)
            toast.success(response.data.message)
            navigate('/otp');
            // console.log('Response:', response.data);
            
        } catch (error) {
            console.log(error)
            console.error('Error:', error.response ? error.response.data : error.message);
        }
        // console.log(formData);
    };

    return (
        <div className="app">
            <div className="signup-form-container">
                <div className="signup-form">
                    <h2>Sign Up</h2>
                    <form className='form' onSubmit={handleSubmit}>
                        <div className="input-container">
                            <input
                                type="text"
                                name="FullName"
                                value={formData.FullName}
                                onChange={handleChange}
                                placeholder="FullName"
                                required
                            />
                            <div className="input-underline"></div>
                        </div>
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
                                type="password"
                                name="Password"
                                value={formData.Password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                            <div className="input-underline"></div>
                        </div>
                        <div className="input-container">
                            <input
                                type="text"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                placeholder="Mobile Number"
                                required
                            />
                            <div className="input-underline"></div>
                        </div>
                        <div className="input-container">
                            <input
                                type="text"
                                name="Address"
                                value={formData.Address}
                                onChange={handleChange}
                                placeholder="Address"
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
                        {formData.type === 'Tradeperson' && (
                            <>
                            <div className="input-container">
                            <input
                                type="text"
                                name="profession"
                                value={formData.profession}
                                onChange={handleChange}
                                placeholder="profession"
                                required
                                />
                            <div className="input-underline"></div>
                        </div>
                            <div className="input-container">
                                <input
                                    type="file"
                                    name="profilePhoto"
                                    onChange={(e)=>{
                                        setfile(e.target.files[0])
                                    }}
                                    accept="image/*"
                                    />
                                <div className="input-underline"></div>
                            </div>
                        </>
                        )}
                        <button type="submit">Sign Up</button>
                        <div className="signup-prompt">
                            <p>Already Have an Account? <Link to="/">Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;