import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const useLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setSuccess(false);
      setMessage('Preencha todos os campos.');
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      setSuccess(false);
      setMessage('E-mail inválido.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      await login(formData.email, formData.password);
      setSuccess(true);
      setMessage('Login realizado com sucesso!');
      
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } catch (err) {
      setSuccess(false);
      setMessage(err.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    message,
    success,
    loading,
    handleChange,
    handleSubmit,
  };
};

export default useLogin; 