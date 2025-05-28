from django.contrib.auth.models import AbstractUser
from django.db import models

class Furnizor(models.Model):
    id = models.AutoField(primary_key=True)
    nume = models.CharField(max_length=255)
    adresa = models.CharField(max_length=255)
    nr_telefon = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    descriere = models.CharField(max_length=255)
    data_adaugare = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()


class Produs(models.Model):
    id = models.AutoField(primary_key=True)
    nume = models.CharField(max_length=255)
    tip_produs = models.CharField(max_length=255)
    pret_cumparare = models.DecimalField(max_digits=10, decimal_places=2)
    pret_vanzare = models.DecimalField(max_digits=10, decimal_places=2)
    tva_produs = models.DecimalField(max_digits=5, decimal_places=2, help_text="Procentaj TVA, de ex. 19.00 pentru 19%")
    nr_lot = models.CharField(max_length=255)
    nr_raft = models.CharField(max_length=255)
    data_expirare = models.DateField()
    data_producere = models.DateField()
    id_furnizor = models.ForeignKey(Furnizor, on_delete=models.CASCADE)
    descriere = models.CharField(max_length=255)
    stoc_total = models.IntegerField()
    cantitate_in_pachet = models.IntegerField()
    data_adaugare = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()


class DetaliiProdus(models.Model):
    id = models.AutoField(primary_key=True)
    id_produs = models.ForeignKey(Produs, on_delete=models.CASCADE)
    nume_atribut = models.CharField(max_length=255)
    valoare_atribut = models.CharField(max_length=255)
    unitate_masura = models.CharField(max_length=255, blank=True, null=True)
    data_adaugare = models.DateTimeField(auto_now_add=True)
    descriere = models.CharField(max_length=255, blank=True, null=True)

    objects = models.Manager()

class Angajat(AbstractUser):
    nume = models.CharField(max_length=255)
    prenume = models.CharField(max_length=255)
    telefon = models.CharField(max_length=20, blank=True)
    este_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'nume', 'prenume']

    def set_parola(self, raw_password):
        return self.set_password(raw_password)

    def verifica_parola(self, raw_password):
        return self.check_password(raw_password)

    def __str__(self):
        rol = "Admin" if self.este_admin else "Angajat"
        return f"{self.nume} {self.prenume} ({rol})"


class Client(models.Model):
    id = models.AutoField(primary_key=True)
    nume = models.CharField(max_length=255)
    adresa = models.CharField(max_length=255)
    contact = models.CharField(max_length=255)
    data_adaugare = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()


class Factura(models.Model):
    id = models.AutoField(primary_key=True)
    id_client = models.ForeignKey(Client, on_delete=models.CASCADE)
    data_adaugare = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()


class SalariuAngajat(models.Model):
    id = models.AutoField(primary_key=True)
    id_angajat = models.ForeignKey(Angajat, on_delete=models.CASCADE)
    data_salariu = models.DateField()
    suma_salariu = models.DecimalField(max_digits=12, decimal_places=2)
    data_adaugare = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()


class DetaliiFactura(models.Model):
    id = models.AutoField(primary_key=True)
    id_factura = models.ForeignKey(Factura, on_delete=models.CASCADE)
    id_produs = models.ForeignKey(Produs, on_delete=models.CASCADE)
    cantitate = models.IntegerField()
    data_adaugare = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()


class CerereClient(models.Model):
    id = models.AutoField(primary_key=True)
    nume_client = models.CharField(max_length=255)
    telefon = models.CharField(max_length=255)
    detalii_produs = models.CharField(max_length=255)
    status = models.BooleanField(default=False)
    data_cerere = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()


class ContFurnizor(models.Model):
    TIP_TRANZACTIE_CHOICES = [
        (1, "Debit"),
        (2, "Credit"),
    ]

    id = models.AutoField(primary_key=True)
    id_furnizor = models.ForeignKey(Furnizor, on_delete=models.CASCADE)
    tip_tranzactie = models.CharField(choices=TIP_TRANZACTIE_CHOICES, max_length=255)
    suma_tranzactie = models.DecimalField(max_digits=12, decimal_places=2)
    data_tranzactie = models.DateField()
    modalitate_plata = models.CharField(max_length=255)

    objects = models.Manager()


class BancaFurnizor(models.Model):
    id = models.AutoField(primary_key=True)
    nr_cont_bancar = models.CharField(max_length=255)
    swift = models.CharField(max_length=255)
    id_furnizor = models.ForeignKey(Furnizor, on_delete=models.CASCADE)

    objects = models.Manager()


class BancaAngajat(models.Model):
    id = models.AutoField(primary_key=True)
    nr_cont_bancar = models.CharField(max_length=255)
    swift = models.CharField(max_length=255)
    id_angajat = models.ForeignKey(Angajat, on_delete=models.CASCADE)

    objects = models.Manager()
