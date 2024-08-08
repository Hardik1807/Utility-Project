import React, { useState } from 'react';
import './RatingModal.css';

const RatingModal = ({ show, handleClose, handleConfirm }) => {
    const [rating, setRating] = useState(0);

    if (!show) {
        return null;
    }

    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    const handleSubmit = () => {
        handleConfirm(rating);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <p>Please rate the work out of 5:</p>
                <div className="rating-input">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <label key={value}>
                            <input
                                type="radio"
                                value={value}
                                checked={rating == value}
                                onChange={handleRatingChange}
                            />
                            {value}
                        </label>
                    ))}
                </div>
                <div className="modal-buttons">
                    <button className='b' onClick={handleSubmit}>Submit</button>
                    <button className='b' onClick={handleClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;
