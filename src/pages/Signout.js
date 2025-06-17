// src/components/Signout.js
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Signout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Firebase logout
      localStorage.removeItem('authToken'); // clear any stored tokens
      localStorage.removeItem('userEmail');
      navigate('/login');
    } catch (err) {
      console.error('Signout failed:', err);
    }
  };

  return handleLogout(); // Trigger immediately
};

export default Signout;
