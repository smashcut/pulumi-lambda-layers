FROM public.ecr.aws/lambda/nodejs:20

RUN dnf install -y samba-client 

RUN smbclient --version

# Copy function code
COPY dist/index.js ${LAMBDA_TASK_ROOT}
  
# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]