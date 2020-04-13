import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';

class FCMService {
    register  = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister)
        this.createNotificationListeners(onNotification, onOpenNotification)
    }

    checkPermission = (onRegister) => {
        firebase.messaging().hasPermission()
        .then(enabled => {
            if (enabled) {
                //User has permissions
                this.getToken(onRegister)
            } else {
                //User doesn't have permission
                this.requestPermisson(onRegister)
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

    createNotificationListeners = (onNotification, onOpenNotification) => {
        // Triggered when a particular notification has been received in foreground
        this.notificationListener = firebase.notification()
        .onNotification((notification: Notification) => {
            onNotification(notification)
        })

        // if your app is background, you can list for when a notification 
        //is click / tapped / opened as follows
        this.notificationOpenedListener = firebase.notification()
        .then(NotificationOpen =>)
    }
}