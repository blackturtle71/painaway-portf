from rest_framework import serializers
from .models import BodyStats, BodyPart
from authentication.serializers import UserSerializer
from datetime import datetime

class BodyPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyPart
        fields = '__all__'

class BodyStatsSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = BodyStats
        fields = '__all__'
        read_only_fields = ['owner', 'date_recorded']
        extra_kwargs = {
            'description': {'required': False}
        }

    def validate_pain_type(self, value):
        valid_choices = ['burning', 'stabbing', 'cutting', 'throbbing']
        if value not in valid_choices:
            raise serializers.ValidationError(
                f"Invalid pain type. Must be one of: {valid_choices}"
            )
        return value

    def validate_intensity(self, value):
        if not (0 <= value <= 10):
            raise serializers.ValidationError("Intensity must be between 0 and 10")
        return value

    def update(self, instance, validated_data):
        instance.last_modified = datetime.now() # auto update timestamp
        return super().update(instance, validated_data)