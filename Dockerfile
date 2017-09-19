FROM node:6.11.2-alpine
LABEL maintainer="chenxingyu92@gmail.com"

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org

# Prepare dirs

ENV BUILD_DIR=/tmp/app \
    HOME_DIR=/var/app

RUN mkdir -p $BUILD_DIR && \
    mkdir -p $HOME_DIR

# Prepare deps

WORKDIR $BUILD_DIR
COPY package.json $BUILD_DIR
RUN cnpm install --production && \
    cp -a ./node_modules ./node_modules-prod && \
    cnpm install

# Variables

# Should always be defined in docker-comopse.yml
# ENV DB=mysql://root@mysql/caf

# CDN prefix
# It's a build-time argument, which will be persist in the build artifacts and
# can not be overridden by 'environment'
ARG ASSETS_CDN=/assets

ENV NODE_ENV=production \
    PORT=80 \
    ASSETS_CDN=$ASSETS_CDN

# Build

COPY . $BUILD_DIR
RUN npm run build && \
    rm -rf ./node_modules && \
    mv ./build $HOME_DIR/ && \
    mv ./dist $HOME_DIR/ && \
    cp -a ./views $HOME_DIR/ && \
    cp -a ./package.json $HOME_DIR/ && \
    cp -a ./node_modules-prod $HOME_DIR/node_modules

# Finish

WORKDIR $HOME_DIR

CMD ["npm", "start"]

EXPOSE 80
