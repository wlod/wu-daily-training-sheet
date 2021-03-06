"use strict";

class Spreadsheet {

    constructor(gCalSpreadsheet) {
        this.gCalSpreadsheet = gCalSpreadsheet;

        this._initHeaders();
        this._initData();
    }

    _initHeaders() {
        this.headers = [];
        const headerRow = this.gCalSpreadsheet.result.values[0];

        let currentHeaderIndex = -1;
        let i = 0;
        for (; i < headerRow.length; i++) {
            let headerValue = headerRow[i];
            if (typeof headerValue !== "undefined" && headerValue.length > 0) {
                currentHeaderIndex++;
                this.headers.push(new SpreadsheetHeader(headerValue, 1, i, this.gCalSpreadsheet.spreadsheetName));
                continue;
            }
            if (typeof currentHeaderIndex !== "undefined") {
                this.headers[currentHeaderIndex].columns++;
                continue;
            }
        }

        if (GCalSpreadsheet.columnRange(this.gCalSpreadsheet.beginCellChar, this.gCalSpreadsheet.endCellChar).length > i) {
            this.headers[currentHeaderIndex].columns += GCalSpreadsheet.columnRange(this.gCalSpreadsheet.beginCellChar, this.gCalSpreadsheet.endCellChar).length - i;
        }
    }

    _initData() {
        this.data = {};
        this.dataSpreadsheetsDataMap = new Map();

        const spreadsheetRows = this.gCalSpreadsheet.result.values;
        const spreadsheetName = this.gCalSpreadsheet.spreadsheetName;
        // below i = 1 and j = 1 to skip header/row with names and column with dates
        // using sheetRows[j][0] = date; to add date for each row/header data
        for (let i = 1; i < this.headers.length; i++) {

            const spreadsheetHeader = this.headers[i];

            this.data[spreadsheetHeader.name] = [];


            for (let j = 1; j < spreadsheetRows.length; j++) {

                const date = spreadsheetRows[j][0];

                if (typeof this.dataSpreadsheetsDataMap.get(date) === "undefined") {
                    this.dataSpreadsheetsDataMap.set(date, []);
                }

                const rawDataAsArray = [];
                for (let k = 0; k < spreadsheetHeader.columns; k++) {
                    rawDataAsArray.push(spreadsheetRows[j][k + spreadsheetHeader.startIndex]);
                }

                const spreadsheetData = new SpreadsheetData(spreadsheetHeader.name, date, rawDataAsArray, spreadsheetName);

                this.data[spreadsheetHeader.name].push(spreadsheetData);
                this.dataSpreadsheetsDataMap.get(date).push(spreadsheetData);
            }
        }

    }

    get dataSpreadsheetDate() {
        return this.dataSpreadsheetsDataMap;
    }

    get infoHeaders() {
        return this.headers;
    };

    get infoData() {
        let infoData = "";
        for (let key in this.data) {
            if (this.data.hasOwnProperty(key)) {
                infoData += this.data[key] + "\n";
            }
        }
        return infoData;
    };
}

class SpreadsheetData {

    constructor(name, date, rawDataAsArray, spreadsheetName) {
        this.name = name;
        this.date = date;
        this.rawDataAsArray = rawDataAsArray;
        this.spreadsheetName = spreadsheetName;
        this.isVisible = true;
        this.containsStartTime = false;

        this._initStartTime();
        this._initIcons();
        this._initViewData();
    }

    // TODO split
    _initStartTime() {
        if (SPREADSHEET_CONF.SPREADSHEETS_SUPPORT_START_TIME.includes(this.spreadsheetName)) {
            const startTimeOrDurationColumn = SPREADSHEET_CONF[START_TIME_COLUMN_PREFIX + this.spreadsheetName];
            let startTimeOrDurationRaw = this.rawDataAsArray[startTimeOrDurationColumn];

            if (typeof startTimeOrDurationRaw === "undefined" || startTimeOrDurationRaw === SPREADSHEET_CONF.SPREADSHEET_CELL_VALUE_EMPTY) {
                return;
            }

            if (SPREADSHEET_CONF.SPREADSHEET_TRAINING === this.spreadsheetName && SPREADSHEET_CONF.TRAINING_HEADER_INFORMATION_COLUMNS === this.name) {
                return;
            }

            if (SPREADSHEET_CONF.SPREADSHEET_TRAINING === this.spreadsheetName) {
                startTimeOrDurationRaw = startTimeOrDurationRaw.split("-")[0];
            }

            // TODO remove weight marker 'b' from pool
            this.startTime = startTimeOrDurationRaw.replace('b', '');
            this.containsStartTime = true;
        }
    }

    _initIcons() {
        this.itemTitleIcon = SPREADSHEET_CONF[ICONS_KEY][this.name];
        if (typeof this.itemTitleIcon === "undefined") {
            this.itemTitleIcon = SPREADSHEET_CONF.DEFAULT_ICON;
        }
    }

