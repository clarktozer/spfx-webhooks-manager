## spfx-webhooks-manager

SharePoint framework webpart for managing webhooks for a site

![Webhooks Manager](./demo.gif)


### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

```bash
gulp clean
gulp test
gulp serve
gulp bundle
gulp package-solution
```

### Run from localhost

Deploy the app to the SharePoint app catalog.

Create a webpart page and add the webpart. The files to run the webpart will be served from localhost.

You will also need to change the JSOM external urls in the config.json to be your site collection.

```bash
gulp clean
gulp serve --nobrowser
```
