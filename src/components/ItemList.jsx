import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { IonSpinner, IonGrid, IonRow, IonCol, IonList, IonItem, IonBadge, IonLabel, IonSearchbar } from '@ionic/react';
import { api } from '../api';
import './ItemList.css'

const minStockQty = 100;

const ItemList = ({ reload }) => {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/inventory');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredItems = useMemo(() => {
    if (!searchText) return items;

    console.log('Filtering items with search text:', searchText);
    const query = searchText.toLowerCase();

    return items.filter(item =>
      item.name?.toLowerCase().includes(query) ||
      item.id?.toLowerCase().includes(query)
    );
  }, [items, searchText]);

  useEffect(() => {
    fetchItems();
  }, [reload]);

  if (loading) return <IonSpinner />;

  return (
    <>
      <IonSearchbar
        value={searchText}
        debounce={300}
        placeholder="Search items"
        onIonInput={e => setSearchText(e.detail.value ?? '')}
      />

      <IonList>
        {filteredItems.map((item) => {
          const stockColor =
            item.quantity === 0
              ? 'danger'
              : item.quantity < minStockQty
                ? 'warning'
                : 'success';

          return (
            <IonItem key={item.id} button>
              <IonLabel>
                <h2>{item.name}</h2>
                <p>Component ID: {item.id}</p>
              </IonLabel>

              {/* <IonBadge
              color={item.quantity === 0 ? 'danger' :
                item.quantity < minStockQty ? 'warning' : 'success'}
            >
              {item.quantity}
            </IonBadge> */}

              {/* Right: Quantity + Stock Indicator */}
              <div className="stock-info" slot="end">
                <h3 className="quantity">{item.quantity}</h3>
                <span className={`stock-indicator ${stockColor}`} />
              </div>

            </IonItem>
          );
        })}
      </IonList>
    </>

    // <IonGrid>
    //   <IonRow className="ion-text-bold">
    //     <IonCol size="3">Id</IonCol>
    //     <IonCol size="5">Name</IonCol>
    //     <IonCol size="4">Quantity</IonCol>
    //   </IonRow>

    //   {items.map((item) => (
    //     <IonRow key={item.id}>
    //       <IonCol size="3">{item.id}</IonCol>
    //       <IonCol size="5">{item.name}</IonCol>
    //       <IonCol size="4">{item.quantity ?? 0}</IonCol>
    //     </IonRow>
    //   ))}
    // </IonGrid>


  );
};

ItemList.propTypes = {
  reload: PropTypes.number,
};

export default ItemList;
