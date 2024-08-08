import React from 'react';
import axios from 'axios'; 
import './OTPPage.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'

const OTPPage = ({ formData, setFormData, file, setfile }) => {
    const navigate = useNavigate();
    const form = new FormData()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData()
            form.append('file', file)
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    form.append(key, formData[key]);
                }
            });

            // console.log(form)
            const response = await axios.post('http://localhost:8000/user/finalregister', form);
            toast.success(response.data.message)
            navigate('/');

        } 
        catch (error) 
        {
            if (error.response.data.message === "Invalid OTP") {
                toast.error("Invalid OTP")
            }
        }

        // console.log('OTP submitted:', formData.OTP);
    };

    return (
        <div className="otp-container">
            <div className="otp-form-container">
                <h2>Enter otp</h2>
                <form className="otp-form" onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input
                            type="text"
                            name="OTP"
                            value={formData.OTP}
                            onChange={handleChange}
                            placeholder="Enter OTP sent on your mail"
                            required
                        />
                        <div className="input-underline"></div>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default OTPPage;
