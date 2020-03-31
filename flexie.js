const axios = require('axios')
const Bottleneck = require("bottleneck")
const config = require('./config')

// Deprecated! No need to use this method anymore.
const sendCallRecordingToFlexie = async (data) => {
	if(config.flexie_url) {

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'apikey': config.flexie_api_key
			},
			data: data,
			url: `${config.flexie_url}/api/call/logs/new`,
		};

		try {
			return await axios(options)
		} catch (e) {
			return new Error(e)
		}

	} else {
		return new Error('There are missing configuration data, please set all required variables in config.json file.');
	}
}

const sendCallLogToFlexie = async (throttle, data) => {
	if(config.flexie_url) {

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'apikey': config.flexie_api_key
			},
			data: data,
			url: `${config.flexie_url}/api/call/logs/new`,
		};

		try {
			return await throttle.schedule( async () => {
				return await axios(options)
			})
		} catch (e) {
			return new Error(e)
		}

	} else {
		return new Error('There are missing configuration data, please set all required variables in config.json file.');
	}
}

const sendMissedCallToFlexie = async (throttle, data) => {
	if(config.missed_calls_dynamic_endpoint) {
		
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'apikey': config.flexie_api_key
			},
			data: data,
			url: config.missed_calls_dynamic_endpoint,
		};

		try {
			return await throttle.schedule( async () => {
				return await axios(options)
			})
		} catch (e) {
			return new Error(e)
		}

	} else {
		return new Error('Missing Dynamic Endpoint URL, if not set there wont be sent any data.');
	}
}

module.exports = {
	sendCallRecordingToFlexie,
	sendCallLogToFlexie,
	sendMissedCallToFlexie,
	apiThrottle: new Bottleneck({
	    minTime: config.api_requests_call_log_throttle || 1500,
		id: "api_requests_call_log_throttle",
		maxConcurrent: 1
	}),
	dynamicEndpointThrottle: new Bottleneck({
	    minTime: config.dynamic_endpoint_requests_throttle || 1500,
		id: "dynamic_endpoint_requests_throttle",
		maxConcurrent: 1
	})
}
