# Overview

## Getting started

1. Make sure you are using node 7, install packages and start the development server

    ```Shell
    nvm use
    npm i
    npm run start
    ```

## usage

Open [localhost:3000](http://localhost:3000) to see the demo.

  - Edit the text in the first box. By copy & pasting or by writing on the keyboard.
    You can use short-commands for bold and cursive if you like.
  - To add a comment, select some text: with the keyboard, by double clicking
    a word or selecting a line or paragraph. A toolbar with a single icon will appear above the selected text, click it to add a comment.
  - Enter text and hit enter or press Save comment.
  - Comments will appear in a list below the text.
  - Click `Select in document` to show where the comment is added. The toolbar
    will appear and give you the option to delete or edit comment.

### Building & Deploying
From react bolierplate:

1. Run `npm run build`, which will compile all the necessary files to the
`build` folder.

2. Upload the contents of the `build` folder to your web server's root folder.

### Structure

The app structure is based on [React Bolierplate](https://github.com/react-boilerplate/react-boilerplate)

### CSS

[TypeStyle](http://typestyle.io/#/) is used for styling components. It is pretty
nice, but i will be using regualr stylus for my next project.

### Editor

The editor uses [draft-js](https://draftjs.org/) as the main framework. Comment functionality and the toolbar is not part of the framework.

### Browser support

Tested on:
- OS X
  - Chrome
  - Safari
  - FireFox.

- Windows 10
  - Edge

Will not work in IE11 but there are polyfills to fix this issue. Can´t test due
to lack of old windows computers in the archipelago.

## Assumptions and bugs hiding as features

## Browser support
Developed on Chrome and only tested on desktop browsers. Interacting with text selection in mobile devices is  very different and might not work as expected.

### Selecting text
- Best way to edit or deleting a comment is to use the `Select in document` button in the comment list.
- Selecting text that contains some commented parts will replace the old comment
with a new one so nested comments are not possible.
- Selecting a comment but including for example a blank before will not bring up the delete option. The first letter in the selected text must be part of a comment to be able to edit it.

- Comments are not escaped and html and js code can be injected directly to the DOM.
