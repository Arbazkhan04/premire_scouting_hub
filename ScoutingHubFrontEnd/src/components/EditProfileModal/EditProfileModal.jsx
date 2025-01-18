import { useState, useEffect } from "react";
import ModalComponent from "../Shared/ModalComponent";
import ModalForm from "../Shared/ModalForm";
import SettingCard from "../Shared/SettingCard";
import ProfileSection from "../Shared/ProfileSection";
import { FaUserEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { changeUsername } from '../../Api/shared/UserManagement.js';
import { setCredentials } from "../../slices/authSlice";
import { useDispatch } from "react-redux";

const EditProfileModal = () => {

    const { userInfo } = useSelector((state) => state.auth);
    
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null); // For error handling
    const [isSubmitting, setIsSubmitting] = useState(false);   

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setError(null); // Clear errors when closing the modal
        setIsOpen(false);
    };

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        setError(null);
        console.log('here')
        console.log(formData.name, userInfo.user._id);
        try {
            const res = await changeUsername(formData.name, userInfo.user._id);
            console.log(res);
            if (res && res.error) {
                setError(res.message);
                return;
            }
            dispatch(setCredentials({...userInfo, user: res.user}));
            handleClose();
        } catch (error) {
            console.log(error);
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
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
                <ModalForm
                    fields={[
                        {
                            label: "Name",
                            defaultValue: userInfo?.name || "",
                            placeholder: "Enter your name",
                        },
                    ]}
                    onClose={handleClose}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    error={error}
                />
            </ModalComponent>
        </>
    );
};

export default EditProfileModal;
