# Generated by Django 5.1.6 on 2025-05-28 19:49

from django.db import migrations

def set_admin3_flag(apps, schema_editor):
    Angajat = apps.get_model('SistemManagementInventar', 'Angajat')
    try:
        u = Angajat.objects.get(username='admin3')
        u.este_admin = True
        u.save()
    except Angajat.DoesNotExist:
        pass

class Migration(migrations.Migration):
    dependencies = [
        ('SistemManagementInventar', '0003_auto_20250528_2221'),
    ]
    operations = [
        migrations.RunPython(set_admin3_flag),
    ]
