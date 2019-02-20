import boto3
from botocore.client import Config
from config_vars import AMAZON_AWS_BUCKET, AMAZON_AWS_KEY, AMAZON_AWS_REGION, AMAZON_AWS_SECRET_KEY, \
    AMAZON_AWS_KEY_PATH


S3 = boto3.resource(
            's3',
            region_name=AMAZON_AWS_REGION,
            aws_access_key_id=AMAZON_AWS_KEY,
            aws_secret_access_key=AMAZON_AWS_SECRET_KEY,
            config=Config(signature_version='s3v4')
        )


# Code to make bucket public read
# BUCKET.Acl().put(ACL='public-read')
