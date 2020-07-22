const express = require('express');
const api = express();
const port = 3001;




api.get('/health-check', (req, res) => {
    return res.send('Ok.')
});


api.listen(port, () => console.log(`Example app listening on port ${port}!`));