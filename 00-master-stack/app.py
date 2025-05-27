#!/usr/bin/env python3
import os
import aws_cdk as cdk
from lib.master_stack import MasterStack

app = cdk.App()

MasterStack(app, "AudioVideoEmbeddingsMasterStack",
    env=cdk.Environment(
        account=os.environ.get("CDK_DEFAULT_ACCOUNT"),
        region=os.environ.get("CDK_DEFAULT_REGION")
    ),
    description="Master stack that orchestrates the deployment of all audio/video processing stacks"
)

app.synth()
