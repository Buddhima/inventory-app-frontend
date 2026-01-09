import React, { useState, useEffect, FormEvent, useMemo } from "react";
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
    IonToast,
    IonLoading,
    IonBadge,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonSearchbar
} from "@ionic/react";
import { add, trash } from "ionicons/icons";
import { api } from '../api';

export interface TemplateSummary {
    bomHeader: string;
    bomHeaderDescription?: string;
    sk?: string;
}

export interface Template {
    id: string;
    data: unknown; // adjust if you know the structure
}


interface Item {
    componentCode: string;
    componentDescription?: string;
    componentEAN?: string;
    componentQuantity: number;
    unitCost?: number;
    stockQty?: number;
}

interface JobPayload {
    bomHeader: string;
    supplier?: string;
    bomHeaderDescription: string;
    bomEAN?: string;
    signature?: string;
    components: Item[];
}

const JobTemplate: React.FC = () => {
    const [templates, setTemplates] = useState<TemplateSummary[]>([]);
    const [selectedId, setSelectedId] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [template, setTemplate] = useState<Template | null>(null);
    const [error, setError] = useState('');

    const [id, setId] = useState<string>("");
    const [supplierId, setSupplierId] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [eanCode, setEanCode] = useState<string>("");
    const [signatureText, setSignatureText] = useState<string>("");
    const [items, setItems] = useState<Item[]>([{ componentCode: "", componentDescription: "", componentEAN: "", componentQuantity: 0, unitCost: 0, stockQty: 0 }]);
    const INITIAL_ITEMS: Item[] = [{ componentCode: "", componentDescription: "", componentEAN: "", componentQuantity: 0, unitCost: 0, stockQty: 0 }];
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            const res = await api.get('job-templates');
            const data = res.data as TemplateSummary[];
            setTemplates(data);
        } catch {
            setError('Failed to load templates');
        } finally {
            setLoading(false);
        }
    };

    const retrieveTemplate = async () => {
        if (!selectedId) return;

        try {
            setLoading(true);
            // const [id, timestamp] = selectedId.split('#');
            const sk = encodeURIComponent(selectedId);

            const res = await api.get('/job-templates', {
                params: { sk }
            });

            const data = res.data as Template;
            setTemplate(data);
            console.log('Retrieved template:', data);
            const jobData = res.data as JobPayload
            fillContent(jobData);
        } catch {
            setError('Failed to retrieve template');
        } finally {
            setLoading(false);
        }
    };

    const fillContent = async (payload: JobPayload) => {
        console.log("Filling content from template:", payload);
        if (payload) {
            setId(payload.bomHeader);
            setSupplierId(payload.supplier || "");
            setDescription(payload.bomHeaderDescription);
            setEanCode(payload.bomEAN || "");
            setSignatureText(payload.signature || "");
            setItems(payload.components || INITIAL_ITEMS);
        }
    };

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
        setItems((prev) => [...prev, { componentCode: "", componentQuantity: 0, unitCost: 0 }]);
    };

    const removeItem = (index: number): void => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        const payload: JobPayload = {
            bomHeader: id,
            supplier: supplierId,
            bomHeaderDescription: description,
            bomEAN: eanCode,
            signature: signatureText,
            components: items.filter(
                (item) => item.componentCode.trim() !== "" && item.componentQuantity > 0
            )
        };

        console.log("Submitting payload:", payload);
        console.log("Job as a string:", JSON.stringify(payload));


        try {
            setLoading(true);

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
            setError('Failed to create the job');
        } finally {
            setLoading(false);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [searchText, setSearchText] = useState('');

    const selectedTemplate = templates.find(t => t.sk === selectedId);

    const filteredTemplates = useMemo(() => {
        if (!searchText) return templates;

        const q = searchText.toLowerCase();

        return templates.filter(t =>
            t.bomHeader.toLowerCase().includes(q) ||
            t.bomHeaderDescription?.toLowerCase().includes(q)
        );
    }, [templates, searchText]);


    return (
        <>
            
            <IonItem button onClick={() => setShowModal(true)}>
                <IonLabel>
                    <h3>Template</h3>
                    <p>
                        {selectedTemplate
                            ? `${selectedTemplate.bomHeader} - ${selectedTemplate.bomHeaderDescription}`
                            : 'Select a template'}
                    </p>
                </IonLabel>
            </IonItem>

            <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Select Template</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonSearchbar
                        value={searchText}
                        debounce={300}
                        placeholder="Search templates"
                        onIonInput={e => setSearchText(e.detail.value ?? '')}
                    />

                    <IonList>
                        {filteredTemplates.map(t => (
                            <IonItem
                                key={t.sk}
                                button
                                onClick={() => {
                                    setSelectedId(t.sk);
                                    setShowModal(false);
                                }}
                            >
                                <IonLabel>
                                    <h2>{t.bomHeader}</h2>
                                    <p>{t.bomHeaderDescription}</p>
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            </IonModal>

            <IonButton
                expand="block"
                disabled={!selectedId}
                onClick={retrieveTemplate}
            >
                Retrieve Template
            </IonButton>

            {/* {template && (
                    <pre style={{ marginTop: 16 }}>
                        {JSON.stringify(template, null, 2)}
                    </pre>
                )} */}

            <IonLoading isOpen={loading} message="Loading..." />
            <IonToast
                isOpen={!!error}
                message={error}
                duration={3000}
                onDidDismiss={() => setError('')}
            />

            <IonLabel hidden={id.length > 0} color="danger">
                <strong>Please select a template and click &quot;Retrieve Template&quot; to load its details.</strong>
            </IonLabel>

            <>
                <form onSubmit={handleSubmit}>
                    <IonList>
                        <IonItem>
                            <IonInput
                                label="BOM Header"
                                labelPlacement="floating"
                                value={id}
                                onIonChange={(e) => setId(e.detail.value ?? "")}
                                required
                                class="ion-text-uppercase"
                            />
                        </IonItem>

                        <IonItem>
                            <IonInput
                                label="Supplier ID"
                                labelPlacement="floating"
                                value={supplierId}
                                onIonChange={(e) => setSupplierId(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonInput
                                label="BOM Header Description"
                                labelPlacement="floating"
                                value={description}
                                onIonChange={(e) => setDescription(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonInput
                                label="EAN Code BOM header"
                                labelPlacement="floating"
                                value={eanCode}
                                onIonChange={(e) => setEanCode(e.detail.value ?? "")}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonInput
                                label="Signature"
                                labelPlacement="floating"
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
                                            <IonInput
                                                label="Component ID"
                                                labelPlacement="floating"
                                                value={item.componentCode}
                                                onIonChange={(e) =>
                                                    handleItemChange(index, "componentCode", e.detail.value ?? "")
                                                }
                                                required
                                                class="ion-text-uppercase"
                                            />
                                        </IonItem>
                                    </IonCol>

                                    <IonCol size="4">
                                        <IonItem>
                                            <IonInput
                                                label="Component Description"
                                                labelPlacement="floating"
                                                value={item.componentDescription}
                                                onIonChange={(e) =>
                                                    handleItemChange(index, "componentDescription", e.detail.value ?? "")
                                                }
                                                required
                                            />
                                        </IonItem>
                                    </IonCol>

                                    <IonCol size="2">
                                        <IonItem>
                                            <IonInput
                                                label="Component EAN"
                                                labelPlacement="floating"
                                                value={item.componentEAN}
                                                onIonChange={(e) =>
                                                    handleItemChange(index, "componentEAN", e.detail.value ?? "")
                                                }
                                                required
                                            />
                                        </IonItem>
                                    </IonCol>

                                    <IonCol size="1">
                                        <IonItem>
                                            <IonInput
                                                label="Unit Cost"
                                                labelPlacement="floating"
                                                type="number"
                                                min={0}
                                                step="0.01"
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

                                            <IonInput
                                                label="Qty"
                                                labelPlacement="floating"
                                                type="number"
                                                min={0}
                                                max={item.stockQty}
                                                value={item.componentQuantity || 0}
                                                onIonChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "componentQuantity",
                                                        Number(e.detail.value)
                                                    )
                                                }
                                                required
                                            />
                                        </IonItem>
                                    </IonCol>

                                    <IonCol size="2" className="ion-text-center">

                                        <IonBadge color="primary">Max: {item.stockQty}</IonBadge>

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
                        disabled={!id}
                    >
                        <IonIcon icon={add} slot="start" />
                        Add Item
                    </IonButton>

                    <IonButton
                        expand="block"
                        type="submit"
                        className="ion-margin-top"
                        disabled={!id}
                    >
                        Submit as a Job
                    </IonButton>
                </form>

                <IonToast
                    isOpen={showToast}
                    message="Item added successfully!"
                    duration={2000}
                    onDidDismiss={() => setShowToast(false)}
                />
            </>
        </>

    );

};

export default JobTemplate;
