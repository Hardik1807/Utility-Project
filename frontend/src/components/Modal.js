import React from 'react';
import './Modal.css';

const Modal = ({ show, handleClose, handleConfirm, message }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <p>{message}</p>
                <div className="modal-buttons">
                    <button className='b' onClick={handleConfirm}>Yes</button>
                    <button className='b' onClick={handleClose}>No</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
