import api from '../api';

export const changeUsername = async (name, userId) => {
    try {
        const res = await api.post('/auth/updateUsername', { name: name, userId: userId});
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const changePassword = async (userId, currentPassword, newPassword) => {
    console.log(userId, currentPassword, newPassword);
    try {
        const res = await api.post('/auth/changePassword', { userId: userId, currentPassword: currentPassword, newPassword: newPassword });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}


export const updateProfilePicture = async (userId, profilePicture) => {
    try {
        const res = await api.post('/auth/updateProfilePicture', { userId: userId, profilePicture: profilePicture });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}
