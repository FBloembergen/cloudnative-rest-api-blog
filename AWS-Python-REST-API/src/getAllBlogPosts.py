import json
import boto3

TABLE = boto3.resource('dynamodb', region_name='eu-west-1').Table('BlogPosts')


def handler(event, context):
    response = TABLE.scan()
    items = response['Items']

    response = {
        "statusCode": 200,
        "body": json.dumps({'items': items})
    }

    return response
