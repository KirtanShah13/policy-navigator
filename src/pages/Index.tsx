import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('policyrag_user');
    if (storedUser) {
      navigate('/chat');
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  return null;
};

export default Index;
