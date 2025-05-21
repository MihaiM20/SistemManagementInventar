"""
URL configuration for SistemDeManagementInventar project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include  # include: permite încorporarea setului de rute din router
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,   # endpoint pentru obținerea perechii access+refresh token
    TokenRefreshView       # endpoint pentru reîmprospătarea access token-ului
)

from SistemManagementInventar import views
from SistemManagementInventar.views import LoginView

# Creează un DefaultRouter care generează automat rutele pentru ViewSet‐uri
router = routers.DefaultRouter()

# Înregistrează fiecare ViewSet cu un prefix de URL și un basename unic
router.register(
    "furnizor",
    views.FurnizorViewSet,
    basename="furnizor"
)
router.register(
    "bancafurnizor",
    views.BancaFurnizorViewSet,
    basename="bancafurnizor"
)
router.register(
    "produs",
    views.ProdusViewSet,
    basename="produs"
)
router.register(
    "contfurnizor",
    views.ContFurnizorViewSet,
    basename="contfurnizor"
)
router.register(
    "angajat",
    views.AngajatViewSet,
    basename="angajat"
)
router.register(
    # ViewSet pentru a obține toate conturile bancare ale angajaților
    "toti_angajati_banci",
    views.BancaAngajatViewSet,
    basename="toti_angajati_banci"
)
router.register(
    # ViewSet pentru a obține toate salariile angajaților
    "toti_angajati_salariu",
    views.SalariuAngajatViewSet,
    basename="toti_angajati_salariu"
)
router.register(
    # ViewSet custom pentru generarea facturilor
    "api_generare_factura",
    views.GenerareFacturaViewSet,
    basename="api_generare_factura"
)
router.register(
    "cerere_client",
    views.CerereClientViewSet,
    basename="cerere_client"
)
router.register(
    "acasa",                   # redenumeşti prefixul
    views.ApiAcasaViewSet,
    basename="api_acasa"
)

urlpatterns = [
    # Interfața de administrare Django
    path('admin/', admin.site.urls),

    # Încorporează toate rutele generate de DefaultRouter sub prefixul /api/
    path('api/', include(router.urls)),
    path('api/login/', LoginView.as_view(), name='login'),

    # Endpoint pentru obținerea JWT-urilor (access și refresh)
    path(
        'api/gettoken/',
        TokenObtainPairView.as_view(),
        name='gettoken'
    ),

    # Endpoint pentru reîmprospătarea access token-ului folosind refresh token
    path(
        'api/refresh_token/',
        TokenRefreshView.as_view(),
        name='refresh_token'
    ),

    # Endpoint custom: caută produs după nume
    # ex: GET /api/produsbynume/Paracetamol/
    path(
        'api/produsbynume/<str:nume>',
        views.ProdusByNumeViewSet.as_view(),
        name='produsbynume'
    ),

    # Endpoint care returnează doar informațiile de bază ale furnizorilor
    path(
        'api/furnizoronly/',
        views.FurnizorOnlyViewSet.as_view(),
        name='furnizoronly'
    ),

    # Endpoint care afișează contul bancar al unui angajat după ID-ul lui
    # ex: GET /api/angajat_bancaby_id/5/
    path(
        'api/angajat_bancaby_id/<str:id_angajat>/',
        views.BancaAngajatByAngIDViewSet.as_view(),
        name='angajat_bancaby_id'
    ),

    # Endpoint care afișează salariile unui angajat după ID-ul lui
    # ex: GET /api/angajat_salariuby_id/5/
    path(
        'api/angajat_salariuby_id/<str:id_angajat>/',
        views.SalariuAngajatByAngIDViewSet.as_view(),
        name='angajat_salariuby_id'
    ),
]
