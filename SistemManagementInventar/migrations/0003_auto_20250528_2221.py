from django.db import migrations

def load_all_data(apps, schema_editor):
    from django.core.management import call_command
    call_command('loaddata', 'all_data.json')

class Migration(migrations.Migration):

    dependencies = [
        ('SistemManagementInventar', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_all_data),
    ]
