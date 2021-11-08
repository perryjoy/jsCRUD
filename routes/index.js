'use strict';
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

var __data_parsed = -1;



router.get('/', function (req, res) {
	res.render('index', { data: { title: 'Karaev YG 5030102/80201', tab: __data_parsed } });
	if (__data_parsed == -1) {
		loadData();
	}    
});

router.get('/data', function (req, res) {
	if (__data_parsed == -1) {
		loadData();
	}
	res.send(generate_table(__data_parsed));
});

router.get('/data/[0-9]+', function (req, res, next) {
	var records = __data_parsed.data.record;

	if (__data_parsed == -1) {
		loadData();
	}

	var ind = req.path.split('/')[2];
	var pos = search(ind);
	if (records[pos].id != ind) {
		next(req);
    }
	res.send(records[pos].station + ',' +
		records[pos].date.year + ',' +
		records[pos].date.month + ',' +
		records[pos].date.day + ',' +
		records[pos].temperature);
});

router.delete('/data/[0-9]+', function (req, res, next) {
	var records = __data_parsed.data.record;

	if (__data_parsed == -1) {
		loadData();
	}

	var ind = req.path.split('/')[2];
	var pos = search(ind);
	if (records[pos].id != ind) {
		next(req);
	}
	records.splice(pos, 1);
	res.send('done');
});

router.patch('/data/[0-9]+', function (req, res, next) {
	var records = __data_parsed.data.record;

	if (__data_parsed == -1) {
		loadData();
	}

	var ind = req.path.split('/')[2];
	var pos = search(ind);
	if (records[pos].id != ind) {
		next(req);
	}
	records[pos].date.year = Number(req.body.year);
	records[pos].date.month = Number(req.body.month);
	records[pos].date.day = Number(req.body.day);
	records[pos].station = Number(req.body.station);
	records[pos].temperature = Number(req.body.temp);
	res.send('done');
});

router.post('/data', function (req, res, next) {
	var records = __data_parsed.data.record;

	if (__data_parsed == -1) {
		loadData();
	}


	var pos = records[records.length-1].id + 1;
	records.push({
		id : pos,
		station: Number(req.body.station),
		date: {
			year: Number(req.body.year),
			month: Number(req.body.month),
			day: Number(req.body.day),
		},
		temperature: Number(req.body.temp)
	});
	res.send('done');
});

function search(ind) {
	var records = __data_parsed.data.record;
	var last = records.length;
	var first = 0;
	var mid = Math.floor(last / 2);
	while (first + 1 < last) {
		if (records[mid].id > ind) {
			last = mid;
		}
		else {
			first = mid;
		}
		mid = Math.floor((first + last) / 2);
	}
	return first;
}


function abs(val) {
	if (val < 0) {
		return -val;
	}
	return val;
}

function parserHelper(key, value) {
	if (key == 'station' || key == 'year' || key == 'month' || key == 'day' || key == 'id') {
		return abs(Number(value));
	}
	if (key == 'temperature') {
		return Number(value);
	}
	return value;
}

function loadData() {
	if (__data_parsed == -1) {
		fs.readFile(path.join(global.appRoot, "public/data.json"), 'utf8', function (err, data) {
			if (err) throw err;
			__data_parsed = JSON.parse(data, parserHelper);
			saveData();
		});
	}
}

function generate_table(data) {
	if (data == -1) {
		return ''
	}
	data = data.data;
	//console.log(__data_parsed);

	var i;
	var table = "<tr><th>id</th><th>station</th><th>y</th><th>m</th><th>d</th><th>temp</th></tr>";

	//console.log(x);

	for (i = 0; i < data.record.length; i++) {
		table += "<tr>" +
			"<td>" +
			data.record[i].id +
			"</td>" +
			"<td>" +
			data.record[i].station +
			"</td>" +
			"<td>" +
			data.record[i].date.year +
			"</td>" +
			"<td>" +
			data.record[i].date.month +
			"</td>" +
			"<td>" +
			data.record[i].date.day +
			"</td>" +
			"<td>" +
			data.record[i].temperature +
			"</td>" +
			"</tr>";
	}
	return table;
}


function saveData() {
	console.log('files are going to be saved');

	if (__data_parsed != -1) {
		fs.writeFile(path.join(global.appRoot, "public/data_edited.json"), JSON.stringify(__data_parsed, null, 2), function (err) {
			if (err) {
				console.log(err);
			}
		});
	}
}

module.exports = router;




