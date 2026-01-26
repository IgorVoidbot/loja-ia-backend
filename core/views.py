from rest_framework import permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import User


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    full_name = serializers.CharField(required=False, allow_blank=True, max_length=255)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        full_name = serializer.validated_data.get("full_name", "")

        if User.objects.filter(email=email).exists():
            return Response(
                {"detail": "Email already registered."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(email=email, password=password)
        if full_name:
            user.first_name = full_name
            user.save(update_fields=["first_name"])

        return Response({"detail": "User created."}, status=status.HTTP_201_CREATED)
