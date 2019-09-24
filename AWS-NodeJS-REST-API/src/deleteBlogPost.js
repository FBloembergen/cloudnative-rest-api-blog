// Import the AWS sdk in our code
// This is default available in the nodejs Lambda environment
const AWS = require('aws-sdk');
// The DocumentClient class makes it easy to communicate with our table.
const dbClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

// The actual handler function invoked by Lambda
exports.handler = async event => {
    try {
        await dbClient.delete({
            TableName: 'BlogPosts',
            Key: { id: event.pathParameters.id }
        }).promise();

        return {
            statusCode: 204,
            body: undefined
        };
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server Error' })
        };
    }
};