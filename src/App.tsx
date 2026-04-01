import React, { useEffect } from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { PushNotifications } from '@capacitor/push-notifications';
import { Webengage } from '@awesome-cordova-plugins/webengage';
import { WebengageUser } from "@awesome-cordova-plugins/webengage";


setupIonicReact();

const initWebEngage = async () => {
  Webengage.engage();

  // Step 2: Request push permission and register with FCM
  const permStatus = await PushNotifications.requestPermissions();
  if (permStatus.receive !== 'granted') {
    console.warn('Push notification permission not granted');
    return;
  } else { 
    console.warn('Push notification permission granted');
    // Important for Android 13+ for push permission
    WebengageUser.setDevicePushOptIn(true);
  }

  await PushNotifications.register();

  // NOTE - Using @capacitor/push-notifications listeners to replicate Client's behavior, No code related to WebEngage here!
  PushNotifications.addListener('registration', (token) => {
    console.log('FCM Token from @capacitor/push-notifications in App.tsx: ', token.value);
  });

  PushNotifications.addListener('registrationError', (error) => {
    console.error('Push registration error:', error);
  });

  // Step 4: Pass push payload to WebEngage
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received from @capacitor/push-notifications in App.tsx: ', notification);
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('Push action performed from @capacitor/push-notifications in App.tsx:', action);
  });
};

const App: React.FC = () => {
  useEffect(() => {
    initWebEngage();
  }, []);
  return (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login" component={Login} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Redirect exact from="/" to="/login" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
  );
};

export default App;
