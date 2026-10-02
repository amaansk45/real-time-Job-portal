from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator

def generate_user_token(user):
    """
    Generates a secure url-safe base64 uid and token for email verification or password reset.
    """
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    return uidb64, token

def decode_user_uid(uidb64):
    """
    Decodes the user ID from uidb64.
    """
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        return uid
    except (TypeError, ValueError, OverflowError):
        return None

def send_verification_email(user, request=None):
    """
    Sends an email verification link to newly registered users.
    """
    uidb64, token = generate_user_token(user)
    frontend_base = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
    verification_url = f"{frontend_base}/verify-email?uid={uidb64}&token={token}"

    subject = "Verify your JobConnect account"
    message = f"""Hi {user.first_name or user.username},

Thank you for registering on JobConnect! Please confirm your email address by clicking the link below:

{verification_url}

If you did not create an account, you can safely ignore this email.

Best regards,
The JobConnect Team
"""
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Error sending verification email: {e}")

def send_password_reset_email(user, request=None):
    """
    Sends a secure password reset link to the user.
    """
    uidb64, token = generate_user_token(user)
    frontend_base = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
    reset_url = f"{frontend_base}/reset-password?uid={uidb64}&token={token}"

    subject = "Reset your JobConnect password"
    message = f"""Hi {user.first_name or user.username},

We received a request to reset your JobConnect password. Click the link below to set a new password:

{reset_url}

This link is valid for 24 hours. If you did not request a password reset, please ignore this email.

Best regards,
The JobConnect Team
"""
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Error sending password reset email: {e}")
