require('dotenv').config()

const { google } = require('googleapis')
const { OAuth2Client } = require("google-auth-library")
const auth = new OAuth2Client(
    process.env.ID_CLIENT,
    process.env.CLIENT_SECRET
)

auth.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
}
)


const calendar = google.calendar(
    {
        version: 'v3',
        auth: auth
    }
)

//set the start and end time of the event

const eventStartTime = new Date()

eventStartTime.setDate(eventStartTime.getDate())

const eventEndTime = new Date()

eventEndTime.setDate(eventEndTime.getDate() + 1)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)

console.log(eventStartTime.getDate())


const event = {
    summary: 'Meet with Dave',
    location: 'Via degli argonauti 16, 51100 Pistoia, Italia',
    description: 'Meeting with david to talk about the new client',
    start: {
        dateTime: eventStartTime,
        timeZone: 'Europe/Rome'
    },
    end: {
        dateTime: eventEndTime,
        timeZone: 'Europe/Rome'
    },
    colorId: 1
}

calendar.freebusy.query({
    resource: {
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        timeZone: 'Europe/Rome',
        items: [{
            id: 'primary'
        }]
    }
}, (err, res) => {
    if (err) return console.error('Free busy error', err)
    const eventsArr = res.data.calendars.primary.busy
    if (eventsArr.length === 0) {
        return calendar.events.insert({
            calendarId: 'primary',
            resource: event
        }, err => {
            if (err) { return console.error('calendare event creation error', err) }
            return console.log('calendar event created')
        })
    }
    return console.log('sorry, i am busy')
})