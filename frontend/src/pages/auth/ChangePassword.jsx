import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '../../utils/validation';
import authService from '../../services/authService';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { FiLock, FiCheckCircle } from 'react-icons/fi';

const ChangePassword = () => {
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    setSuccessMessage('');
    try {
      const res = await authService.changePassword(
        data.old_password,
        data.new_password,
        data.confirm_password
      );
      setSuccessMessage(res.message || 'Password updated successfully!');
      reset();
    } catch (err) {
      const errorMsg =
        err.response?.data?.old_password?.[0] ||
        err.response?.data?.new_password?.[0] ||
        err.response?.data?.detail ||
        'Failed to update password. Please check your current password.';
      setServerError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 sm:px-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FiLock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Security & Password</h2>
            <p className="text-xs text-slate-500">Update your account credentials to keep your profile secure</p>
          </div>
        </div>

        {serverError && (
          <Alert
            type="error"
            message={serverError}
            className="mb-6"
            onClose={() => setServerError('')}
          />
        )}

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            className="mb-6"
            onClose={() => setSuccessMessage('')}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <InputField
            label="Current Password"
            id="old_password"
            type="password"
            placeholder="Enter current password"
            icon={FiLock}
            required
            error={errors.old_password?.message}
            {...register('old_password')}
          />

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
            placeholder="Re-enter new password"
            icon={FiLock}
            required
            error={errors.confirm_password?.message}
            {...register('confirm_password')}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
