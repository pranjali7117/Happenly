/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} date
 * @property {string} time
 * @property {string} location
 * @property {Attendee[]} attendees
 */

/**
 * @typedef {Object} Attendee
 * @property {string} email
 * @property {'Yes' | 'No' | 'Maybe'} status
 */

/**
 * @typedef {Object} EventState
 * @property {Event[]} events
 */

/**
 * @typedef {Object} EventAction
 * @property {string} type
 * @property {any} payload
 */

/**
 * @typedef {Object} EventContextType
 * @property {EventState} state
 * @property {Function} dispatch
 * @property {Function} addEvent
 * @property {Function} addAttendee
 * @property {Function} deleteEvent
 * @property {Function} updateEvent
 * @property {Function} updateAttendeeStatus
 */

export { }; 