import { useState } from "react";
import ModalComponent from "../Shared/ModalComponent";
import ModalForm from "../Shared/ModalForm";
import SettingCard from "../Shared/SettingCard";
import { FaLock } from "react-icons/fa";
import ChangePasswordData from "../ChagePasswordModal/ChangePasswordData"; // Import the fields with a lowercase name

const ChangePasswordModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        console.log("Opening Change Password Modal"); // Debug log
        setIsOpen(true);
    };

    const handleClose = () => {
        console.log("Closing Change Password Modal"); // Debug log
        setIsOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Password Updated!"); // Debug log
        handleClose();
    };

    return (
        <>
            {/* Setting Card for Change Password */}
            <SettingCard
                icon={<FaLock />}
                title="Change Password"
                iconColor="purple-400"
                onClick={handleOpen}
            />

            {/* Modal Component */}
            <ModalComponent isOpen={isOpen} onClose={handleClose}>
                {/* Change Password Form */}
                <ModalForm fields={ChangePasswordData} onClose={handleClose} onSubmit={handleSubmit} />
            </ModalComponent>
        </>
    );
};

export default ChangePasswordModal;
