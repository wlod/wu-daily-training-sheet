# wu-daily-training-spreadsheet

Experimental google docs/drive and vuejs

Demo:
- https://wu-daily-training-sheet.wlodi.net
- https://wu-daily-training-sheet.wlodi.net/index.html?devopt=noimage (without images from google drive)

## Dependencies

JS Libraries:

- Vue.js
- Google API
- Views (https://github.com/adrianklimek/views)
- lazysizes (https://github.com/aFarkas/lazysizes)

CSS:

- Icons & font from Google (Material+Icons, Roboto)

DEV:

- http-server (https://github.com/indexzero/http-server)

## Google

### Install on AppEngine

0. Create Google project

1. Hosting a static website on Google App Engine
 
Use instruction on website "Hosting a static website on Google App Engine":
- https://cloud.google.com/appengine/docs/standard/python/getting-started/hosting-a-static-website

Example commands on Ubuntu or Windows Ubuntu Bash:

> // Create an environment variable for the correct distribution
> export CLOUD_SDK_REPO="cloud-sdk-$(lsb_release -c -s)"

> // Add the Cloud SDK distribution URI as a package source
> echo "deb http://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list

> Import the Google Cloud public key
> curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -

> // Update and install the Cloud SDK: 
> sudo apt-get update && sudo apt-get install google-cloud-sdk

> // Init gcloud - run in project
> gcloud init

> // Deploy app or deploy with other path XXX.yaml
> gcloud app deploy
> gcloud app deploy XXX.yaml

> // Link to web browser
> gcloud app browse

2. Copy Spreadsheet from https://docs.google.com/spreadsheets/d/1W2lIqTBXORVBdAM1AaGQIY4KzDRYCqTDN8NUYEm4jt8/edit#gid=1777293991 (for this example it should be public)  

3. Clone code by Git or [Download ZIP](https://github.com/wlod/wu-daily-training-spreadsheet/archive/master.zip)

4. Change settings in js/gdocs/GApiConf.js, below values should be change: 

- CLIENT_ID
- API_KEY
- SPREADSHEET_ID


### Google Drive - check limits:

 - Go to: https://console.developers.google.com/cloud-resource-manager
 - Choose your project
 - Choose [Limits] from left menu
