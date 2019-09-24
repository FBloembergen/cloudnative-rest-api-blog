import json
# The AWS SDK for python is boto3
import boto3

TABLE = boto3.resource('dynamodb', region_name='eu-west-1').Table('BlogPosts')


def handler(event, context):
    try:
        response = TABLE.get_item(Key={'id': event['pathParameters']['id']})
        item = response['Item']

        return {
            "statusCode": 200,
            "body": json.dumps(item)
        }
    except KeyError:
        return {
            "statusCode": 404,
            "body": json.dumps({'message': 'Item not found'})
        }
