import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';

import { AppHeader } from '../components/AppHeader';
import RemoveItemForm from '../components/RemoveItemForm';
import AddItemForm from '../components/AddItemForm';
// import StockFileUploadForm from '../components/StockFileUploadForm';

const Stock = () => {
  const [reload, setReload] = useState(0);

  return (
    <IonPage>
      <AppHeader title="Update Inventory" />

      <IonContent className="ion-padding">
        <IonGrid>
          {/* <IonRow>
            <IonCol size="12" sizeMd="6">
              <h2>Bulk Inventory Upload</h2>
              <StockFileUploadForm onItemAdded={() => setReload(reload + 1)} />
            </IonCol>
          </IonRow> */}
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <h2>Stock Item</h2>
              <AddItemForm onItemAdded={() => setReload(reload + 1)} />
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <h2>Consume Item</h2>
              <RemoveItemForm onItemAdded={() => setReload(reload + 1)} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Stock;
