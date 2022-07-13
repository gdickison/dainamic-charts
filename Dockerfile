# base image
FROM node:16.13.1-alpine
# working directory
WORKDIR /Users/gdickison/Projects/Dainamic/dainamic-charts
# add binaries to $PATH
ENV PATH /Users/gdickison/Projects/Dainamic/dainamic-charts/node_modules/.bin:$PATH
# install and cache app dependencies
COPY package.json /Users/gdickison/Projects/Dainamic/dainamic-charts/
COPY yarn.lock /Users/gdickison/Projects/Dainamic/dainamic-charts/
RUN yarn install
# copy app files and build
COPY . /Users/gdickison/Projects/Dainamic/dainamic-charts
RUN yarn build
CMD [ "yarn", "start" ]