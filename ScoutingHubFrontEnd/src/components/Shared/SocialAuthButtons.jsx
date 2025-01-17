//import { FaGoogle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../slices/authSlice';
import { SERVER_URL } from '../../utils/constants';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';


const SocialAuthButtons = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const handleGoogleAuth = () => {
  //     //const googleAuthWindow = window.open(`${SERVER_URL}/auth/google`, "_blank", "width=500,height=600");

  //     const googleAuthWindow = window.open(`${SERVER_URL}/auth/google`, "_self");

  //     if (!googleAuthWindow) {
  //       console.error("Popup blocked by browser.");
  //       return;
  //     }

  //     // Listen for the message from the popup
  //     const handleMessage = (event) => {
  //       if (event.origin !== SERVER_URL) {
  //         console.warn("Message received from unknown origin:", event.origin);
  //         return;
  //       }
  //       console.log(event)
  //       const { token, user } = event.data;
  //       if (token && user) {
  //         console.log("Received data:", user, token);

  //         // Dispatch to Redux and close the popup
  //         dispatch(setCredentials({ token, user }));
  //         googleAuthWindow?.close();

  //         // Print data after it’s received
  //         console.log("Data received:", { token, user });
  //       }

  //       // Remove the event listener after receiving the message
  //       window.removeEventListener("message", handleMessage);
  //     };

  //     window.addEventListener("message", handleMessage);
  //     console.log("Event listener added");
  // };

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
        navigate('/welcome');
      }
    } catch (err) {
      console.log('Error authenticating with Google:', err);
    }
  };


  return (
    <div className="flex justify-center space-x-4 mb-4">
      {/* Google Button */}

      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg bg-gradient-to-r from-white to-gray-400 p-[2px]">
        <button
          className="w-full h-full bg-blue-900 text-white rounded-lg flex items-center justify-center hover:bg-red-600"
        //onClick={handleGoogleAuth}
        >
          <GoogleLogin
            onSuccess={handleGoogleAuth}
            onError={(error) => {
              console.log("Google sign-in failed:", error);
            }}
          />
          {/*<FaGoogle size={28} />*/}
        </button>
      </div>
    </div>
  );
};

export default SocialAuthButtons;
