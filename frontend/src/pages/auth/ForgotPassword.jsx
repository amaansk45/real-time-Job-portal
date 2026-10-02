import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../../utils/validation';
import authService from '../../services/authService';
import AuthLayout from '../../components/auth/AuthLayout';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const ForgotPassword = () => {
  const [serverError, setServerError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    try {
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (err) {
      setServerError('An error occurred. Please verify your email and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your account email and we'll send a password recovery link"
    >
      {serverError && (
        <Alert
          type="error"
          message={serverError}
          className="mb-6"
          onClose={() => setServerError('')}
        />
      )}

      {isSubmitted ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Check Your Email</h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            If an account is registered with{' '}
            <span className="font-semibold text-slate-800">{getValues('email')}</span>, a secure password reset link has been dispatched.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full gradient-btn py-2.5 rounded-xl font-medium text-sm"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <InputField
            label="Account Email"
            id="email"
            type="email"
            placeholder="you@company.com"
            icon={FiMail}
            required
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Send Recovery Link
          </Button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
