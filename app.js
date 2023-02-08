const express = require("express");
const gsheet = require('./src/utils/GoogleSheet');

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
    var sheet = await gsheet.reader(
        '1EReYzcNRKNO2w_vxI-MNs7Ri-L9czmUN82cdbZBT3ys',
        'Image!A1:Z1000'
    );
    console.log(JSON.stringify(sheet));
    res.send(JSON.stringify(sheet));
});


app.listen(port, () => {
    console.log("Starting node.js at port " + port);
});