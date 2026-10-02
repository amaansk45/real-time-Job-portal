import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import AuthLayout from '../../components/auth/AuthLayout';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const uidb64 = searchParams.get('uid') || searchParams.get('uidb64') || '';
  const token = searchParams.get('token') || '';

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const performVerification = async () => {
      if (!uidb64 || !token) {
        setStatus('error');
        setErrorMessage('Verification parameters missing from URL link.');
        return;
      }

      try {
        await authService.verifyEmail(uidb64, token);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        const msg =
          err.response?.data?.token?.[0] ||
          err.response?.data?.detail ||
          'Verification token is invalid or has expired.';
        setErrorMessage(msg);
      }
    };

    performVerification();
  }, [uidb64, token]);

  return (
    <AuthLayout
      title="Email Verification"
      subtitle="Confirming your JobConnect account email address"
    >
      {status === 'verifying' && (
        <div className="text-center py-10 space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <h3 className="text-base font-semibold text-slate-800">Verifying your email...</h3>
          <p className="text-sm text-slate-500">Please wait a moment while we confirm your account.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Email Verified Successfully!</h3>
          <p className="text-sm text-slate-600 mb-8 leading-relaxed">
            Thank you for confirming your email address. Your JobConnect account is now fully verified and ready.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Sign In Now
          </Button>
        </div>
      )}

      {status === 'error' && (
        <div className="py-4">
          <Alert
            type="error"
            title="Verification Failed"
            message={errorMessage}
            className="mb-6"
          />
          <div className="text-center space-y-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full gradient-btn py-2.5 rounded-xl font-medium text-sm"
            >
              Go to Sign In
            </Link>
            <Link
              to="/"
              className="block text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default VerifyEmail;
