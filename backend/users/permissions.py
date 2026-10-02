from rest_framework import permissions

class IsCandidate(permissions.BasePermission):
    """
    Allows access only to authenticated users with the 'candidate' role.
    """
    message = "Access restricted to candidates only."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'candidate')

class IsRecruiter(permissions.BasePermission):
    """
    Allows access only to authenticated users with the 'recruiter' role.
    """
    message = "Access restricted to recruiters only."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'recruiter')

class IsPlatformAdmin(permissions.BasePermission):
    """
    Allows access only to platform administrators.
    """
    message = "Access restricted to administrators only."

    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role == 'admin' or request.user.is_staff or request.user.is_superuser)
        )

class IsRecruiterOrAdmin(permissions.BasePermission):
    """
    Allows access to recruiters or platform administrators.
    """
    message = "Access restricted to recruiters and platform administrators."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['recruiter', 'admin'] or request.user.is_staff or request.user.is_superuser

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(obj, 'user', None) or getattr(obj, 'candidate', None) or getattr(obj, 'recruiter', None) or getattr(obj, 'owner', None)
        return owner == request.user or request.user.is_staff
