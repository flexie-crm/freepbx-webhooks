#!/usr/bin/env node

const argv = require('yargs').argv
const flexie = require('./flexie')
const config = require('./config.js')
 
// Get recording details from args
// sent by Asterisk
const callId = argv['call-id']
const recYear = argv['rec-year']
const recMonth = argv['rec-month']
const recDay = argv['rec-day']
const recFilename = argv['rec-filename']

// Check if we getting all data we need from args
if ([callId, recYear, recMonth, recDay, recFilename].every(Boolean)) {

	// Give it some time, so it would make sure that a previous 
	// request (holding call data) is actually sent to Flexie  
	try {

		const recording = {
			call_id: `${callId}`,
			call_recording: `${config.voip_recordings_url}/${recYear}/${recMonth}/${recDay}/${recFilename}`
		}

		setTimeout( async () => { await flexie.sendCallRecordingToFlexie(recording) }, 30000)
	} catch(e) {
		return console.log('There was an error sending recording details to Flexie', e)
	}
    
} else {
	return console.log('There is no recording to send on Flexie, missing variables from args', argv)
}
