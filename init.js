const AsteriskAmi = require('asterisk-ami')
const config = require('./config')
const flexie = require('./flexie')

const dynamicEndpointThrottle = flexie.dynamicEndpointThrottle
const apiThrottle = flexie.apiThrottle

// Initiate a connection with Asterisk
const ami = new AsteriskAmi({ 
	host: 'localhost', 
	username: config.asterisk_user, 
	password: config.asterisk_pass,
	reconnect: true,
	reconnect_after: 1000
})

ami.on('ami_data', (data) => {

	const event = data.event

    if(event == 'Cdr') {

    	// Check call disposition, so we can extract missed calls
    	if(['NO ANSWER', 'NOANSWER', 'CANCEL', 'BUSY', 'CONGESTION', 'FAILED'].includes(data.disposition)) {
    		
    		const missedCall = {
    			callernumber: data.source,
    			raw_data: data
    		}
    		
    		try {

    			// Send missed call to Flexie, while making sure
    			// its an inbound call sent to a user extension
    			if(data.destinationcontext == 'ext-local') {
    				flexie.sendMissedCallToFlexie(dynamicEndpointThrottle, missedCall)
    			}

    		} catch(e) {
    			console.log('There was an error sending the missed call to Flexie', e)
    		}
    	} else if(data.disposition == 'ANSWERED' && ['ext-queues', 'ext-local', 'from-trunk', 'from-pstn', 'from-internal'].includes(data.destinationcontext)) {

            // Do nothing if its ext-local being called from the queue
            // So we do not get double logs for same calls being different legs
            if(data.destinationcontext == 'ext-local' && data.channel.includes('from-queue')) {
                return
            }

            let direction = 'outbound'
            let user_ext = ''
            let destination = ''

            switch(data.destinationcontext) {
                case 'ext-local':
                    direction = 'inbound'
                    user_ext = destination = data.destination
                    break
                case 'ext-queues':
                    direction = 'inbound'
                    user_ext = destination = data.destinationchannel.match(new RegExp('/(.*)@'))[1] || ''
                    break
                case 'from-internal':
                    direction = 'outbound'
                    destination = data.destination
                    user_ext = data.channel.match(new RegExp('/(.*)-'))[1] || ''
                    break
            }

    		const callData = {
    			call_id: data.uniqueid,
				user_ext: user_ext,
				dial_from: data.source,
				dial_to: destination,
				call_direction: direction,
				call_duration: data.billableseconds,
				call_recording: '',
				answer_time: data.answertime
    		}

    		flexie.sendCallLogToFlexie(apiThrottle, callData)
    	}
    }
})

ami.connect(() => {
    console.log('[*] Got connected with Asterisk Manager')
}, (raw_data) => {})


// Handle process exit
process.once('SIGINT', (code) => {
	ami.disconnect()
	process.exit()
})

// Handle process exit
process.once('SIGTERM', (code) => {
	ami.disconnect()
	process.exit()
})