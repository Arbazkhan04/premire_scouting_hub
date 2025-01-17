import { useState } from "react";
import ModalComponent from "../Shared/ModalComponent";
import ModalForm from "../Shared/ModalForm";
import SettingCard from "../Shared/SettingCard";
import ProfileSection from "../Shared/ProfileSection";
import { FaUserEdit } from "react-icons/fa";
import EditProfileData from "./EditProfileData"; // Import the fields

const EditProfileModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Profile Updated!");
        handleClose();
    };

    return (
        <>
            <SettingCard
                icon={<FaUserEdit />}
                title="Edit Profile"
                iconColor="red-400"
                onClick={handleOpen}
            />
            <ModalComponent isOpen={isOpen} onClose={handleClose}>
                <ProfileSection />
                <ModalForm fields={EditProfileData} onClose={handleClose} onSubmit={handleSubmit} />
            </ModalComponent>
        </>
    );
};

export default EditProfileModal;
