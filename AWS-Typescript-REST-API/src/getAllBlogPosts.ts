// Import the AWS sdk in our code
// This is default available in the nodejs Lambda environment
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent } from 'aws-lambda';
// The DocumentClient class makes it easy to communicate with our table.
const dbClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

// May want to expand these headers with CORS headers, e.g. Allowed Origin
const defaultHeaders = { 'Content-Type': 'application/json' }

// The actual handler function invoked by Lambda
exports.handler = async (_event: APIGatewayProxyEvent) => {
  try {
    const items = await dbClient.scan({
      TableName: 'BlogPosts'
    }).promise();

    // When using Lambda Proxy Integration there is a required format
    // https://docs.aws.amazon.com/en_pv/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({ items: items.Items })
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server Error' })
    };
  }
};