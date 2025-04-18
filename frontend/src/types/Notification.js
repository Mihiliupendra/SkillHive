/**
 * @typedef {"LIKE" | "COMMENT"} NotificationType
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} userId
 * @property {string} message
 * @property {NotificationType} type
 * @property {boolean} read
 * @property {string} [link]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} NotificationResponse
 * @property {Notification[]} notifications
 * @property {boolean} hasMore
 * @property {number} totalCount
 */
