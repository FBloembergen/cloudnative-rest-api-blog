// Import the AWS sdk in our code
// This is default available in the nodejs Lambda environment
const AWS = require('aws-sdk');
// The DocumentClient class makes it easy to communicate with our table.
const dbClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

// May want to expand this headers with CORS headers, e.g. Allowed Origin
const defaultHeaders = { 'Content-Type': 'application/json' }

// The actual handler function invoked by Lambda
exports.handler = async event => {
    try {
        const incomingChanges = JSON.parse(event.body);
        const expressionAttributeValues = {};
        Object
            .entries(incomingChanges)
            .forEach(([key, value]) => expressionAttributeValues[`:${key}`] = value);

        const array = Object
            .keys(incomingChanges)
            .map(key => `${key} = :${key}`);
        const updateExpression = `set ${array.join(',')}`;

        await dbClient.update({
            TableName: 'BlogPosts',
            Key: { id: event.pathParameters.id },
            ExpressionAttributeValues: expressionAttributeValues,
            UpdateExpression: updateExpression,
        }).promise();

        return {
            statusCode: 200,
            headers: defaultHeaders,
            body: JSON.stringify({ message: `Blog Post ${event.pathParameters.id} updated` })
        };
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server Error' })
        };
    }
};