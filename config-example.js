module.exports = {
	// The owners id. The owner has all the permissions.
	ownerID = '12345678910',
	// The Co-Owner's ids. They also have all the permissions.
	coOwnersIDs = [],

	// The token for bot login
	token: process.env.token, 
	// The default settings for the servers
	settings: {
		prefix: "~",
		logChannel: null
	}
}