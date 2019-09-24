// Import the AWS sdk in our code
// This is default available in the nodejs Lambda environment
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { APIGatewayProxyEvent } from 'aws-lambda';
// The DocumentClient class makes it easy to communicate with our table.
const dbClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

// May want to expand this headers with CORS headers, e.g. Allowed Origin
const defaultHeaders = { 'Content-Type': 'application/json' }

// The actual handler function invoked by Lambda
exports.handler = async (event: APIGatewayProxyEvent) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                headers: defaultHeaders,
                body: JSON.stringify({ message: 'Bad Request' })
            }
        }
        // Create our own ID since this is a new item.
        const id = uuid()

        const dbResult = await dbClient.put({
            TableName: 'BlogPosts',
            Item: { ...JSON.parse(event.body), id }
        }).promise();

        if (dbResult) {
            return {
                statusCode: 201,
                headers: defaultHeaders,
                body: JSON.stringify({ id: id })
            };
        }
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server Error' })
        };
    }
};