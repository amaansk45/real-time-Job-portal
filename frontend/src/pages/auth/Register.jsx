import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import RoleSelector from '../../components/auth/RoleSelector';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiCheckCircle,
  FiArrowRight,
  FiAtSign,
} from 'react-icons/fi';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'candidate',
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      agreeToTerms: false,
    },
  });

  const selectedRole = watch('role');

  const handleRoleSelect = (role) => {
    setValue('role', role, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    try {
      const res = await registerUser(data);
      setSuccessData(res);
    } catch (err) {
      if (err.response?.data) {
        const errorObj = err.response.data;
        const firstKey = Object.keys(errorObj)[0];
        const val = errorObj[firstKey];
        const message = Array.isArray(val) ? val[0] : val;
        setServerError(`${firstKey.replace('_', ' ')}: ${message}`);
      } else {
        setServerError('Registration failed. Please verify your details and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (successData) {
    return (
      <AuthLayout
        title="Check your inbox"
        subtitle="We've sent an email verification link to complete your registration"
      >
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Account Created!</h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Welcome to JobConnect,{' '}
            <span className="font-semibold text-slate-900">
              {successData.user?.first_name || 'Member'}
            </span>
            . Please check <span className="font-medium text-slate-900">{successData.user?.email}</span> to verify your email address.
          </p>
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Proceed to Sign In
            </Button>
            <Link
              to="/"
              className="block text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of candidates and companies discovering their best match"
    >
      {serverError && (
        <Alert
          type="error"
          message={serverError}
          className="mb-6"
          onClose={() => setServerError('')}
        />
      )}

      {/* Role Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          I am registering as:
        </label>
        <RoleSelector
          selectedRole={selectedRole}
          onSelectRole={handleRoleSelect}
        />
        {errors.role && (
          <p className="mt-1 text-xs text-rose-500 font-medium">{errors.role.message}</p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            id="first_name"
            placeholder="Amaan"
            required
            error={errors.first_name?.message}
            {...register('first_name')}
          />
          <InputField
            label="Last Name"
            id="last_name"
            placeholder="Shaikh"
            required
            error={errors.last_name?.message}
            {...register('last_name')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Username"
            id="username"
            placeholder="amaan_dev"
            icon={FiAtSign}
            required
            error={errors.username?.message}
            {...register('username')}
          />
          <InputField
            label="Phone Number"
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            icon={FiPhone}
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Password"
            id="password"
            type="password"
            placeholder="Min. 8 characters"
            icon={FiLock}
            required
            error={errors.password?.message}
            {...register('password')}
          />
          <InputField
            label="Confirm Password"
            id="confirm_password"
            type="password"
            placeholder="Re-enter password"
            icon={FiLock}
            required
            error={errors.confirm_password?.message}
            {...register('confirm_password')}
          />
        </div>

        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              {...register('agreeToTerms')}
            />
            <span className="text-xs text-slate-600 leading-normal">
              I agree to the{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="mt-1 text-xs text-rose-500 font-medium">
              {errors.agreeToTerms.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-4"
          isLoading={isLoading}
          icon={FiArrowRight}
          iconPosition="right"
        >
          Create {selectedRole === 'recruiter' ? 'Recruiter' : 'Candidate'} Account
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
