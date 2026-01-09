import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonPopover,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface AppHeaderProps {
  title: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const { user, signOut } = useAuthenticator();
  const [showPopover, setShowPopover] = useState(false);

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>{title}</IonTitle>

        {/* Right-side profile button */}
        <IonButtons slot="end">
          <IonButton onClick={() => setShowPopover(true)}>
            <IonIcon icon={personCircleOutline} size="large" />
          </IonButton>
        </IonButtons>

        {/* Profile dropdown */}
        <IonPopover
          isOpen={showPopover}
          onDidDismiss={() => setShowPopover(false)}
        >
          <IonList>
            <IonItem lines="none">
              <IonLabel>
                <strong>{user?.signInDetails?.loginId}</strong>
              </IonLabel>
            </IonItem>

            <IonItem
              button
              lines="none"
              onClick={signOut}
            >
              <IonLabel color="danger">Logout</IonLabel>
            </IonItem>
          </IonList>
        </IonPopover>
      </IonToolbar>
    </IonHeader>
  );
};
