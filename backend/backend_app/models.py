from django.db import models
import uuid


class User(models.Model):
    username = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=200)
    user_type = models.CharField(max_length=200)
    is_active = models.CharField(max_length=200, default=False)
    activation_token = models.UUIDField(default=uuid.uuid4, unique=True)

    def __str__(self):
        return self.username
    

class Inventory(models.Model):
    product_name = models.CharField(max_length=200)
    size = models.CharField(max_length=200)
    branded = models.BooleanField()
    boxes = models.IntegerField()
    extra_units = models.IntegerField()
    unit_per_box = models.IntegerField()
    per_liter_value = models.FloatField()
    total_ml_in = models.IntegerField()
    total_value_in = models.FloatField()
    total_units = models.IntegerField(default=0)

    def __str__(self):
        return self.product_name


class Products(models.Model):
    product_name = models.CharField(max_length=200)
    size = models.IntegerField()
    branded = models.BooleanField()
    unit_per_box = models.IntegerField()
    per_liter_value = models.FloatField()
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.product_name
    

class Pending_inventory(models.Model):
    product_name = models.CharField(max_length=200)
    size = models.CharField(max_length=200)
    branded = models.BooleanField()
    boxes = models.IntegerField()
    extra_units = models.IntegerField()
    unit_per_box = models.IntegerField()
    per_liter_value = models.FloatField()
    total_ml_in = models.IntegerField()
    total_value_in = models.FloatField()
    approved = models.BooleanField(default=False)
    total_units = models.IntegerField(default=0)

    def __str__(self):
        return self.product_name

class Invoice(models.Model):
    company = models.CharField(max_length=255, default="My Dairy Shop")
    invoice_no = models.CharField(max_length=32, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    grand_total = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.invoice_no} - {self.company}"


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, related_name="items", on_delete=models.CASCADE)
    item_name = models.CharField(max_length=255)
    qty = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)  # unit price
    total = models.DecimalField(max_digits=12, decimal_places=2)  # qty * price