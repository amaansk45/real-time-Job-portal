import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '../../utils/validation';
import authService from '../../services/authService';
import AuthLayout from '../../components/auth/AuthLayout';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { FiLock, FiCheckCircle } from 'react-icons/fi';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const uidb64 = searchParams.get('uid') || searchParams.get('uidb64') || '';
  const token = searchParams.get('token') || '';

  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (data) => {
    if (!uidb64 || !token) {
      setServerError('Invalid or missing password reset token in URL.');
      return;
    }

    setIsLoading(true);
    setServerError('');
    try {
      await authService.resetPassword(
        uidb64,
        token,
        data.new_password,
        data.confirm_password
      );
      setIsSuccess(true);
    } catch (err) {
      const errorMsg =
        err.response?.data?.token?.[0] ||
        err.response?.data?.detail ||
        'Password reset link is invalid or has expired. Please request a new one.';
      setServerError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!uidb64 || !token) {
    return (
      <AuthLayout
        title="Invalid Reset Link"
        subtitle="This password reset link is invalid or incomplete."
      >
        <Alert
          type="error"
          title="Missing Token Parameters"
          message="Please ensure you clicked the complete link provided in your email."
          className="mb-6"
        />
        <div className="text-center">
          <Link
            to="/forgot-password"
            className="gradient-btn inline-block px-6 py-2.5 rounded-xl text-sm font-medium"
          >
            Request a New Reset Link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create new password"
      subtitle="Your new password must be at least 8 characters long with uppercase, lowercase, and numbers."
    >
      {serverError && (
        <Alert
          type="error"
          message={serverError}
          className="mb-6"
          onClose={() => setServerError('')}
        />
      )}

      {isSuccess ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Password Reset Successful</h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Your account password has been updated securely. You can now log in with your new credentials.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Go to Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <InputField
            label="New Password"
            id="new_password"
            type="password"
            placeholder="Min. 8 characters"
            icon={FiLock}
            required
            error={errors.new_password?.message}
            {...register('new_password')}
          />

          <InputField
            label="Confirm New Password"
            id="confirm_password"
            type="password"
            placeholder="Re-enter password"
            icon={FiLock}
            required
            error={errors.confirm_password?.message}
            {...register('confirm_password')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Update Password
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
