import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@layouts/AuthLayout';
import LoginForm from '@components/forms/LoginForm';
import useAuth from '@hooks/useAuth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout>
      <LoginForm onSuccess={() => navigate('/dashboard')} />
    </AuthLayout>
  );
};

export default LoginPage;

