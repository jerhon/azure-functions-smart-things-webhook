const SmartApp = require("@smartthings/smartapp")

/** Creates the smart app for the application. */
function initSmartApp(events) {

    const eventCallback = (context, data, time) => {
        events.push({
            id: data.eventId,
            subject: data.deviceId,
            dataVersion: '1.0',
            eventType: data.capability,
            data: data,
            eventTime: time
        })
    }

    const smartApp = new SmartApp()
        // Can uncomment if the function is misbehaving.
        // However, it's advised to not
        //      .enableEventLogging(2)
        .page('mainPage', (context, page, configData) => {
            page.name('Honlsoft Monitoring')

            page.section('temperatureSensors', section => {
                section.deviceSetting('temperatureSensors')
                    .capabilities(['temperatureMeasurement'])
                    .multiple(true)
            })

            page.section('doorSensors', section =>{
                section.deviceSetting('doorSensors')
                    .capabilities(['contactSensor'])
                    .multiple(true)
            })
        })
        .updated( async (context, updateData) => {
            await context.api.subscriptions.delete()
            await context.api.subscriptions.subscribeToDevices(context.config.temperatureSensors, 'temperatureMeasurement', 'temperature', 'temperatureSubscription')
            await context.api.subscriptions.subscribeToDevices(context.config.doorSensors, 'contactSensor', 'contact', 'doorsSubscription')
        })
        .subscribedEventHandler('temperatureSubscription', eventCallback)
        .subscribedEventHandler('doorsSubscription', eventCallback)

    return smartApp
}

/** The actual function being run. */
module.exports = async function (context, req) {

    // Will hold any events collected for the request
    const events = []
    const smartApp = initSmartApp(events);

    // The SmartThings application is provisioned with a function key.
    // If the key is not provided on it's API calls, this function will not execute.
    //
    // Thus, the http signature verification is not needed.
    await smartApp.handleHttpCallbackUnverified(req, context.res)

    // Assign the events to the output to be logged.
    // The bindings are defined in the function.json alongside this function.
    context.bindings.outputEvent = events
}
