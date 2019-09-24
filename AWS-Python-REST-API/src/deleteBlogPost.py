import json
# The AWS SDK for python is boto3
import boto3
import uuid

TABLE = boto3.resource('dynamodb', region_name='eu-west-1').Table('BlogPosts')


def handler(event, context):
    TABLE.delete_item(
        Key={
            'id': event['pathParameters']['id'],
        }
    )
    return {
        "statusCode": 204,
        "body": None
    }
