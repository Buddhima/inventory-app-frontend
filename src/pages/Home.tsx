import React from 'react';
import {
  IonPage,
  IonContent
} from '@ionic/react';
import { AppHeader } from '../components/AppHeader';

import ItemList from '../components/ItemList';

const Home = () => {
  const reload = 0;

  return (
    <IonPage>
      <AppHeader title="Inventory" />

      <IonContent className="ion-padding">
        
        <ItemList reload={reload} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
