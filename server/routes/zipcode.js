var express = require('express');
var https = require('https');

var router = express.Router();

/*
 * GET /api/zipcode/:zipCode
 * Example: /api/zipcode/32816
 */
router.get('/:zipCode', function (req, res) {
    var zipCode = req.params.zipCode;

    // Validate ZIP code
    if (!/^\d{5}$/.test(zipCode)) {
        return res.status(400).json({
            success: false,
            error: 'ZIP code must contain exactly five digits.'
        });
    }

    var apiUrl = 'https://api.zippopotam.us/us/' + zipCode;

    https.get(apiUrl, function (apiResponse) {

        var body = '';

        apiResponse.on('data', function (chunk) {
            body += chunk;
        });

        apiResponse.on('end', function () {

            if (apiResponse.statusCode === 404) {
                return res.status(404).json({
                    success: false,
                    error: 'ZIP code not found.'
                });
            }

            try {

                var data = JSON.parse(body);

                res.json({
                    success: true,
                    zipCode: data["post code"],
                    city: data.places[0]["place name"],
                    state: data.places[0]["state"],
                    abbreviation: data.places[0]["state abbreviation"],
                    latitude: data.places[0]["latitude"],
                    longitude: data.places[0]["longitude"]
                });

            } catch (err) {

                res.status(500).json({
                    success: false,
                    error: 'Unable to parse API response.'
                });

            }

        });

    }).on('error', function () {

        res.status(500).json({
            success: false,
            error: 'Unable to connect to ZIP code service.'
        });

    });

});

module.exports = router;