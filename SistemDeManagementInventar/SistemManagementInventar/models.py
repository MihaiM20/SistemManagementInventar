from django.contrib.auth.models import AbstractUser
from django.db import models

class Furnizor(models.Model):
    # Cheie primară auto-incrementală
    id = models.AutoField(primary_key=True)
    # Numele furnizorului
    nume = models.CharField(max_length=255)
    # Adresa fizică a furnizorului
    adresa = models.CharField(max_length=255)
    # Numărul de telefon: stocat ca text pentru prefix țară, paranteze etc.
    nr_telefon = models.CharField(max_length=255)
    # Emailul de contact
    email = models.CharField(max_length=255)
    # Descriere scurtă a furnizorului
    descriere = models.CharField(max_length=255)
    # Data și ora la care a fost înregistrat pentru prima dată (setat automat)
    data_adaugare = models.DateTimeField(auto_now_add=True)

    # Manager implicit pentru interogări
    objects = models.Manager()


class Produs(models.Model):
    id = models.AutoField(primary_key=True)
    # Denumirea produsului
    nume = models.CharField(max_length=255)
    # Tip generic (ex: aliment, băutură, curățenie)
    tip_produs = models.CharField(max_length=255)
    # Prețul de achiziție de la furnizor
    pret_cumparare = models.IntegerField()
    # Prețul de vânzare către client
    pret_vanzare = models.IntegerField()
    # TVA aplicat produsului (ex: 19 pentru 19%)
    tva_produs = models.IntegerField()
    # Lotul producției
    nr_lot = models.CharField(max_length=255)
    # Locul pe raft
    nr_raft = models.CharField(max_length=255)
    # Data expirării
    data_expirare = models.DateField()
    # Data producerii
    data_producere = models.DateField()
    # Legătură către furnizor: la ștergerea furnizorului, se șterg și produsele
    id_furnizor = models.ForeignKey(Furnizor, on_delete=models.CASCADE)
    # Descriere sumară a produsului
    descriere = models.CharField(max_length=255)
    # Cantitatea disponibilă total în stoc
    stoc_total = models.IntegerField()
    # Câte unități sunt într-un pachet
    cantitate_in_pachet = models.IntegerField()
    # Data creării în baza de date
    data_adaugare = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()


class DetaliiProdus(models.Model):
    id = models.AutoField(primary_key=True)
    # Legătură către tabelul Produs (un produs poate avea multe detalii)
    id_produs = models.ForeignKey(Produs, on_delete=models.CASCADE)
    # Numele atributului (ex: culoare, mărime, ingredient)
    nume_atribut = models.CharField(max_length=255)
    # Valoarea atributului (ex: roșu, XL, zahăr)
    valoare_atribut = models.CharField(max_length=255)
    # Opțional: unitatea de măsură (ex: grame, ml, bucăți)
    unitate_masura = models.CharField(max_length=255, blank=True, null=True)
    # Data și ora la care s-a adăugat această detaliere
    data_adaugare = models.DateTimeField(auto_now_add=True)
    # Opțional: descriere suplimentară
    descriere = models.CharField(max_length=255, blank=True, null=True)

    objects = models.Manager()


class Admin(models.Model):
    id = models.AutoField(primary_key=True)
    # Nume și prenume ale administratorului
    nume = models.CharField(max_length=255)
    prenume = models.CharField(max_length=255)
    # Email folosit pentru autentificare
    email = models.CharField(max_length=255)
    # Parola stocată (ideal hashed în practică)
    parola = models.CharField(max_length=255)
    # Actualizat la fiecare autentificare
    ultima_autentificare = models.DateTimeField(auto_now=True)
    # Data adăugării contului
    data_adaugare = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()

