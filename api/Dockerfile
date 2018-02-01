#Pull Image
FROM node:alpine

COPY ./* /api/

RUN cd api/ && npm install --quiet

ENTRYPOINT cd api/ && npm start
