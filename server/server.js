const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
console.log(__dirname)

app.use(express.static(path.join(__dirname, '../build')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
 });
 
app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
 });