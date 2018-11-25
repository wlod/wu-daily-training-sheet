"use strict";

// Client ID and API key from the Developer Console
const CLIENT_ID = '418597576423-5nv3ndftur1f3n8avthqq1o4uopjaf01.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDMgqOEObXEA-nSA7rr19IGZziiuEJAwu0';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [ "https://sheets.googleapis.com/$discovery/rest?version=v4" ];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

// Spreadsheet ID
// Public doc: https://docs.google.com/spreadsheets/d/1W2lIqTBXORVBdAM1AaGQIY4KzDRYCqTDN8NUYEm4jt8/edit#gid=1777293991
const SPREADSHEET_ID = "1W2lIqTBXORVBdAM1AaGQIY4KzDRYCqTDN8NUYEm4jt8";

// Configuration
const APP_CONFIGURATION_SPREADSHEET = "cfg!D2:E1000";
const RANGE_CONFIGURATION_SPREADSHEET = "cfg!A2:B1000";
const LABEL_CONFIGURATION_SPREADSHEET = "cfg!G2:H1000";
const ICON_CONFIGURATION_SPREADSHEET = "cfg!J2:K1000";



const GOOGLE_DRIVE_HTML_IMG_LINK_PATTERN = "https://drive.google.com/uc?id={{ID}}&export=download"
const GOOGLE_DRIVE_IMAGE_LINK_PATTERN = /https:\/\/drive.google.com\/file\/d\/(.*?)\/view\?usp=sharing/;

// Unmodifiable spreadsheet configuration
const SPREADSHEET_CELL_MULTIDATA_DELIMITER = "\n";
const SPREADSHEET_CELL_MULTIDATA_COMMENT = "#";
const SPREADSHEET_CELL_KEY_VALUE_DELIMITER = ":";

const WEIGHT_VIEW_KEY = "weight";
const LABELS_KEY = "labels";
const ICONS_KEY = "icons";
const START_TIME_COLUMN_PREFIX = "START_TIME_COLUMN_";