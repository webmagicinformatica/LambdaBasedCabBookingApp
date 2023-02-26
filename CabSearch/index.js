const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = async (event) => {
    const { source, destination, seats } = event.queryStringParameters;
    const params = {
        TableName: 'CabTable',
        FilterExpression: 'availableSeats >= :seats',
        ExpressionAttributeValues: { ':seats': parseInt(seats) }
    };

    try {
        const data = await docClient.scan(params).promise();
        const cabs = data.Items.filter((cab) => {
            return cab.availableSeats >= parseInt(seats) &&
                   cab.status === 'available' &&
                   cab.currentLocation === source &&
                   cab.destination === destination;
        });

        return {
            statusCode: 200,
            body: JSON.stringify(cabs)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Unable to search for cabs.' })
        };
    }
};
