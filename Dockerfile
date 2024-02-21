FROM public.ecr.aws/lambda/nodejs:20

RUN dnf install -y samba-client 

# RUN smbclient
RUN whereis smbclient

RUN echo $PATH

# Copy function code
COPY dist/index.mjs ${LAMBDA_TASK_ROOT}
  
# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]