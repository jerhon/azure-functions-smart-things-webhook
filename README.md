# Smart Things Web Hook

This is a webhook for Samsung Smart things written for an Azure Functions in Node.js.
It sets up an app which subscribes for temperature sensor readings and for contact sensor readings.
Those readings are output to an Event Grid Topic.

Once the values have been introduced to event grid, you can subscribe to the event grid topic from other applications to consume the events in your application.

## How To Use

1. Set up a Samsung Developer account.
2. Create a new smart things automation.
3. Create a new function app and publish the repo as an azure functions app.
4. In the smart things automation, include the full URL to call the application (including the function key).
5. Create an event grid topic to publish to.
5. In the settings for the function application, add the settings for the event grid topic
   1. DeviceEventGridUri = URI for the event grid topic
   2. DeviceEventGridKey = Key for the event grid topic to post events.
