import { APIGatewayEvent } from 'aws-lambda';
import imageType from 'image-type';
import axios from 'axios';

export const main = async (event: APIGatewayEvent) => {
    const queryString = event.queryStringParameters;
    try {
        const result = await fetchImage(queryString.url);
        const type = imageType(result[1]);

        if (type) {
          return {
            statusCode: 200,
            headers: {
              'Content-Type': type.mime,
              'Access-Control-Allow-Methods': '*',
              'Access-Control-Allow-Origin': '*',
            },
            body: result[1].toString('base64'),
            isBase64Encoded: true,
          };
        }
        else {
          return {
            statusCode: 200,
            headers: result[0],
            body: result[1].toString(),
          };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: 'unable to return the image',
        };
    }
};

const fetchImage = (imageURL: string) => {
    return axios
        .get(imageURL, { responseType: 'arraybuffer' })
        .then(response => [response.headers, Buffer.from(response.data, 'base64')]);
};
