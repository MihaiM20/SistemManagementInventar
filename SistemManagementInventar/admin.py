from django.contrib import admin
from SistemManagementInventar.models import (
    Furnizor, Produs, DetaliiProdus, Angajat, Client, Factura,
    SalariuAngajat, DetaliiFactura, CerereClient, ContFurnizor, BancaFurnizor, BancaAngajat
)
# Register your models here.
admin.site.register(Furnizor)
admin.site.register(Produs)
admin.site.register(DetaliiProdus)
admin.site.register(Angajat)
admin.site.register(Client)
admin.site.register(Factura)
admin.site.register(SalariuAngajat)
admin.site.register(DetaliiFactura)
admin.site.register(CerereClient)
admin.site.register(ContFurnizor)
admin.site.register(BancaFurnizor)
admin.site.register(BancaAngajat)