import json
# The AWS SDK for python is boto3
import boto3
import uuid

TABLE = boto3.resource('dynamodb', region_name='eu-west-1').Table('BlogPosts')


def handler(event, context):
    if not event['body']:
        return {
            "statusCode": 400,
            "body": json.dumps({'message': 'Bad Request, empty body'})
        }
    id = str(uuid.uuid4())
    newItem = json.loads(event['body'])
    newItem['id'] = id
    TABLE.put_item(
        Item=newItem
    )
    return {
        "statusCode": 201,
        "body": json.dumps({'id': id})
    }
