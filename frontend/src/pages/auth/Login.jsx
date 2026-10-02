import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    try {
      const res = await login(data.email, data.password);
      const user = res.user;

      // Smart redirect based on role or intended destination
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error' || !err.response) {
        setServerError('Cannot connect to backend server. Please verify backend is running on http://127.0.0.1:8000');
      } else {
        const errorMsg =
          err.response?.data?.detail ||
          err.response?.data?.error ||
          'Invalid credentials. Please verify your email and password.';
        setServerError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your JobConnect account to manage applications or candidates"
    >
      {serverError && (
        <Alert
          type="error"
          message={serverError}
          className="mb-6"
          onClose={() => setServerError('')}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          label="Email Address"
          id="email"
          type="email"
          placeholder="you@company.com"
          icon={FiMail}
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <InputField
          label="Password"
          id="password"
          type="password"
          placeholder="••••••••"
          icon={FiLock}
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              {...register('rememberMe')}
            />
            <span className="text-slate-600 text-xs sm:text-sm">Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
          icon={FiArrowRight}
          iconPosition="right"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-600">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
