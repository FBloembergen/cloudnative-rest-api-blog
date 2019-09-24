// Import the AWS sdk in our code
// This is default available in the nodejs Lambda environment
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent } from 'aws-lambda';
// The DocumentClient class makes it easy to communicate with our table.
const dbClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

// May want to expand this headers with CORS headers, e.g. Allowed Origin
const defaultHeaders = { 'Content-Type': 'application/json' }

// The actual handler function invoked by Lambda
exports.handler = async (event: APIGatewayProxyEvent) => {
    try {
        if (!event.pathParameters || !event.pathParameters.id) {
            return {
                statusCode: 400,
                headers: defaultHeaders,
                body: JSON.stringify({ message: 'Could not parse ID from pathParameter' })
            }
        }
        const dbResult = await dbClient.get({
            TableName: 'BlogPosts',
            Key: { id: event.pathParameters.id }
        }).promise();

        if (dbResult.Item) {
            return {
                statusCode: 200,
                headers: defaultHeaders,
                body: JSON.stringify(dbResult.Item)
            };
        }
        return {
            statusCode: 404,
            headers: defaultHeaders,
            body: JSON.stringify({ message: 'Item not found' })
        };
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server Error' })
        };
    }
};