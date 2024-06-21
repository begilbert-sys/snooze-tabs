export default class AlarmManager {
    /**
     * Maps alarm names to tab URLs
     * For instance:
     * alarmURLs.get('1719005982808') -> 'https://developer.chrome.com/docs/extensions/reference/api/alarms'
     * @type {Map}
     * @private
     */
    #alarmURLs;

    constructor() {
        this.#alarmURLs = new Map();

        /* when an alarm goes off, open its tab */
        chrome.alarms.onAlarm.addListener(async (alarm) => {
            const url = this.#alarmURLs.get(alarm.name);
            chrome.tabs.create({
                url
            });
            this.#alarmURLs.delete(alarm.name);
        });

    }

    /**
     * Generate a unique ID to set as the alarm's name
     * @return {string}
     */
    #generateAlarmName() {
        return new Date().valueOf().toString();
    }

    /**
     * Create an alarm that will open the URL at the specified datetime
     * @param {string} url - the URL to be opened
     * @param {Date} waketime - the datetime at which it will be opened
     */

    setAlarm(url, wakeTime) {
        const alarmName = generateAlarmName();

        this.#alarmURLs.set(alarmName, url);

        chrome.alarms.create(alarmName, {
            when: wakeTime.getTime()
        });
    }
}