import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonItem, IonLabel, IonInput, IonList, IonText, IonButtons
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Webengage } from '@awesome-cordova-plugins/webengage';

interface TrackedEvent {
  name: string;
  timestamp: number;
}

const Dashboard: React.FC = () => {
  const history = useHistory();
  const user = localStorage.getItem('user') || 'Guest';
  const [eventName, setEventName] = useState('');
  const [events, setEvents] = useState<TrackedEvent[]>([]);

  const trackEvent = () => {
    if (!eventName.trim()) return;
    const newEvent: TrackedEvent = { name: eventName.trim(), timestamp: Date.now() };
    setEvents((prev) => [newEvent, ...prev]);
    console.log('[EVENT] tracked', newEvent.name, " | Time = ",newEvent.timestamp);
    Webengage.track(newEvent.name)
    setEventName('');
  };

  const handleLogout = () => {
    console.log('[EVENT] logout', { user, timestamp: Date.now() });
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Dashboard</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout} color="light">Logout</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText><h3>Welcome, {user}</h3></IonText>

        <h4>Track Event</h4>
        <IonItem>
          <IonLabel position="stacked">Event Name</IonLabel>
          <IonInput value={eventName} onIonChange={(e) => setEventName(e.detail.value || '')} placeholder="e.g. button_click" />
        </IonItem>
        <IonButton expand="block" onClick={trackEvent} style={{ marginTop: '10px' }}>
          Track Event
        </IonButton>

        {events.length > 0 && (
          <>
            <h4>Tracked Events ({events.length})</h4>
            <IonList>
              {events.map((ev, i) => (
                <IonItem key={i}>
                  <IonLabel>
                    <h3>{ev.name}</h3>
                    <p>{new Date(ev.timestamp).toLocaleTimeString()}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
