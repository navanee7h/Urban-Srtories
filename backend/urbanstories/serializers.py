from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from orders.models import UserProfile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    country_code = serializers.CharField(write_only=True, required=False, allow_blank=True)
    phone_number = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password_confirm', 'email', 'first_name', 'last_name', 'country_code', 'phone_number')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        country_code = validated_data.pop('country_code', '')
        phone_number = validated_data.pop('phone_number', '')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user, country_code=country_code, phone_number=phone_number)
        return user

class UserSerializer(serializers.ModelSerializer):
    country_code = serializers.CharField(source='profile.country_code', read_only=True)
    phone_number = serializers.CharField(source='profile.phone_number', read_only=True)
    measurements = serializers.JSONField(source='profile.measurements', required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'country_code', 'phone_number', 'measurements')

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        
        # Update user instance fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update nested profile fields if provided
        if profile_data:
            profile = instance.profile
            if 'measurements' in profile_data:
                profile.measurements = profile_data['measurements']
            profile.save()
            
        return instance
