from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from backend_app.models import User, Products
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


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            signup_data = User(
                username=data['username'],
                password=data['password'],
                user_type=data['user_type']
            )
            signup_data.save()

            activation_link = f"http://127.0.0.1:8000/activate/{signup_data.activation_token}/"
            send_mail(
                subject="New Account Pending Approval",
                message=f"A new user signed up.\n\nUsername: {signup_data.username}\n\nApprove: {activation_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=["aliwsservices@gmail.com"],
                fail_silently=False,
            )
            return JsonResponse({'status': 'success', 'data_received': signup_data.id})
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


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
            product_data = Products(
                product_name=data['product_name'],
                size=data['size'],
                branded=data['branded'],
                unit_per_box=data['unit_per_box'],
                per_liter_value=data['per_liter_value'],
            )
            product_data.save()
            return JsonResponse({'status': 'success', 'data_received': product_data.id})
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
                "product_name":pr.product_name,
                "size":pr.size,
                "branded":pr.branded,
                "unit_per_box":pr.unit_per_box,
                "per_liter_value":pr.per_liter_value,
            }
            for pr in products_all
        ]
        return JsonResponse({'status': 'success', 'data': products_data})
    return JsonResponse({'status': 'error', 'message': 'Only GET method is allowed'})