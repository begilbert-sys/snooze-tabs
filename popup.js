import AlarmManager from './alarmmanager.js';

/**
 * Get the current local time in the format: YYYY-MM-DDThh:mm
 * 
 * @return {string}
 */
function currentDatetimeString () {
    const currentDate = new Date();

    // https://stackoverflow.com/a/28149561
    const localDate = new Date(currentDate - currentDate.getTimezoneOffset() * 60000);

    // seconds and MS are unnecessary 
    localDate.setSeconds(null);
    localDate.setMilliseconds(null);

    // The slice(0, -1) gets rid of the trailing Z which represents Zulu timezone
    return localDate.toISOString().slice(0, -1);
}

/**
 * @async
 * Get the URL of the current tab
 * @return {Promise<string>}
 */
async function getCurrentTabURL() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    if (tab == undefined) {
        console.error("tab is undefined");
        return undefined;
    }
    return tab.url;
}


/* set the default and min datetime to the current time */
const dateControl = document.querySelector('#wake-tab-at');
const dtString = currentDatetimeString();
dateControl.value = dtString;
dateControl.min = dtString;

/* create the alarm manager */
var alarmManager = new AlarmManager();

/* when the form is submitted */
const form = document.querySelector('#sleep-tab-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const currentTabURL = await getCurrentTabURL();
    if (currentTabURL == undefined) {
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const wakeTime = new Date(data['wake-tab-at']).getTime();

    /* set the alarm */
    alarmManager.setAlarm(currentTabURL, wakeTime);

    /* display a success message */
    const successMessage = document.querySelector('#success-message');
    successMessage.style.opacity = "1";
    setTimeout(() => {
        successMessage.style.opacity = "0";
        console.log('setTimeout fired');
    }, 2500);
});