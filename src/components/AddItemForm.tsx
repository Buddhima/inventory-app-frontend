import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    IonItem,
    IonInput,
    IonButton,
    IonToast
} from '@ionic/react';
import { api } from '../api';

interface AddItemFormProps {
    onItemAdded?: () => void;
}

const AddItemForm = ({ onItemAdded }: AddItemFormProps) => {
    const [sku_id, setSkuId] = useState('');
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [showToast, setShowToast] = useState(false);

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await api.post('stock', {
                id: sku_id.trim(),
                name: name.trim(),
                quantity: parseInt(quantity, 0)
            });

            setSkuId('');
            setName('');
            setQuantity('');
            setShowToast(true);
            onItemAdded?.();
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    return (
        <>
            <form onSubmit={submitHandler}>
                <IonItem>
                    <IonInput
                        label='Item Code'
                        labelPlacement='floating'
                        value={sku_id}
                        onIonChange={(e) => setSkuId(e.detail.value ?? '')}
                        required
                    />
                </IonItem>

                <IonItem>
                    <IonInput
                        label='Item Name'
                        labelPlacement='floating'
                        value={name}
                        onIonChange={(e) => setName(e.detail.value ?? '')}
                        required
                    />
                </IonItem>

                <IonItem>
                    <IonInput
                        label='Quantity'
                        labelPlacement='floating'
                        type="number"
                        value={quantity}
                        onIonChange={(e) => setQuantity(e.detail.value ?? '')}
                        required
                    />
                </IonItem>

                <IonButton expand="block" type="submit" className="ion-margin-top" color="success">
                    Add Item
                </IonButton>
            </form>

            <IonToast
                isOpen={showToast}
                message="Item added successfully!"
                duration={2000}
                onDidDismiss={() => setShowToast(false)}
            />
        </>
    );
};

AddItemForm.propTypes = {
    onItemAdded: PropTypes.func
};

export default AddItemForm;
