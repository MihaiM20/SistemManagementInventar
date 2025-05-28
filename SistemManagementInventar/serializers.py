from rest_framework import serializers
from .models import (
    Furnizor, BancaFurnizor, Produs, DetaliiProdus,
    Factura, Angajat, Client, SalariuAngajat,
    DetaliiFactura, CerereClient, ContFurnizor, BancaAngajat
)

# Serializer pentru modelul Furnizor:
# - folosește ModelSerializer pentru a genera automat câmpurile
# - fields="__all__" include toate câmpurile modelului în JSON
class FurnizorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Furnizor
        fields = "__all__"


# Serializer pentru conturile bancare ale furnizorilor:
# - include toate câmpurile din model
# - la serializare adaugă la ieșire și datele furnizorului asociat, sub cheia 'furnizor'
class BancaFurnizorSerializer(serializers.ModelSerializer):
    class Meta:
        model = BancaFurnizor
        fields = "__all__"

    def to_representation(self, instance):
        # obține dict-ul standard (toate câmpurile modelului)
        response = super().to_representation(instance)
        # adaugă sub-serializare pentru relația ForeignKey -> furnizor
        response['furnizor'] = FurnizorSerializer(instance.id_furnizor).data
        return response


# Serializer pentru conturile bancare ale angajaților:
# - include toate câmpurile din model
# - la serializare adaugă datele angajatului asociat, sub cheia 'angajat'
class BancaAngajatSerializer(serializers.ModelSerializer):
    class Meta:
        model = BancaAngajat
        fields = "__all__"

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['angajat'] = AngajatSerializer(instance.id_angajat).data
        return response


# Serializer pentru produse:
# - serializare completă a modelului Produs
# - adaugă date complete despre furnizorul produsului
class ProdusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produs
        fields = "__all__"

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['furnizor'] = FurnizorSerializer(instance.id_furnizor).data
        return response


# Serializer pentru detaliile fiecărui produs:
# - serializare completă a modelului DetaliiProdus
# - adaugă date complete despre produsul de referință
class DetaliiProdusSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetaliiProdus
        fields = "__all__"

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['produs'] = ProdusSerializer(instance.id_produs).data
        return response


# Variantă “simplă” care nu face nesting suplimentar,
# utilă dacă vrei doar câmpurile brute din DetaliiProdus
class DetaliiProdusSerializerSimplu(serializers.ModelSerializer):
    class Meta:
        model = DetaliiProdus
        fields = "__all__"

# Serializer pentru angajat:
# - include toate câmpurile din modelul Angajat
class AngajatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Angajat
        fields = "__all__"


# Serializer pentru client:
# - include toate câmpurile din modelul Client
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"


# Serializer pentru factură:
# - serializare completă a modelului Factura
# - la ieșire, include și datele clientului asociat sub cheia 'client'
class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = "__all__"

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['client'] = ClientSerializer(instance.id_client).data
        return response


# Serializer pentru salariul angajatului:
# - include toate câmpurile din SalariuAngajat
# - adaugă nesting cu datele angajatului
class SalariuAngajatSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalariuAngajat
        fields = "__all__"

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['angajat'] = AngajatSerializer(instance.id_angajat).data
        return response


# Serializer pentru elementele dintr-o factură:
# - include toate câmpurile din DetaliiFactura
# - adaugă nesting pentru factura și produsul asociat
class DetaliiFacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetaliiFactura
        fields = "__all__"

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['factura'] = FacturaSerializer(instance.id_factura).data
        response['produs'] = ProdusSerializer(instance.id_produs).data
        return response


# Serializer pentru cererile clienților:
# - include toate câmpurile din modelul CerereClient
class CerereClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = CerereClient
        fields = "__all__"


# Serializer pentru conturile furnizorilor (tranzacții):
# - include toate câmpurile din ContFurnizor
# - la serializare, include și datele furnizorului
class ContFurnizorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContFurnizor
        fields = "__all__"

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['furnizor'] = FurnizorSerializer(instance.id_furnizor).data
        return response