    // TODO split
    _initViewData() {
        this.viewData = {};

        if (SPREADSHEET_CONF.COLUMNS_TO_SHOW_NAME_IN_DETAILS.includes(this.name)) {
            this.viewData['name'] = this.name;
        }

        if (typeof this.rawDataAsArray === "undefined" || this.rawDataAsArray === null) {
            return;
        }

        const skipColumns = [];

        if (SPREADSHEET_CONF.SPREADSHEETS_SUPPORT_START_TIME.includes(this.spreadsheetName)) {
            const startTimeOrDurationColumn = SPREADSHEET_CONF[START_TIME_COLUMN_PREFIX + this.spreadsheetName];
            const startTimeOrDurationRaw = this.rawDataAsArray[startTimeOrDurationColumn];
            if (SPREADSHEET_CONF.SPREADSHEET_TRAINING === this.spreadsheetName && startTimeOrDurationRaw !== SPREADSHEET_CONF.SPREADSHEET_CELL_VALUE_EMPTY) {
                // TODO move value "duration" to confView
                this.viewData["duration"] = startTimeOrDurationRaw;
                try {
                    const startTimeOrDurationRawAsArray = startTimeOrDurationRaw.split("-");
                    this.viewData["time(min.)"] = SpreadsheetUtils.minutesBetweenHours(startTimeOrDurationRawAsArray[0].trim(), startTimeOrDurationRawAsArray[1].trim());
                } catch (e) {
                    console.log(e);
                }
            }
            skipColumns.push(parseInt(startTimeOrDurationColumn));
        }

        // TODO move hmm to confView
        if (SPREADSHEET_CONF.SPREADSHEET_WEIGHT === this.spreadsheetName) {
            this.viewData[WEIGHT_VIEW_KEY] = this.rawDataAsArray[0];
            skipColumns.push(0);
        }
        const labelNames = SPREADSHEET_CONF[LABELS_KEY][this.name];
        let labelIndex = -1;
        for (let i = 0; i < this.rawDataAsArray.length; i++) {
            if (skipColumns.indexOf(i) !== -1) {
                continue;
            }
            if (typeof this.rawDataAsArray[i] === 'undefined' || SPREADSHEET_CONF.SPREADSHEET_CELL_VALUE_EMPTY === this.rawDataAsArray[i]) {
                continue;
            }

            const multiData = this.rawDataAsArray[i].split(SPREADSHEET_CELL_MULTIDATA_DELIMITER);
            for (let j = 0; j < multiData.length; j++) {
                labelIndex++;
                if (typeof multiData[j] === 'undefined' || SPREADSHEET_CONF.SPREADSHEET_CELL_VALUE_EMPTY === multiData[j]) {
                    continue;
                }

                let labelName = SPREADSHEET_CONF[LABELS_KEY]['DEFAULT_LABEL'] + "(" + labelIndex + ")";
                if (typeof labelNames !== "undefined" && typeof labelNames[labelIndex] !== "undefined") {
                    labelName = typeof labelNames === "string" ? labelNames : labelNames[labelIndex];
                }

                if (SPREADSHEET_CONF[LABELS_KEY]['PICTURE_LABEL'] === labelName) {
                    multiData[j] = SpreadsheetData._prepareSpreadsheetImage(multiData[j], this.name + " - " + this.startTime + " (" + this.date + ")");
                }

                this.viewData[labelName] = multiData[j];
            }
        }
    }

    static _prepareSpreadsheetImage(rawImageUrls, activityDescription) {
        const preparedImageUrls = [];
        const rawImageUrlsAsArray = rawImageUrls.split(";");

        for (let i = 0; i < rawImageUrlsAsArray.length; i++) {
            try {
                const rawImageUrl = rawImageUrlsAsArray[i].trim();

                if (!rawImageUrl) {
                    continue;
                }

                const imageId = rawImageUrl.match(GOOGLE_DRIVE_IMAGE_LINK_PATTERN)[1];
                const imageToView = GOOGLE_DRIVE_HTML_IMG_LINK_PATTERN.replace("{{ID}}", imageId);
                preparedImageUrls.push(new SpreadsheetImage(imageToView, "[" + (i+1) + "] " + activityDescription));
            } catch (e) {
                console.warn(rawImageUrlsAsArray.length + " - " + rawImageUrlsAsArray);
                console.warn(e);
            }
        }
        return preparedImageUrls;
    }

    toString() {
        return "SheetData: [name: " + this.name + ", date: " + this.date + ", rawDataAsArray: " + this.rawDataAsArray + ", spreadsheetName: " + this.spreadsheetName + ", itemTitleIcon: " + this.itemTitleIcon + "]";
    }

}

class SpreadsheetHeader {

    constructor(name, columns, startIndex, spreadsheetName) {
        this.name = name;
        this.columns = columns;
        this.startIndex = startIndex;
        this.spreadsheetName = spreadsheetName;
    }

    toString() {
        return "DateSheetHeader: [name: " + this.name + ", columns: " + this.columns + ", startIndex: " + this.startIndex + ", spreadsheetName: " + this.spreadsheetName + "]";
    }

}

class SpreadsheetImage {

    constructor(url, description) {
        this.url = url;
        this.description = description;
    }

    toString() {
        return "Image: [url: " + this.url + ", description: " + this.description + "]";
    }

}