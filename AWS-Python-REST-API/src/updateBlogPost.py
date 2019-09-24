import json
# The AWS SDK for python is boto3
import boto3

TABLE = boto3.resource('dynamodb', region_name='eu-west-1').Table('BlogPosts')


def handler(event, context):
    if not event['body']:
        return {
            "statusCode": 400,
            "body": json.dumps({'message': 'Bad Request, empty body'})
        }
    try:
        incomingChanges = json.loads(event['body'])
        expressionAttributeValues = {}
        updateExpressionList = list()
        for k, v in incomingChanges.items():
            expressionAttributeValues[f':{k}'] = v
            updateExpressionList.append(f'{k} = :{k}')
        updateExpression = f"SET {', '.join(updateExpressionList)}"
        TABLE.update_item(
            Key={
                'id': event['pathParameters']['id']
            },
            UpdateExpression=updateExpression,
            ExpressionAttributeValues=expressionAttributeValues
        )

        return {
            "statusCode": 200,
            "body": json.dumps({'message': f"Blog Post {event['pathParameters']['id']} updated"})
        }
    except KeyError:
        return {
            "statusCode": 404,
            "body": json.dumps({'message': 'Item not found'})
        }
