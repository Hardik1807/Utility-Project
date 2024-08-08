import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Modal from './Modal';
import RatingModal from './RatingModal';
import './YourComplaint.css';
import toast from 'react-hot-toast';

function YourComplaint() {
    const [complaints, setComplaints] = useState([]);
    const [userType, setUserType] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedComplaintId, setSelectedComplaintId] = useState(null);

    const fetchComplaints = async () => {
        try {
            const response = await axios.get('http://localhost:8000/complaint/getcomplaint', { withCredentials: true });
            console.log(response);
            setComplaints(response.data[0]);
            setUserType(response.data[1]);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleAction = async (id, action) => {
        try {
            console.log("bye");
            const response = await axios.post(`http://localhost:8000/complaint/${action}`, { id }, { withCredentials: true });
            toast.success(response.data.message);
            fetchComplaints();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleNA = async (id) => {
        try {
            console.log("Hi");
            const response = await axios.post(`http://localhost:8000/complaint/resident/not_arrived`, { id }, { withCredentials: true });
            console.log(response);
            toast.success(response.data.message);
            fetchComplaints();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const openModal = (id) => {
        setSelectedComplaintId(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedComplaintId(null);
    };

    const openRatingModal = (id) => {
        setSelectedComplaintId(id);
        setShowRatingModal(true);
    };

    const closeRatingModal = () => {
        setShowRatingModal(false);
        setSelectedComplaintId(null);
    };

    const confirmNotArrived = () => {
        if (selectedComplaintId) {
            handleNA(selectedComplaintId);
            closeModal();
        }
    };

    const submitRating = async (rating) => {
        if (selectedComplaintId) {
            try {
                const response = await axios.post(`http://localhost:8000/complaint/resident/work_complete`, { id: selectedComplaintId, rating }, { withCredentials: true });
                toast.success(response.data.message);
                fetchComplaints();
            } catch (error) {
                toast.error(error.response.data.message);
            }
            closeRatingModal();
        }
    };

    return (
        <>
            <Navbar />
            <div className="complaints-container">
                <h2>Your Complaints</h2>
                {complaints.length > 0 ? (
                    complaints.map(complaint => (
                        <div key={complaint._id} className="complaint-card">
                            <h3>Complaint ID: {complaint._id}</h3>
                            <p>Resident: {complaint.resident.FullName}</p>
                            <p>Tradeperson: {complaint.tradeperson.FullName}</p>
                            <p>Preferred Time: {complaint.preferredTime}</p>
                            <p>Description: {complaint.description}</p>
                            <div className="complaint-actions">
                                {userType === 'Resident' ? (
                                    <>
                                        <button className='b' onClick={() => openRatingModal(complaint._id)}>Work Completed</button>
                                        <button className='b' onClick={() => handleAction(complaint._id, 'revoke')}>Revoke</button>
                                        <button className='b' onClick={() => openModal(complaint._id)}>Not Arrived</button>
                                    </>
                                ) : complaint.isAccepted === false ? (
                                    <>
                                        <button className='b' onClick={() => handleAction(complaint._id, 'accept')}>Accept</button>
                                        <button className='b' onClick={() => handleAction(complaint._id, 'deny')}>Decline</button>
                                    </>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='nocomplaint'>No complaints available</p>
                )}
            </div>
            <Modal
                show={showModal}
                handleClose={closeModal}
                handleConfirm={confirmNotArrived}
                message="It is advised to wait for some time (20-30 minutes). Do you still want to complain?"
            />
            <RatingModal
                show={showRatingModal}
                handleClose={closeRatingModal}
                handleConfirm={submitRating}
            />
        </>
    );
}

export default YourComplaint;
