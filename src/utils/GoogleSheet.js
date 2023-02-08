const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

function authorize(credentials) {
    console.log('authorize');
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    try {
        var token = fs.readFileSync(TOKEN_PATH);
    } catch(err) {
        if (err)return getNewToken(oAuth2Client);
    } 
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
}

async function getNewToken(oAuth2Client) {
    console.log('getNewToken');
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', async (code) => {
        rl.close();
        await oAuth2Client.getToken(code, async(err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            return oAuth2Client;
        });
    });
}

async function reader(sheetId, range) {
    console.log('reader');
    var content = fs.readFileSync('credentials.json');
    var auth = authorize(JSON.parse(content));
    var req = {spreadsheetId: sheetId,range: range,}
    const sheets =  google.sheets({ version: 'v4', auth });
    var res = (await sheets.spreadsheets.values.get(req)).data
    var data = res.values;
    var header = new Array();
    var arrObj = new Array();

    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (i == 0) {
            header = element
        } else {
            var obj = new Array();
            for (let j = 0; j < element.length; j++) {
                const values = element[j];
                obj[header[j]] = values;
            }
            arrObj.push(Object.assign({}, obj))
        }
    }
    return arrObj;
}

module.exports = { reader };