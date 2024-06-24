/*
alarmData structure: 
{
    [alarmName: string]: {
        url: string
        wakeTime: number
    }
}
*/
export default class AlarmManager {
    constructor() {

        /* when an alarm goes off, open its tab */
        chrome.alarms.onAlarm.addListener(async (alarm) => {
            const alarmData = await chrome.storage.sync.get(alarm.name);
            chrome.tabs.create({
                url: alarmData[alarm.name].url
            });
            await chrome.storage.sync.remove(alarm.name);
        });
    }

    /**
     * Generate a unique ID to set as the alarm's name
     * @return {string}
     */
    #generateAlarmName() {
        return new Date().valueOf().toString();
    }

    async updateAllTimers() {

    }

    /**
     * Create an alarm that will open the URL at the specified datetime
     * @param {string} url - the URL to be opened
     * @param {Date} waketime - the datetime at which it will be opened
     */

    async setAlarm(url, wakeTime) {
        const alarmName = this.#generateAlarmName();

        const alarmData = {
            url: url,
            wakeTime: wakeTime
        };

        await chrome.storage.sync.set({ [alarmName]: alarmData });

        chrome.alarms.create(alarmName, {
            when: wakeTime
        });
    }
}