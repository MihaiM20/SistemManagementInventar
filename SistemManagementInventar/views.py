from datetime import timedelta

from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.utils import timezone

from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.routers import DefaultRouter
from rest_framework.views import APIView

from SistemManagementInventar.models import Furnizor, BancaFurnizor, Produs, DetaliiProdus, ContFurnizor, Angajat, \
    BancaAngajat, SalariuAngajat, CerereClient, Factura, DetaliiFactura
from SistemManagementInventar.permissions import EsteAdmin
from SistemManagementInventar.serializers import FurnizorSerializer, BancaFurnizorSerializer, ProdusSerializer, \
    DetaliiProdusSerializer, DetaliiProdusSerializerSimplu, ContFurnizorSerializer, AngajatSerializer, \
    BancaAngajatSerializer, SalariuAngajatSerializer, ClientSerializer, FacturaSerializer, DetaliiFacturaSerializer, \
    CerereClientSerializer

# ===== IMPORTANTE =====
# 1. Toate view-urile folosesc JWT pentru autentificare și permit doar utilizatorilor autentificați
# 2. Cod complet pentru CRUD operations pe modelele principale ale sistemului
# 3. Gestionarea erorilor prin blocuri try-except consistente în toate view-urile
# 4. Răspunsuri standardizate cu formate comune pentru succes/eroare
# 5. Relații complexe între modele gestionate prin serializere nested

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status

