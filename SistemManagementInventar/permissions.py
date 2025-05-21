# permissions.py
from rest_framework.permissions import BasePermission

class EsteAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff  # Adminii sunt marcați ca "is_staff=True"

class EsteAngajat(BasePermission):
    def has_permission(self, request, view):
        return request.user and not request.user.is_staff  # Angajații obișnuiți