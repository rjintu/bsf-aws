import os
import io
import boto3
import json
import csv

# grab environment variables
# ENDPOINT_NAME = os.environ['ENDPOINT_NAME']
runtime = boto3.client('runtime.sagemaker')

def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    # print(ENDPOINT_NAME)

    payload = json.loads(json.dumps(event))
    print(payload)
    payload = json.dumps(payload).encode('utf-8')


    response = runtime.invoke_endpoint(EndpointName="paiper-2020-08-05-18-52-17-419",
                                       ContentType='application/json',
                                       Body=payload)
    print(response)
    result = json.loads(response['Body'].read().decode())
    print(result)

    return result