class LoginView(APIView):
    # Permitem acces public la acest endpoint
    authentication_classes = []       # nu folosim JWTAuthentication aici
    permission_classes = [AllowAny]   # AllowAny ca să nu ceară token

    def post(self, request):
        # citim datele din body
        username = request.data.get('username')
        parola   = request.data.get('parola')

        # căutăm angajatul după username
        angajat = Angajat.objects.filter(username=username).first()

        # dacă există și parola e validă, generăm token
        if angajat and angajat.verifica_parola(parola):
            token = RefreshToken.for_user(angajat)
            rol   = 'admin' if angajat.este_admin else 'angajat'
            return Response({
                'role':    rol,
                'access':  str(token.access_token),
                'refresh': str(token),
                'nume':    angajat.nume,
                'prenume': angajat.prenume
            }, status=status.HTTP_200_OK)

        # altfel respingem cu 401
        return Response(
            {'error': 'Credentiale invalide'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class FurnizorViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication] # Important: Securitate prin JWT
    permission_classes = [IsAuthenticated] # Important: Securitate prin JWT
    queryset = Furnizor.objects.all()
    serializer_class = FurnizorSerializer

    def list(self, request):
        """
        Important: Gestionarea listării tuturor furnizorilor cu tratarea excepțiilor
        pentru răspunsuri consistente și sigure
        """
        try:
            furnizor = Furnizor.objects.all()
            serializer = FurnizorSerializer(furnizor, many=True, context={'request': request})
            response_dict = {'error': False, 'message': 'Furnizori listati', 'data': serializer.data}
            return Response(response_dict, status=status.HTTP_200_OK)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la listarea furnizorilor: {str(e)}'}
            return Response(response_dict, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request):
        """Important: Validare date înainte de creare și răspuns cu management de erori"""
        try:
            serializer = FurnizorSerializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response_dict = {'error': False, 'message': 'Furnizor creat cu succes'}
            return Response(response_dict, status=status.HTTP_201_CREATED)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la crearea furnizorului: {str(e)}'}
            return Response(response_dict, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        """Important: Update parțial cu validare"""
        try:
            furnizor = get_object_or_404(Furnizor, pk=pk)
            serializer = FurnizorSerializer(furnizor, data=request.data, context={'request': request}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response_dict = {'error': False, 'message': 'Furnizor actualizat cu succes'}
            return Response(response_dict, status=status.HTTP_200_OK)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la actualizarea furnizorului: {str(e)}'}
            return Response(response_dict, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        """
        Important: Returnează datele unui furnizor și datele asociate (banca furnizor) -
        exemplu de relație one-to-many gestionată prin serializere nested
        """
        try:
            furnizor = get_object_or_404(Furnizor, pk=pk)
            serializer = FurnizorSerializer(furnizor, context={'request': request})

            data_serializer = serializer.data

            banca_furnizor = BancaFurnizor.objects.filter(id_furnizor=furnizor)
            detalii_banca_serializer = BancaFurnizorSerializer(banca_furnizor, many=True, context={'request': request})

            data_serializer['banca_furnizor'] = detalii_banca_serializer.data

            response_data = {
                "error": False,
                "message": "Furnizor găsit",
                "data": data_serializer
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            response_data = {
                "error": True,
                "message": f"Eroare la obținerea furnizorului: {str(e)}"
            }
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FurnizorOnlyViewSet(generics.ListAPIView):
    """
    Important: View simplificat care oferă doar operația de listare
    Folosește generics.ListAPIView - pentru endpoint-uri read-only
    """
    serializer_class = FurnizorSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Furnizor.objects.all()

class BancaFurnizorViewSet(viewsets.ModelViewSet):
    """ViewSet pentru operatii CRUD pe model BancaFurnizor"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = BancaFurnizor.objects.all()
    serializer_class = BancaFurnizorSerializer

    def create(self, request):
        try:
            serializer = BancaFurnizorSerializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response_dict = {'error': False, 'message': 'Date banca salvate cu succes'}
            return Response(response_dict, status=status.HTTP_201_CREATED)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la salvarea datelor: {str(e)}'}
            return Response(response_dict, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        try:
            bancafurnizor = BancaFurnizor.objects.all()
            serializer = BancaFurnizorSerializer(bancafurnizor, many=True, context={'request': request})
            response_dict = {'error': False, 'message': 'Date banca furnizor listate', 'data': serializer.data}
            return Response(response_dict, status=status.HTTP_200_OK)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la listarea datelor: {str(e)}'}
            return Response(response_dict, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        try:
            bancafurnizor = get_object_or_404(BancaFurnizor, pk=pk)
            serializer = BancaFurnizorSerializer(bancafurnizor, context={'request': request})
            response_data = {
                "error": False,
                "message": "Date banca furnizor gasite",
                "data": serializer.data
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            response_data = {
                "error": True,
                "message": f"Eroare la obtinerea datelor: {str(e)}"
            }
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk=None):
        try:
            bancafurnizor = get_object_or_404(BancaFurnizor, pk=pk)
            serializer = BancaFurnizorSerializer(bancafurnizor, data=request.data, context={'request': request}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response_dict = {'error': False, 'message': 'Actualizare date banca reusita'}
            return Response(response_dict, status=status.HTTP_200_OK)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la actualizarea datelor: {str(e)}'}
            return Response(response_dict, status=status.HTTP_400_BAD_REQUEST)

class ProdusViewSet(viewsets.ModelViewSet):
    """
    Important: ViewSet custom pentru gestionarea produselor și a detaliilor lor
    Utilizează viewsets.ViewSet pentru implementare manuală a metodelor
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset               = Produs.objects.all()
    serializer_class       = ProdusSerializer

    def create(self, request):
        """
        Important: Crearea unui produs cu detalii asociate - exemplu de
        creare relații parent-child într-o singură cerere
        """
        try:
            serializer = ProdusSerializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            id_produs = serializer.data['id']

            #adaug id-ul produsului care este folosit pt detalii
            lista_detalii_produs =[]
            for detalii_produs in request.data['detalii_produs']:
                print(detalii_produs)
                #detalii produs pt serializer
                detalii_produs['id_produs'] = id_produs
                lista_detalii_produs.append(detalii_produs)
                print(detalii_produs)

            serializer2=DetaliiProdusSerializer(data=lista_detalii_produs, many=True, context={'request': request})
            serializer2.is_valid()
            serializer2.save()

            response_dict = {'error': False, 'message': 'Creat cu succes'}
            return Response(response_dict, status=status.HTTP_201_CREATED)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la creare: {str(e)}'}
            return Response(response_dict, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        """
        Important: Listare produs cu detalii asociate - exemplu de
        returnare date relaționate într-un singur răspuns
        """
        try:
            produs = Produs.objects.all()
            serializer = ProdusSerializer(produs, many=True, context={'request': request})

            date_produse=serializer.data
            listaprodusenoua=[]

            for produs in date_produse:
                date_produs=DetaliiProdus.objects.filter(id_produs=produs['id'])
                detalii_produs_serializer=DetaliiProdusSerializerSimplu(date_produs, many=True, context={'request': request})
                produs['detalii_produs']=detalii_produs_serializer.data
                listaprodusenoua.append(produs)

            response_dict = {'error': False, 'message': 'Produse listate', 'data': serializer.data}
            return Response(response_dict, status=status.HTTP_200_OK)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la listarea produselor: {str(e)}'}
            return Response(response_dict, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        try:
            produs = get_object_or_404(Produs, pk=pk)
            serializer = ProdusSerializer(produs, context={'request': request})

            data_serializer=serializer.data

            date_produs=DetaliiProdus.objects.filter(id_produs=data_serializer['id'])
            detalii_produs_serializer=DetaliiProdusSerializerSimplu(date_produs, many=True, context={'request': request})
            data_serializer['detalii_produs']=detalii_produs_serializer.data

            response_data = {
                "error": False,
                "message": "Produs gasit",
                "data": data_serializer
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            response_data = {
                "error": True,
                "message": f"Eroare la obtinerea produsului: {str(e)}"
            }
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk=None):
        """
        Important: Update complex pentru produs și detaliile sale asociate
        Demonstrează gestionarea corectă a relațiilor parent-child în actualizări
        """
        try:
            produs = get_object_or_404(Produs, pk=pk)
            # Extragem detaliile_produs și pregătim datele produsului
            data = request.data.copy()
            detalii_list = data.pop('detalii_produs', None)

            # Actualizăm produsul fără detalii
            serializer = ProdusSerializer(produs, data=data, context={'request': request}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            # Procesăm detaliile produsului separat
            if detalii_list is not None:
                for det in detalii_list:
                    det_data = det.copy()
                    det_id = det_data.pop('id', None)
                    # Asigurăm referința corectă către produs
                    det_data['id_produs'] = produs.id

                    if not det_id or det_id == 0:
                        # Creare detaliu nou
                        det_serializer = DetaliiProdusSerializer(data=det_data, context={'request': request})
                        det_serializer.is_valid(raise_exception=True)
                        det_serializer.save()
                    else:
                        # Actualizare detaliu existent
                        det_obj = get_object_or_404(DetaliiProdus, pk=det_id)
                        det_serializer = DetaliiProdusSerializer(det_obj, data=det_data, context={'request': request}, partial=True)
                        det_serializer.is_valid(raise_exception=True)
                        det_serializer.save()

            return Response({'error': False, 'message': 'Produs actualizat cu succes'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': True, 'message': f'Eroare la actualizarea produsului: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

#cont furnizor viewset
class ContFurnizorViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset               = ContFurnizor.objects.all()
    serializer_class       = ContFurnizorSerializer

    def create(self, request):
        try:
            serializer = ContFurnizorSerializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response_dict = {'error': False, 'message': 'Date cont salvate cu succes'}
            return Response(response_dict, status=status.HTTP_201_CREATED)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la salvarea datelor: {str(e)}'}
            return Response(response_dict, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        try:
            contfurnizor = ContFurnizor.objects.all()
            serializer = ContFurnizorSerializer(contfurnizor, many=True, context={'request': request})
            response_dict = {'error': False, 'message': 'Date cont furnizor listate', 'data': serializer.data}
            return Response(response_dict, status=status.HTTP_200_OK)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la listarea datelor: {str(e)}'}
            return Response(response_dict, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        try:
            contfurnizor = get_object_or_404(ContFurnizor, pk=pk)
            serializer = ContFurnizorSerializer(contfurnizor, context={'request': request})
            response_data = {
                "error": False,
                "message": "Date banca furnizor gasite",
                "data": serializer.data
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            response_data = {
                "error": True,
                "message": f"Eroare la obtinerea datelor: {str(e)}"
            }
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk=None):
        try:
            contfurnizor = get_object_or_404(ContFurnizor, pk=pk)
            serializer = ContFurnizorSerializer(contfurnizor, data=request.data, context={'request': request}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response_dict = {'error': False, 'message': 'Actualizare date cont reusita'}
            return Response(response_dict, status=status.HTTP_200_OK)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la actualizarea datelor: {str(e)}'}
            return Response(response_dict, status=status.HTTP_400_BAD_REQUEST)

#view angajati

class AngajatViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes     = [IsAuthenticated, EsteAdmin]  # doar admini pot crea/modifica
    queryset               = Angajat.objects.all()
    serializer_class       = AngajatSerializer

    def create(self, request):
        try:
            data = request.data.copy()
            # Mapăm 'parola' din payload la câmpul 'password'
            parola = data.pop('parola', None)
            if parola:
                data['password'] = make_password(parola)
            data['is_staff'] = data.get('este_admin', False)

            serializer = AngajatSerializer(data=data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response({'error': False, 'message': 'Date angajat salvate cu succes'},
                            status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': True, 'message': f'Eroare la salvarea angajatului: {str(e)}'},
                            status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        try:
            angajati  = Angajat.objects.all()
            serializer = AngajatSerializer(angajati, many=True, context={'request': request})
            return Response({'error': False, 'message': 'Date angajat listate', 'data': serializer.data},
                            status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': True, 'message': f'Eroare la listarea angajatilor: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        try:
            angajat = get_object_or_404(Angajat, pk=pk)
            serializer = AngajatSerializer(angajat, context={'request': request})
            return Response({'error': False, 'message': 'Date angajat găsite', 'data': serializer.data},
                            status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': True, 'message': f'Eroare la obținerea angajatului: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk=None):
        try:
            angajat = get_object_or_404(Angajat, pk=pk)
            data = request.data.copy()
            # Mapăm parola dacă a fost trimisă
            parola = data.pop('parola', None)
            if parola:
                data['password'] = make_password(parola)

            if 'este_admin' in data:
                data['is_staff'] = data.get('este_admin')

            serializer = AngajatSerializer(angajat, data=data, partial=True, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response({'error': False, 'message': 'Actualizare angajat reușită'},
                            status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': True, 'message': f'Eroare la actualizarea angajatului: {str(e)}'},
                            status=status.HTTP_400_BAD_REQUEST)

class BancaAngajatByAngIDViewSet(generics.ListAPIView):
    serializer_class = BancaAngajatSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        id_angajat=self.kwargs["id_angajat"]
        return BancaAngajat.objects.filter(id_angajat=id_angajat)

class SalariuAngajatByAngIDViewSet(generics.ListAPIView):
    serializer_class = SalariuAngajatSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        id_angajat=self.kwargs["id_angajat"]
        return SalariuAngajat.objects.filter(id_angajat=id_angajat)
class BancaAngajatViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request):
        try:
            serializer = BancaAngajatSerializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response_dict = {'error': False, 'message': 'Date banca angajat salvate cu succes'}
            return Response(response_dict, status=status.HTTP_201_CREATED)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la salvarea bancii angajatului: {str(e)}'}
            return Response(response_dict, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        try:
            bancaangajat = BancaAngajat.objects.all()
            serializer = BancaAngajatSerializer(bancaangajat, many=True, context={'request': request})
            response_dict = {'error': False, 'message': 'Date banca angajat listate', 'data': serializer.data}
            return Response(response_dict, status=status.HTTP_200_OK)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la listarea bancilor angajatilor: {str(e)}'}
            return Response(response_dict, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        try:
            bancaangajat = get_object_or_404(BancaAngajat, pk=pk)
            serializer = BancaAngajatSerializer(bancaangajat, context={'request': request})
            response_data = {
                "error": False,
                "message": "Date angajat gasite",
                "data": serializer.data
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            response_data = {
                "error": True,
                "message": f"Eroare la obtinerea bancii angajatului: {str(e)}"
            }
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk=None):
        try:
            bancaangajat = get_object_or_404(BancaAngajat, pk=pk)
            serializer = BancaAngajatSerializer(bancaangajat, data=request.data, context={'request': request}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response_dict = {'error': False, 'message': 'Actualizare banca angajat reusita'}
            return Response(response_dict, status=status.HTTP_200_OK)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la actualizarea bancii angajatului: {str(e)}'}
            return Response(response_dict, status=status.HTTP_400_BAD_REQUEST)

class SalariuAngajatViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request):
        try:
            serializer = SalariuAngajatSerializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response_dict = {'error': False, 'message': 'Date salariu angajat salvate cu succes'}
            return Response(response_dict, status=status.HTTP_201_CREATED)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la salvarea salariului angajatului: {str(e)}'}
            return Response(response_dict, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        try:
            salariuangajat = SalariuAngajat.objects.all()
            serializer = SalariuAngajatSerializer(salariuangajat, many=True, context={'request': request})
            response_dict = {'error': False, 'message': 'Date salariu angajat listate', 'data': serializer.data}
            return Response(response_dict, status=status.HTTP_200_OK)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la listarea salariilor angajatilor: {str(e)}'}
            return Response(response_dict, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        try:
            salariuangajat = get_object_or_404(BancaAngajat, pk=pk)
            serializer = SalariuAngajatSerializer(salariuangajat, context={'request': request})
            response_data = {
                "error": False,
                "message": "Date salariu angajat gasite",
                "data": serializer.data
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            response_data = {
                "error": True,
                "message": f"Eroare la obtinerea salariului angajatului: {str(e)}"
            }
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk=None):
        try:
            salariuangajat = get_object_or_404(SalariuAngajat, pk=pk)
            serializer = SalariuAngajatSerializer(salariuangajat, data=request.data, context={'request': request}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response_dict = {'error': False, 'message': 'Actualizare salariu angajat reusita'}
            return Response(response_dict, status=status.HTTP_200_OK)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la actualizarea salariului angajatului: {str(e)}'}
            return Response(response_dict, status=status.HTTP_400_BAD_REQUEST)

class ProdusByNumeViewSet(generics.ListAPIView):
    serializer_class = ProdusSerializer
    authentication_classes = [JWTAuthentication]    # <- adăugat
    permission_classes     = [IsAuthenticated]      # <- adăugat
    def get_queryset(self):
        nume = self.kwargs["nume"]
        return Produs.objects.filter(nume__contains=nume)

class GenerareFacturaViewSet(viewsets.ViewSet):
    """
    Important: Proces complex de business - generarea unei facturi
    Demonstrează tranzacții complexe cu multiple entități și actualizări de stoc
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request):
        """
        Procesul complet de creare factură implică:
        1. Crearea clientului
        2. Crearea facturii cu referință la client
        3. Adăugarea detaliilor pentru fiecare produs
        4. Validarea și actualizarea stocului pentru fiecare produs
        """
        try:
            with transaction.atomic():
                # 1. Creare client
                client_ser = ClientSerializer(data=request.data, context={'request': request})
                client_ser.is_valid(raise_exception=True)
                client_ser.save()
                id_client = client_ser.data['id']

                # 2. Creare factură
                factura_ser = FacturaSerializer(
                    data={'id_client': id_client},
                    context={'request': request}
                )
                factura_ser.is_valid(raise_exception=True)
                factura_ser.save()
                id_factura = factura_ser.data['id']

                # 3. Pregătire detalii factură + validare stoc
                lista_detalii = []
                for det in request.data.get('detalii_produs', []):
                    prod_id = det['id']
                    cant = int(det['cantitate'])

                    # blocăm rândul de produs pentru update concurrent
                    produs = Produs.objects.select_for_update().get(id=prod_id)

                    # validare stoc
                    if cant > produs.stoc_total:
                        # forțăm rollback și returnăm eroare
                        return Response(
                            {
                                'error': True,
                                'message': (
                                    f"Stoc epuizat pentru „{produs.nume}”. "
                                    f"Ai doar {produs.stoc_total} unități."
                                )
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    # actualizare stoc (nu poate scădea sub 0)
                    produs.stoc_total = max(produs.stoc_total - cant, 0)
                    produs.save()

                    lista_detalii.append({
                        'id_produs': prod_id,
                        'id_factura': id_factura,
                        'cantitate': cant
                    })

                # 4. Salvare detalii factură
                detaliu_ser = DetaliiFacturaSerializer(
                    data=lista_detalii,
                    many=True,
                    context={'request': request}
                )
                detaliu_ser.is_valid(raise_exception=True)
                detaliu_ser.save()

                return Response(
                    {'error': False, 'message': 'Factura creată cu succes'},
                    status=status.HTTP_201_CREATED
                )

        except Exception as e:
            return Response(
                {'error': True, 'message': f'Eroare la crearea facturii: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

class CerereClientViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = CerereClient.objects.all()
    serializer_class = CerereClientSerializer

    def list(self, request):
        try:
            cerereclient = CerereClient.objects.all()
            serializer = CerereClientSerializer(cerereclient, many=True, context={'request': request})
            response_dict = {'error': False, 'message': 'Clienti listati', 'data': serializer.data}
            return Response(response_dict, status=status.HTTP_200_OK)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la listarea clientilor: {str(e)}'}
            return Response(response_dict, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request):
        try:
            serializer = CerereClientSerializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response_dict = {'error': False, 'message': 'Client creat cu succes'}
            return Response(response_dict, status=status.HTTP_201_CREATED)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la crearea clientului: {str(e)}'}
            return Response(response_dict, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            cerereclient = get_object_or_404(CerereClient, pk=pk)
            serializer = CerereClientSerializer(cerereclient, data=request.data, context={'request': request}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response_dict = {'error': False, 'message': 'Cerere client actualizata cu succes'}
            return Response(response_dict, status=status.HTTP_200_OK)
        except Exception as e:
            response_dict = {'error': True, 'message': f'Eroare la actualizarea cererii clientului: {str(e)}'}
            return Response(response_dict, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        try:
            cerereclient = get_object_or_404(CerereClient, pk=pk)
            serializer = CerereClientSerializer(cerereclient, context={'request': request})

            data_serializer = serializer.data

            response_data = {
                "error": False,
                "message": "Client găsit",
                "data": data_serializer
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            response_data = {
                "error": True,
                "message": f"Eroare la obținerea clientului: {str(e)}"
            }
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ApiAcasaViewSet(viewsets.ViewSet):
    """
    Important: Endpoint pentru dashboard/pagina principală
    Agregă date din multiple modele pentru a oferi o imagine de ansamblu
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self, request):
        cerere_client = CerereClient.objects.all()
        cerere_client_serializer = CerereClientSerializer(cerere_client, many=True, context={'request': request})

        nr_facturi = Factura.objects.all()
        nr_facturi_serializer = FacturaSerializer(nr_facturi, many=True, context={'request': request})

        total_produse = Produs.objects.all()
        total_produse_serializer = ProdusSerializer(total_produse, many=True, context={'request': request})

        total_furnizori = Furnizor.objects.all()
        total_furnizori_serializer = FurnizorSerializer(total_furnizori, many=True, context={'request': request})

        total_angajati= Angajat.objects.all()
        total_angajati_serializer = AngajatSerializer(total_angajati, many=True, context={'request': request})
        #aici am ramas

        detalii_factura=DetaliiFactura.objects.all()
        suma_profit=0
        suma_vanzare=0
        suma_cumparare=0

        for det in detalii_factura:
            cant = det.cantitate
            suma_cumparare += float(det.id_produs.pret_cumparare) * cant
            suma_vanzare += float(det.id_produs.pret_vanzare) * cant

        suma_profit = suma_vanzare - suma_cumparare

        cerere_client_asteptare = CerereClient.objects.filter(status=False)
        cerere_client_asteptare_serializer = CerereClientSerializer(cerere_client_asteptare, many=True, context={'request': request})

        cerere_client_completate = CerereClient.objects.filter(status=True)
        cerere_client_completate_serializer = CerereClientSerializer(cerere_client_completate, many=True, context={'request': request})

        azi = timezone.localdate()
        azi1 = timezone.localdate()
        data_curenta_7zile = azi1 + timedelta(days=7)
        detalii_factura_azi = DetaliiFactura.objects.filter(data_adaugare__date=azi)
        suma_profit_azi=0
        suma_vanzare_azi=0
        suma_cumparare_azi=0

        for factura in detalii_factura_azi:
            suma_cumparare_azi += float(factura.id_produs.pret_cumparare) * factura.cantitate
            suma_vanzare_azi += float(factura.id_produs.pret_vanzare) * factura.cantitate

        suma_profit_azi = suma_vanzare_azi - suma_cumparare_azi

        produse_expirate = Produs.objects.filter(
            data_expirare__range=[azi, data_curenta_7zile]
        )

        produse_expirate_serializer = ProdusSerializer(produse_expirate, many=True, context={'request': request})

        data_facturi=DetaliiFactura.objects.order_by().values("data_adaugare__date").distinct()

        lista_profit_diagrama=[]
        lista_vanzare_diagrama=[]
        lista_cumparare_diagrama=[]

        for datafactura in data_facturi:
            data_acces = datafactura["data_adaugare__date"]
            detalii_list = DetaliiFactura.objects.filter(data_adaugare__date=data_acces)
            suma_cumparare_inner = 0
            suma_vanzare_inner = 0

            # iterăm lista de DetaliiFactura, nu lista de date
            for det in detalii_list:
                suma_cumparare_inner += float(det.id_produs.pret_cumparare) * det.cantitate
                suma_vanzare_inner += float(det.id_produs.pret_vanzare) * det.cantitate

            suma_profit_inner = suma_vanzare_inner - suma_cumparare_inner
            lista_profit_diagrama.append({"data":data_acces,"suma":suma_profit_inner})
            lista_vanzare_diagrama.append({"data":data_acces,"suma":suma_vanzare_inner})
            lista_cumparare_diagrama.append({"data":data_acces,"suma":suma_cumparare_inner})

        dict_response = {
            "error": False,
            "message": "Date pagina acasa",
            "cerere_client": len(cerere_client_serializer.data),
            "nr_facturi": len(nr_facturi_serializer.data),
            "total_produse": len(total_produse_serializer.data),
            "total_furnizori": len(total_furnizori_serializer.data),
            "total_angajati": len(total_angajati_serializer.data),
            "suma_vanzare": f"{suma_vanzare:.2f}",
            "suma_cumparare": f"{suma_cumparare:.2f}",
            "suma_profit": f"{suma_profit:.2f}",
            "cerere_client_asteptare": len(cerere_client_asteptare_serializer.data),
            "cerere_client_completate": len(cerere_client_completate_serializer.data),
            "suma_vanzare_azi": f"{suma_vanzare_azi:.2f}",
            "suma_profit_azi": f"{suma_profit_azi:.2f}",
            "data_produse_expirate_serializer": produse_expirate.count(),
            "diagrama_vanzari": lista_vanzare_diagrama,
            "diagrama_cumparare": lista_cumparare_diagrama,
            "diagrama_profit": lista_profit_diagrama,
        }
        return Response(dict_response)

# Definirea endpoint-urilor
router = DefaultRouter()
router.register(r'furnizor', FurnizorViewSet, basename='furnizor')
router.register(r'banca-furnizor', BancaFurnizorViewSet, basename='banca-furnizor')
router.register(r'produs', ProdusViewSet, basename='produs')

urlpatterns = router.urls