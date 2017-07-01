const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const strip = require("strip-comments");
const shuffle = require("shuffle-array");
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const template = fs.readFileSync("index.html", "utf-8");

var result = "";

app.get("/", (req, res) => {
	res.send(template.replace("[result_tag]", result));
	result = "";
});
app.post("/", (req, res) => {
    result = "Tên chi đoàn: " + req.body.school + "\n";
    result += "Tên lớp: " + req.body.class + "\n";
    result += "Tên: " + req.body.name + "\n";
    result += '<p style="text-align:center; font-size:36px"><b>Bài thu hoạch cảm tình Đoàn</b></p>';
    let arr = (fs.readFileSync("hackathon/list.txt", "utf-8")).split(/\r?\n/);
    let path = "hackathon/" + strip(arr[req.body.q]) + "/";
    let qname = (fs.readFileSync(path + "name.txt"));
    result += '<p style="font-size :24px">'; 
    result += qname;
    result += '</p>';
    let list = (fs.readFileSync(path + "list.txt", "utf-8")).split(/\r?\n/);
    let ran = Math.random();
    for (let j = ((ran > 0.5) ? 1 : 0); j < list.length; ++j) {
		if (list[j] == "") continue;
        let s = (fs.readFileSync(path+list[j]+".txt", "utf-8")).split("...")
        result += s[1]; // title
		let cnt = +(s[0]); // convert to number
        let s1 = shuffle(s.slice(2, s.length));
        while (cnt --> 0) {
			result = result + s1[cnt];
		}
    }
    res.redirect("/");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
