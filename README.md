# drag-drop-project-typescript

    Nodejs with TypeScript project creation

# Setup NodeJS with TypeScript

npm init

npm install typescript --save-dev

npx tsc --init --rootDir ./src --outDir ./dist --esModuleInterop --resolveJsonModule --lib es6 --module commonjs --allowJs true --noImplicitAny true

# web Pack Setup

npm i --save-dev webpack webpack-cli webpack-dev-server typescript ts-loader

# to delete dist file before creating new prod build

npm i clean-webpack-plugin --save-dev
