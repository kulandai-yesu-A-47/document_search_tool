import os
from rest_framework import serializers
from django.conf import settings
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    filename = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "file",
            "filename",
            "file_url",
            "file_type",
            "content",
            "tags",
            "created_at"
        ]
        read_only_fields = ["content", "created_at", "filename", "file_url"]

    def validate_file(self, value):
        max_size_mb = getattr(settings, 'MAX_UPLOAD_SIZE_MB', 25)
        max_size_bytes = max_size_mb * 1024 * 1024
        if value.size > max_size_bytes:
            raise serializers.ValidationError(
                f'File size must not exceed {max_size_mb} MB.'
            )
        return value

    def get_filename(self, obj):
        return os.path.basename(obj.file.name) if obj.file and getattr(obj.file, "name", None) else ""

    def get_file_url(self, obj):
        request = self.context.get("request")
        if obj.file:
            try:
                if request:
                    return request.build_absolute_uri(obj.file.url)
                return obj.file.url
            except Exception:
                # fallback to name
                return getattr(obj.file, "name", "") or ""
        return ""
