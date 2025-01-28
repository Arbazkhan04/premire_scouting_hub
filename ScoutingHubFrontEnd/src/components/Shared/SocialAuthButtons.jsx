//import { FaGoogle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../slices/authSlice';
import { SERVER_URL } from '../../utils/constants';
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';


const SocialAuthButtons = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleAuth = async (credentialResponse) => {
    console.log('here');
    const { credential } = credentialResponse;
    console.log("Google sign-in response:", credential);

    try {
      const res = await fetch(`${SERVER_URL}/auth/google`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential }),
      });
      const data = await res.json();
      console.log(data);
      if (data.userInfo) {
        dispatch(setCredentials(data.userInfo));
        navigate('/dashboard');
      }
    } catch (err) {
      console.log('Error authenticating with Google:', err);
    }
  };


  return (
    <div className="flex justify-center space-x-4 mb-4">
      <div className="w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center">
        <GoogleLogin
          onSuccess={handleGoogleAuth}
          onError={(error) => {
            console.log("Google sign-in failed:", error);
          }}
        />
      </div>
    </div>
  );
};

export default SocialAuthButtons;
