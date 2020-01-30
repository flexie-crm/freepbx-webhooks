module.exports = {
	// Your FreePBX URL, without the trailing slash at the end
	'voip_recordings_url': 'https://your-freepbx-url.domain.com/calls',

	// Add a Asterisk Manager User in FreePBX Admin, and put credentials here
	'asterisk_user': 'your-asterisk-manager-user',
	'asterisk_pass': 'your-asterisk-manager-pass',

	// Your Flexie URL and API Key are used for sending call (completed calls only) logs
	// Including source, destination call recording URL and call time 
	'flexie_url': 'https://your-domain.flexie.io',
	'flexie_api_key': 'your-api-key',

	// Throtteling your requests it's very important so you wont get restricted 
	// on Flexie by hitting too frequently, make sure to put this higher than 1500 ms
	'api_requests_call_log_throttle': 1500,
	'dynamic_endpoint_requests_throttle': 1500,

	// Handle missed calls here, so you can build your own logic on Flexie
	// like sending a notificaion to a team member to call back the client
	// or to send an email notifying we would call shortly... or just call her back
	// Leave empty if you do not need this feature.
	'missed_calls_dynamic_endpoint': 'https://your-domain.flexie.io/your-dynamic-endpoint'
}
