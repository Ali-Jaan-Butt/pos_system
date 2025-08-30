from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from backend_app.models import User
from rest_framework.response import Response
from django.http import JsonResponse, HttpResponse
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
import jwt
from datetime import datetime, timedelta
from backend.settings import SECRET_KEY


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            signup_data = User(
                username=data['username'],
                password=data['password']
            )
            signup_data.save()
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
            if user_data:
                if pwd == user_data.password:
                    token_payload = {
                        'user_id': user_data.id,
                        'username': user_data.username,
                        'exp': datetime.utcnow() + timedelta(hours=1)
                    }
                    token = jwt.encode(token_payload, SECRET_KEY, algorithm='HS256')
                    return JsonResponse({'status': 'success', 'data_received': {'username': user_data.username, 'password': user_data.password, 'token': token}})
                else:
                    return JsonResponse({'error': 'Invalid Credentials'}, status=400)
            else:
                return JsonResponse({'error': 'User not found'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=400)