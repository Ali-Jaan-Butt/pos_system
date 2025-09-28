from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from backend_app.models import User, Products, Inventory, Pending_inventory, Invoice, InvoiceItem
from rest_framework.response import Response
from django.http import JsonResponse, HttpResponse
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
import jwt
from datetime import datetime, timedelta
from backend.settings import SECRET_KEY
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
import traceback


@csrf_exempt
def signup_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("Received data:", data)   # ✅ log here

            username = data.get("username")
            password = data.get("password")
            user_type = data.get("user_type")

            # Basic validation
            if not username or not password or not user_type:
                return JsonResponse({"status": "error", "message": "All fields required"}, status=400)

            # Example user creation (with Django’s User model)
            from django.contrib.auth.models import User
            if User.objects.filter(username=username).exists():
                return JsonResponse({"status": "error", "message": "Username already exists"}, status=400)

            user = User(username=username)
            user.set_password(password)   # ✅ always hash passwords
            user.save()

            return JsonResponse({"status": "success", "message": "User created"})
        except Exception as e:
            print("Error in signup_user:", e)          # ✅ log error
            print(traceback.format_exc())              # ✅ full stacktrace
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request"}, status=405)


@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_n = data['username']
            pwd = data['password']
            user_data = User.objects.filter(username=user_n).first()
            print(user_data)
            if user_data and user_data.is_active == 'True':
                print('yes')
                if pwd == user_data.password:
                    token_payload = {
                        'user_id': user_data.id,
                        'username': user_data.username,
                        'exp': datetime.utcnow() + timedelta(hours=1)
                    }
                    token = jwt.encode(token_payload, SECRET_KEY, algorithm='HS256')
                    return JsonResponse({'status': 'success', 'data_received': {'username': user_data.username, 'password': user_data.password, 'user_type': user_data.user_type, 'token': token}})
                else:
                    return JsonResponse({'error': 'Invalid Credentials'}, status=400)
            else:
                return JsonResponse({'error': 'User not found'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def activate_user(request, token):
    if request.method == 'GET':
        user = get_object_or_404(User, activation_token=token)
        user.is_active = True
        user.save()
        return JsonResponse({'status': 'success', 'message': f'User {user.username} activated successfully!'})
    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def add_product(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product_check = Products.objects.filter(
                product_name=data['product_name'],
                size=data['size'],
                branded=data['branded'],
                unit_per_box=data['unit_per_box'],
                per_liter_value=data['per_liter_value']
            ).first()
            if product_check:
                return JsonResponse({'status': 'No inserted', 'message': 'Product already added.'}, status=200)
            
            product_data = Products(
                product_name=data['product_name'],
                size=data['size'],
                branded=data['branded'],
                unit_per_box=data['unit_per_box'],
                per_liter_value=data['per_liter_value'],
            )
            product_data.save()
            return JsonResponse({'status': 'success', 'data_received': product_data.id}, status=201)
        
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

@csrf_exempt
def get_product_data(request):
    if request.method == 'GET':
        products_all = Products.objects.all()
        products_data = [
            {
                "key": pr.id,  # key for AntD Table
                "product_name": pr.product_name,
                "size": pr.size,
                "branded": pr.branded,
                "unit_per_box": pr.unit_per_box,
                "per_liter_value": pr.per_liter_value,
                "approved": pr.approved,
            }
            for pr in products_all
        ]
        return JsonResponse({'status': 'success', 'data': products_data})
    return JsonResponse({'status': 'error', 'message': 'Only GET method is allowed'})

@csrf_exempt
def approve_product_add(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product_check = Products.objects.filter(
                product_name=data['product_name'],
                size=data['size'],
                branded=data['branded'],
                unit_per_box=data['unit_per_box'],
                per_liter_value=data['per_liter_value']
            ).first()
            if product_check:
                product_check.approved = True
                return JsonResponse({'status': 'success', 'message': 'Product approved.'}, status=200)
        except Exception as e:
            print(f"Error: {e}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


@csrf_exempt
def add_inventory(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            product_name = data['product_name']   # removed comma
            size = data['size']
            boxes = int(data['boxes'])
            branded = data['branded']             # removed comma
            extra_units = int(data['extra_units'])
            unit_per_box = int(data['unit_per_box'])
            per_liter_value = float(data['per_liter_value'])

            total_units = (boxes * unit_per_box) + extra_units
            total_ml_in = size * total_units
            total_value_in = per_liter_value * total_ml_in

            inventory_data = Pending_inventory(
                product_name=product_name,
                size=size,
                boxes=boxes,
                branded=branded,
                extra_units=extra_units,
                unit_per_box=unit_per_box,
                per_liter_value=per_liter_value,
                total_ml_in=total_ml_in,
                total_value_in=total_value_in,
                total_units=total_units
            )
            inventory_data.save()

            return JsonResponse({'status': 'success', 'data_received': inventory_data.id})

        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)



@csrf_exempt
def get_pending_inventory(request):
    if request.method == 'GET':
        inventory_all = Pending_inventory.objects.all()
        pending_data = [
            {
                "product_name":p.product_name,
                "size":p.size,
                "boxes":p.boxes,
                "branded":p.branded,
                "extra_units":p.extra_units,
                "unit_per_box":p.unit_per_box,
                "per_liter_value":p.per_liter_value,
                "total_ml_in":p.total_ml_in,
                "total_value_in":p.total_value_in,
                "total_units":p.total_units,
                "approved":p.approved
            }
            for p in inventory_all
        ]
        return JsonResponse({'status': 'success', 'data': pending_data})
    return JsonResponse({'status': 'error', 'message': 'Only GET method is allowed'})

@csrf_exempt
def get_complete_inventory(request):
    if request.method == 'GET':
        inventory_all = Inventory.objects.all()
        complete_data = [
            {
                "product_name":p.product_name,
                "size":p.size,
                "boxes":p.boxes,
                "branded":p.branded,
                "extra_units":p.extra_units,
                "unit_per_box":p.unit_per_box,
                "per_liter_value":p.per_liter_value,
                "total_ml_in":p.total_ml_in,
                "total_value_in":p.total_value_in,
                "total_units":p.total_units,
                "approved":p.approved
            }
            for p in inventory_all
        ]
        return JsonResponse({'status': 'success', 'data': complete_data})
    return JsonResponse({'status': 'error', 'message': 'Only GET method is allowed'})


@csrf_exempt
def approve_inventory(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product_name=data['product_name'],
            size = data['size']
            boxes = data['boxes']
            branded = data['branded'],
            extra_units = data['extra_units']
            unit_per_box = data['unit_per_box']
            per_liter_value = data['per_liter_value']
            total_units = data['total_units']
            total_ml_in = data['total_ml_in']
            total_value_in = data['total_value_in']
            inventory_check = Inventory.objects.filter(
                product_name=product_name,
                size=size,
                branded=branded,
                unit_per_box=unit_per_box,
                per_liter_value=per_liter_value
            ).first()
            pending_check = Pending_inventory.objects.filter(
                product_name=product_name,
                size=size,
                boxes=boxes,
                branded=branded,
                extra_units=extra_units,
                unit_per_box=unit_per_box,
                per_liter_value=per_liter_value,
                total_units=total_units,
                total_ml_in=total_ml_in,
                total_value_in=total_value_in
            ).first()
            if inventory_check:
                inventory_check.boxes = inventory_check.boxes + boxes
                inventory_check.extra_units = inventory_check.extra_units + extra_units
                inventory_check.total_units = inventory_check.total_units + total_units
                inventory_check.total_ml_in = inventory_check.total_ml_in + total_ml_in
                inventory_check.total_value_in = inventory_check.total_value_in + total_value_in
                inventory_check.save()
                pending_check.delete()
                return JsonResponse({'status': 'success', 'data_received': inventory_check.id})
            inventory_data = Inventory(
                product_name=product_name,
                size=size,
                boxes=boxes,
                branded=branded,
                extra_units=extra_units,
                unit_per_box=unit_per_box,
                per_liter_value=per_liter_value,
                total_ml_in=total_ml_in,
                total_value_in=total_value_in,
                total_units=total_units
            )
            inventory_data.save()
            pending_check.delete()
            return JsonResponse({'status': 'success', 'data_received': inventory_data.id})
        except Exception as e:
            print(f"Error: {e}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

def _generate_invoice_no():
    # e.g. INV-20250908-000123
    today = timezone.now().strftime("%Y%m%d")
    seq = Invoice.objects.filter(created_at__date=timezone.localdate()).count() + 1
    return f"INV-{today}-{seq:06d}"


@csrf_exempt
def create_invoice(request):
    """
    POST JSON:
    {
      "company": "My Dairy Shop",
      "items": [
        {"name": "Milk", "qty": 2, "price": 50},
        {"name": "Bread", "qty": 1, "price": 80}
      ]
    }
    """
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Only POST allowed'}, status=405)
    try:
        payload = json.loads(request.body.decode('utf-8'))
        items = payload.get('items', [])
        company = payload.get('company', 'My Dairy Shop')
        if not items:
            return JsonResponse({'status': 'error', 'message': 'No items provided'}, status=400)

        # compute grand total
        grand_total = sum((item['qty'] * float(item['price'])) for item in items)

        with transaction.atomic():
            inv = Invoice.objects.create(
                company=company,
                invoice_no=_generate_invoice_no(),
                grand_total=grand_total
            )
            bulk = []
            for it in items:
                total = float(it['price']) * int(it['qty'])
                bulk.append(InvoiceItem(
                    invoice=inv,
                    item_name=it['name'],
                    qty=int(it['qty']),
                    price=float(it['price']),
                    total=total
                ))
            InvoiceItem.objects.bulk_create(bulk)

        return JsonResponse({
            'status': 'success',
            'invoice': {
                'id': inv.id,
                'invoice_no': inv.invoice_no,
                'company': inv.company,
                'created_at': inv.created_at.isoformat(),
                'grand_total': float(inv.grand_total)
            }
        }, status=201)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
def daily_sales(request):
    """
    GET /api/sales/daily/?date=YYYY-MM-DD
    Returns: items for the day + invoice header info + totals
    """
    if request.method != 'GET':
        return JsonResponse({'status': 'error', 'message': 'Only GET allowed'}, status=405)
    try:
        date_str = request.GET.get('date')
        if date_str:
            day = datetime.strptime(date_str, "%Y-%m-%d").date()
        else:
            day = timezone.localdate()

        invoices = Invoice.objects.filter(created_at__date=day).order_by('-created_at')
        items_flat = []
        grand_total_sum = 0.0

        for inv in invoices:
            grand_total_sum += float(inv.grand_total)
            for it in inv.items.all():
                items_flat.append({
                    "invoice_no": inv.invoice_no,
                    "time": inv.created_at.strftime("%H:%M"),
                    "item_name": it.item_name,
                    "qty": it.qty,
                    "price": float(it.price),
                    "total": float(it.total),
                })

        return JsonResponse({
            'status': 'success',
            'date': day.isoformat(),
            'grand_total': grand_total_sum,
            'rows': items_flat
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)