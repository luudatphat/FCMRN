import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';

class FCMService {
    register  = (onRegister, onNotification, onOpenNotification) => {
        console.log("Permisson rejected")
        this.checkPermission(onRegister)
        this.createNotificationListeners(onRegister, onNotification, onOpenNotification)
    }

    checkPermission = (onRegister) => {
        firebase.messaging().hasPermission()
        .then(enabled => {
            if (enabled) {
                //User has permissions
                this.getToken(onRegister)
            } else {
                //User doesn't have permission
                this.requestPermission(onRegister)
            }
        }).catch(error => {
            console.log("Permisson rejected", error)
        })
    }

    getToken = (onRegister) => {
        firebase.messaging().getToken()
        .then(fcmToken => {
            if (fcmToken) {
                onRegister(fcmToken)
            } else {
                console.log("User does not have a device token")
            }
        }).catch(error => {
            console.log("getToken rejected", error)
        })
    }

    requestPermisson = (onRegister) => {
        firebase.messaging().requestPermisson()
        .then(() => {
            this.getToken(onRegister)
        }).catch(error => {
            console.log("Request Permisson rejected", error)
        })
    }

    deleteToken = () => {
        firebase.messaging().deleteToken()
        .catch(error => {
            console.log("Delete token error", error)
        })
    }

    createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
        // Triggered when a particular notification has been received in foreground
        this.notificationListener = firebase.notification()
        .onNotification((notification: Notification) => {
            onNotification(notification)
        })

        // if your app is background, you can list for when a notification 
        //is click / tapped / opened as follows
        this.notificationOpenedListener = firebase.notification()
        .then(NotificationOpen => {
            if (NotificationOpen) {
                const notification: Notification = NotificationOpen.notification
                onOpenNotification(notification)
            }
        })

        //Triggered for data only payload in foreground
        this.messageListener = firebase.messaging().onMesseage((message) => {
            onNotification(message)
        })

        //Triggered when have new token
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
            console.log("New token Refresh: ", fcmToken)
            onRegister(fcmToken)
        })
    }

    unRegister = () => {
        this.notificationListener()
        this.notificationOpenedListener()
        this.messageListener()
        this.onTokenRefreshListener()
    }

    buildNotification = (obj) => {
        //For Android
        firebase.notification().android.createChannel(obj.channel)

        //For Android and IOS
        return new firebase.notification.Notification()
        .setSound(obj.sound)
        .setNotificationId(obj.dataId)
        .setTile(obj.title)
        .setBody(obj.content)
        .setData(obj.data)

        //For android
        .android.setChannelId(obj.channel.channelID)
        .android.setLargeIcon(obj.largeIcon) //create this icon in Android Studio (app/res/mipmap) 
        .android.setSmallIcon(obj.smallIcon) //create this icon in Android Studio (app/res/drawable) 
        .android.setColor(obj.colorBgIcon)
        .android.setPriority(firebase.notification.Android.Priority.High)
        .android.setVibrate(obj.vibrate)
        //.android.setAutoCancel(true) // Auto cancle after receive notification
    }

    scheduleNotification = (notification,days,minuter) => {
            const date = new Date()
            if (days) {
                date.setDate(date.getDate() + days)
            }
            if (minutes) {
                date.setMinuter(date.getMinutes() + minutes)
            }

            firebase.notifications()
            .scheduleNotification(notification, {firebase: date.getTime()})
    }

    displayNotification = (notification) => {
        firebase.notification().displayNotification(notification)
        .catch(error => console.log("Display Notification error : ", error))
    }

    removeDeliveredNotification = (notification) => {
        firebase.notifications()
        .removeDeliveredNotification(notification.notificationId)
    }

}

export const fcmServive = new FCMService();