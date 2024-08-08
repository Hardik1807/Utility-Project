import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './NewComplaint.css';
import axios from 'axios';
import img from './download.jpeg';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const availableTimes = Array.from({ length: 9 }, (_, i) => `${i + 9}-${i + 10}`);

function NewComplaint() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        profession: '',
        preferredTime: '',
        professional: '',
        description: '',
    });

    const [profession, setProfession] = useState([]);
    const [professionals, setProfessionals] = useState([]);

    const loadProfessionals = async () => {
        try {
            const response = await axios.get('http://localhost:8000/data/getprofessional');
            setProfession(response.data[0]);
            setProfessionals(response.data[1]);
        } catch (error) {
            console.error('Error fetching professionals:', error);
        }
    };

    useEffect(() => {
        loadProfessionals();
    }, []);

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
            const response = await axios.post('http://localhost:8000/complaint/registercomplaint', formData, { withCredentials: true });
            toast.success(response.data.message);
            navigate("/yourcomplaint");
        } catch (error) {
            console.error('Error submitting complaint:', error);
            toast.error(error.response.data.message);
        }

        setFormData({
            profession: '',
            preferredTime: '',
            professional: '',
            description: '',
        });
    };

    const filteredProfessionals = professionals.filter((p) =>
        p.profession.toLowerCase() === formData.profession.toLowerCase() &&
        p.availability[formData.preferredTime] === 0
    );

    const getFilteredTimes = () => {
        // const currentHour = new Date().getHours();
        const currentHour = 12
        if (currentHour >= 18) {
            return availableTimes;
        } else {
            return availableTimes.filter(time => parseInt(time.split('-')[0]) > currentHour);
        }
    };

    return (
        <>
            <Navbar />
            <div className="app">
                <div className="apt-form-container">
                    <div className="apt-form">
                        <h2>Book Appointment</h2>
                        <form className='form' onSubmit={handleSubmit}>
                            <div className="new-input-container">
                                <select
                                    name="profession"
                                    value={formData.profession}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Profession</option>
                                    {profession.map(p => (
                                        <option key={p.profession} value={p.profession}>{p.profession}</option>
                                    ))}
                                </select>
                                <div className="input-underline"></div>
                            </div>
                            <div className="new-input-container">
                                <select
                                    name="preferredTime"
                                    value={formData.preferredTime}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Preferred Time</option>
                                    {getFilteredTimes().map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                                <div className="input-underline"></div>
                            </div>
                            <div className="new-input-container">
                                <select
                                    name="professional"
                                    value={formData.professional}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Professional</option>
                                    {filteredProfessionals.length > 0 ? (
                                        filteredProfessionals.map(p => (
                                            <option key={p._id} value={p._id}>
                                                {`${p.FullName}`} &nbsp; &nbsp; &nbsp; {`(Rating: ${p.rating} star )`}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>No one is available at your preferred time</option>
                                    )}
                                </select>
                                <div className="input-underline"></div>
                            </div>
                            <div className="new-input-container">
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your problem"
                                    required
                                ></textarea>
                                <div className="input-underline"></div>
                            </div>
                            <button type="submit">Submit Appointment</button>
                        </form>
                    </div>
                </div>
                <img src={img} alt="" />
            </div>
        </>
    );
}

export default NewComplaint;