class Angajat(AbstractUser):
    # Extinde User-ul Django pentru a adauga campuri specifice
    nume = models.CharField(max_length=255)
    prenume = models.CharField(max_length=255)
    telefon = models.CharField(max_length=20, blank=True)
    este_admin = models.BooleanField(default=False)

    # Definitii pentru Django
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'nume', 'prenume']

    def set_parola(self, raw_password):
        # wrapper peste metoda built-in
        return self.set_password(raw_password)

    def verifica_parola(self, raw_password):
        return self.check_password(raw_password)

    def __str__(self):
        rol = "Admin" if self.este_admin else "Angajat"
        return f"{self.nume} {self.prenume} ({rol})"


class Client(models.Model):
    id = models.AutoField(primary_key=True)
    # Denumirea (sau numele) clientului
    nume = models.CharField(max_length=255)
    adresa = models.CharField(max_length=255)
    # Persoana de contact și detaliile de comunicare
    contact = models.CharField(max_length=255)
    data_adaugare = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()


class Factura(models.Model):
    id = models.AutoField(primary_key=True)
    # Legătură către client: la ștergerea clientului, se șterg și facturile
    id_client = models.ForeignKey(Client, on_delete=models.CASCADE)
    # Data și ora emiterii facturii
    data_adaugare = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()


class SalariuAngajat(models.Model):
    id = models.AutoField(primary_key=True)
    # Legătură către angajat
    id_angajat = models.ForeignKey(Angajat, on_delete=models.CASCADE)
    # Data acordării salariului
    data_salariu = models.DateField()
    # Suma brută/netă (după cum decideți)
    suma_salariu = models.IntegerField()
    data_adaugare = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()


class DetaliiFactura(models.Model):
    id = models.AutoField(primary_key=True)
    # Legătura către factura părinte
    id_factura = models.ForeignKey(Factura, on_delete=models.CASCADE)
    # Produsul facturat
    id_produs = models.ForeignKey(Produs, on_delete=models.CASCADE)
    # Cantitatea vândută
    cantitate = models.IntegerField()
    data_adaugare = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()


class CerereClient(models.Model):
    id = models.AutoField(primary_key=True)
    # Numele clientului care a făcut cererea
    nume_client = models.CharField(max_length=255)
    telefon = models.CharField(max_length=255)
    # Descrierea produsului/serviciului solicitat
    detalii_produs = models.CharField(max_length=255)
    # Status: False = în așteptare, True = onorată
    status = models.BooleanField(default=False)
    data_cerere = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()


class ContFurnizor(models.Model):
    # Definim opțiuni pentru tipul de tranzacție
    TIP_TRANZACTIE_CHOICES = [
        (1, "Debit"),
        (2, "Credit"),
    ]

    id = models.AutoField(primary_key=True)
    # Legătură către furnizor
    id_furnizor = models.ForeignKey(Furnizor, on_delete=models.CASCADE)
    # Tipul tranzacției, cu liste de alegere
    tip_tranzactie = models.CharField(choices=TIP_TRANZACTIE_CHOICES, max_length=255)
    # Suma tranzacției
    suma_tranzactie = models.IntegerField()
    # Data tranzacției
    data_tranzactie = models.DateField()
    # Modalitatea de plată (ex: cash, transfer bancar)
    modalitate_plata = models.CharField(max_length=255)

    objects = models.Manager()


class BancaFurnizor(models.Model):
    id = models.AutoField(primary_key=True)
    # Număr iban/cont bancar
    nr_cont_bancar = models.CharField(max_length=255)
    # Cod SWIFT/BIC
    swift = models.CharField(max_length=255)
    # Legătură către furnizorul căruia îi aparține contul
    id_furnizor = models.ForeignKey(Furnizor, on_delete=models.CASCADE)

    objects = models.Manager()


class BancaAngajat(models.Model):
    id = models.AutoField(primary_key=True)
    nr_cont_bancar = models.CharField(max_length=255)
    swift = models.CharField(max_length=255)
    # Legătură către angajat: contul său personal
    id_angajat = models.ForeignKey(Angajat, on_delete=models.CASCADE)

    objects = models.Manager()
