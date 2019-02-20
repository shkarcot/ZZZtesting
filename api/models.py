# from django.db import models
# from django.core.exceptions import ValidationError
# #from django.contrib.auth.models import User
# # Create your models here.
#
#
# def validate_lower_under_score(value):
#
#     if not (value.replace("_", "").islower() and value.replace("_", "").isalpha()):
#         raise ValidationError("Lower case and underscore only")
#
#
# class S3Bucket(models.Model):
#
#     bucket = models.CharField(max_length=255, unique= True)
#
#     def __str__(self):
#         return self.bucket
#
#
# USER_TYPE_CHOICES = [("se", "Solution_Engineer"),
#                      ("bu", "Business_User"),
#                      ("sv", "Supervisor_User")]
#
#
# class Solution(models.Model):
#     solution_id = models.CharField(max_length=255, unique=True)
#     solution_name = models.CharField(max_length=255, unique=True)
#     solution_type = models.CharField(max_length=255)
#     description = models.TextField()
#     deleted = models.BooleanField()
#     timestamp = models.DateTimeField(auto_now_add=True)
#     hocr_type = models.CharField(max_length=255, default="XPMS")
# #
# #
# # class SolutionUser(models.Model):
# #     solution_user = models.OneToOneField(User, on_delete=models.DO_NOTHING)
# #     solution = models.ManyToManyField(Solution)
# #     user_type = models.CharField(max_length=4, choices=USER_TYPE_CHOICES)
#
#
#
#
#
#
#
#
#
#
