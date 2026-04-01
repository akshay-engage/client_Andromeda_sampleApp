import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonText
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { WebengageUser } from "@awesome-cordova-plugins/webengage";

const Login: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username) {
      console.log("inside if - ",username)
      setError('Please enter username');
      return;
    } else {
      console.log("inside else - ",username)

    }
    // Simple mock auth
    if(password) {
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
    }
    WebengageUser.login(username);

    localStorage.setItem('user', username);
    console.log('[EVENT] login_success', { user: username, timestamp: Date.now() });
    history.push('/dashboard');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Client OneAndro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Login</h2>
        {error && <IonText color="danger"><p>{error}</p></IonText>}
        <IonItem>
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput value={username} onIonInput={(e) => {
            const val = (e.target as HTMLIonInputElement).value as string;
            setUsername(val || '');
          }} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput type="password" value={password} onIonInput={(e) => {
            const val = (e.target as HTMLIonInputElement).value as string;
            setPassword(val || '');
          }} />
        </IonItem>
        <IonButton expand="block" onClick={handleLogin} style={{ marginTop: '20px' }}>
          Login
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
