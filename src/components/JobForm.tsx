import React, { useState, FormEvent } from "react";
import {
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonToast
} from "@ionic/react";
import { add, trash } from "ionicons/icons";
import { api } from '../api';

interface Item {
    id: string;
    description?: string;
    eanCode?: string;
    quantity: number;
    unitCost?: number;
}

interface JobPayload {
    id: string;
    supplierId?: string;
    description: string;
    eanCode?: string;
    signatureText?: string;
    costItems: Item[];
}

const JobForm: React.FC = () => {
    const [id, setId] = useState<string>("");
    const [supplierId, setSupplierId] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [eanCode, setEanCode] = useState<string>("");
    const [signatureText, setSignatureText] = useState<string>("");
    const [items, setItems] = useState<Item[]>([{ id: "", description: "", eanCode: "", quantity: 0, unitCost: 0 }]);
    const INITIAL_ITEMS: Item[] = [{ id: "", description: "", eanCode: "", quantity: 0, unitCost: 0 }];
    const [showToast, setShowToast] = useState(false);

    const handleItemChange = (
        index: number,
        field: keyof Item,
        value: string | number
    ): void => {
        setItems((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const addItem = (): void => {
        setItems((prev) => [...prev, { id: "", quantity: 0, unitCost: 0 }]);
    };

    const removeItem = (index: number): void => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        const payload: JobPayload = {
            id,
            supplierId,
            description,
            eanCode,
            signatureText,
            costItems: items.filter(
                (item) => item.id.trim() !== "" && item.quantity > 0
            )
        };

        console.log("Submitting payload:", payload);
        console.log("Job as a string:", JSON.stringify(payload));


        try {
            await api.post('/jobs', payload);

            // ✅ CLEAR FORM AFTER SUBMIT
            setId("");
            setSupplierId("");
            setEanCode("");
            setSignatureText("");
            setDescription("");
            setItems(INITIAL_ITEMS);

            setShowToast(true);
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <IonList>
                    <IonItem>
                        <IonLabel position="floating">BOM Header</IonLabel>
                        <IonInput
                            value={id}
                            onIonChange={(e) => setId(e.detail.value ?? "")}
                            required
                            class="ion-text-uppercase"
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="floating">Supplier ID</IonLabel>
                        <IonInput
                            value={supplierId}
                            onIonChange={(e) => setSupplierId(e.detail.value ?? "")}
                            required
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="floating">BOM Header Description</IonLabel>
                        <IonInput
                            value={description}
                            onIonChange={(e) => setDescription(e.detail.value ?? "")}
                            required
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="floating">EAN Code BOM header</IonLabel>
                        <IonInput
                            value={eanCode}
                            onIonChange={(e) => setEanCode(e.detail.value ?? "")}
                            required
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="floating">Signature</IonLabel>
                        <IonInput
                            value={signatureText}
                            onIonChange={(e) => setSignatureText(e.detail.value ?? "")}
                            required
                        />
                    </IonItem>

                    <IonLabel className="ion-margin-top">
                        <strong>Components</strong>
                    </IonLabel>

                    {items.map((item, index) => (
                        <IonGrid key={index}>
                            <IonRow className="ion-align-items-center">
                                <IonCol size="2">
                                    <IonItem>
                                        <IonLabel position="floating">Component ID</IonLabel>
                                        <IonInput
                                            value={item.id}
                                            onIonChange={(e) =>
                                                handleItemChange(index, "id", e.detail.value ?? "")
                                            }
                                            required
                                            class="ion-text-uppercase"
                                        />
                                    </IonItem>
                                </IonCol>

                                <IonCol size="4">
                                    <IonItem>
                                        <IonLabel position="floating">Component Description</IonLabel>
                                        <IonInput
                                            value={item.description}
                                            onIonChange={(e) =>
                                                handleItemChange(index, "description", e.detail.value ?? "")
                                            }
                                            required
                                        />
                                    </IonItem>
                                </IonCol>

                                <IonCol size="2">
                                    <IonItem>
                                        <IonLabel position="floating">Component EAN</IonLabel>
                                        <IonInput
                                            value={item.eanCode}
                                            onIonChange={(e) =>
                                                handleItemChange(index, "eanCode", e.detail.value ?? "")
                                            }
                                            required
                                        />
                                    </IonItem>
                                </IonCol>

                                <IonCol size="1">
                                    <IonItem>
                                        <IonLabel position="floating">Unit Cost</IonLabel>
                                        <IonInput
                                            type="number"
                                            min={0}
                                            value={item.unitCost}
                                            onIonChange={(e) =>
                                                handleItemChange(index, "unitCost", e.detail.value ?? "")
                                            }
                                            required
                                        />
                                    </IonItem>
                                </IonCol>

                                <IonCol size="1">
                                    <IonItem>
                                        <IonLabel position="floating">Qty</IonLabel>
                                        <IonInput
                                            type="number"
                                            min={0}
                                            value={item.quantity}
                                            onIonChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "quantity",
                                                    Number(e.detail.value)
                                                )
                                            }
                                            required
                                        />
                                    </IonItem>
                                </IonCol>

                                <IonCol size="2" className="ion-text-center">
                                    <IonButton
                                        color="danger"
                                        fill="clear"
                                        onClick={() => removeItem(index)}
                                    >
                                        <IonIcon icon={trash} />
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    ))}
                </IonList>

                <IonButton
                    expand="block"
                    fill="outline"
                    onClick={addItem}
                    className="ion-margin-top"
                >
                    <IonIcon icon={add} slot="start" />
                    Add Item
                </IonButton>

                <IonButton
                    expand="block"
                    type="submit"
                    className="ion-margin-top"
                >
                    Submit Job
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

export default JobForm;
