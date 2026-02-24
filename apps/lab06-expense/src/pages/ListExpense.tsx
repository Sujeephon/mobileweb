import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonModal,
    IonButton,
    IonInput,
    IonTextarea,
    IonSegment,
    IonSegmentButton,
} from '@ionic/react';

import { closeOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { IonAlert } from '@ionic/react';
import './ListExpense.css';


interface Expense {
    id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    note: string;
    createdAt: any;
}

const ListExpense: React.FC = () => {

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [editTitle, setEditTitle] = useState('');
    const [editAmount, setEditAmount] = useState<number>(0);
    const [editType, setEditType] = useState<'income' | 'expense'>('expense');
    const [editCategory, setEditCategory] = useState('');
    const [editNote, setEditNote] = useState('');
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    useEffect(() => {

        const q = query(
            collection(db, 'expenses'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {

            const data: Expense[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Expense, 'id'>)
            }));

            setExpenses(data);

            let income = 0;
            let expense = 0;

            data.forEach((item) => {
                if (item.type === 'income') {
                    income += item.amount;
                } else {
                    expense += item.amount;
                }
            });

            setTotalIncome(income);
            setTotalExpense(expense);
        });

        return () => unsubscribe();

    }, []);

    const openEdit = (item: Expense) => {
        setSelectedId(item.id);
        setEditTitle(item.title);
        setEditAmount(item.amount);
        setEditType(item.type);
        setEditCategory(item.category);
        setEditNote(item.note);
        setIsOpen(true);
    };

    const updateExpense = async () => {
        if (!selectedId) return;

        await updateDoc(doc(db, 'expenses', selectedId), {
            title: editTitle,
            amount: Number(editAmount) || 0,
            type: editType,
            category: editCategory,
            note: editNote
        });

        setIsOpen(false);
    };

    const deleteExpense = async () => {
        if (!selectedId) return;

        const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?');

        if (!confirmDelete) return;

        await deleteDoc(doc(db, 'expenses', selectedId));

        setIsOpen(false);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>ListExpense</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">

                <IonCard>
                    <IonCardContent>
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonText color="primary">
                                        <h3>รายรับ</h3>
                                        <h2>{totalIncome.toLocaleString()} บาท</h2>
                                    </IonText>
                                </IonCol>
                                <IonCol>
                                    <IonText color="danger">
                                        <h3>รายจ่าย</h3>
                                        <h2>{totalExpense.toLocaleString()} บาท</h2>
                                    </IonText>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>

                <IonList>
                    {expenses.map((item) => (
                        <IonItem
                            key={item.id}
                            button
                            onClick={() => openEdit(item)}
                        >
                            <IonLabel>
                                <h2>{item.title}</h2>
                                <p>{item.category}</p>
                            </IonLabel>

                            <IonText
                                slot="end"
                                color={item.type === 'income' ? 'primary' : 'danger'}
                            >
                                {item.type === 'income' ? '+' : '-'}
                                {item.amount.toLocaleString()}
                            </IonText>
                        </IonItem>
                    ))}
                </IonList>

                <IonModal
                    isOpen={isOpen}
                    backdropDismiss={false}
                    onDidDismiss={() => setIsOpen(false)}
                    className="edit-modal"
                >
                    <div className="modal-wrapper">
                        <div className="edit-container">

                            <h2>แก้ไขรายการ</h2>
                            <IonButton
                                fill="clear"
                                className="close-button"
                                onClick={() => setIsOpen(false)}
                            >
                                <IonIcon icon={closeOutline} />
                            </IonButton>

                            <IonSegment
                                value={editType}
                                color={editType === 'income' ? 'primary' : 'danger'}
                                onIonChange={(e) =>
                                    setEditType(e.detail.value as 'income' | 'expense')
                                }
                            >
                                <IonSegmentButton value="income">
                                    <IonLabel>รายรับ</IonLabel>
                                </IonSegmentButton>
                                <IonSegmentButton value="expense">
                                    <IonLabel>รายจ่าย</IonLabel>
                                </IonSegmentButton>
                            </IonSegment>

                            <div className="edit-grid">
                                <IonInput
                                    label="ชื่อรายการ"
                                    labelPlacement="stacked"
                                    value={editTitle}
                                    onIonChange={(e) => setEditTitle(e.detail.value || '')}
                                />

                                <IonInput
                                    label="จำนวนเงิน"
                                    labelPlacement="stacked"
                                    type="number"
                                    value={editAmount}
                                    onIonChange={(e) =>
                                        setEditAmount(Number(e.detail.value) || 0)
                                    }
                                />

                                <IonInput
                                    label="หมวดหมู่"
                                    labelPlacement="stacked"
                                    value={editCategory}
                                    onIonChange={(e) => setEditCategory(e.detail.value || '')}
                                />

                                <IonTextarea
                                    label="หมายเหตุ"
                                    labelPlacement="stacked"
                                    autoGrow
                                    value={editNote}
                                    onIonChange={(e) => setEditNote(e.detail.value || '')}
                                />
                            </div>

                            <div className="edit-actions">

                                <IonButton
                                    color="danger"
                                    onClick={() => setShowDeleteAlert(true)}
                                >
                                    ลบรายการ
                                </IonButton>

                                <IonButton
                                    color="primary"
                                    onClick={updateExpense}
                                >
                                    บันทึกการแก้ไข
                                </IonButton>

                            </div>

                        </div>
                    </div>
                </IonModal>
                <IonAlert
                    isOpen={showDeleteAlert}
                    header="ยืนยันการลบ"
                    message="คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?"
                    onDidDismiss={() => setShowDeleteAlert(false)}
                    buttons={[
                        {
                            text: 'ยกเลิก',
                            role: 'cancel',
                            handler: () => setShowDeleteAlert(false)
                        },
                        {
                            text: 'ลบ',
                            role: 'destructive',
                            handler: async () => {
                                if (selectedId) {
                                    await deleteDoc(doc(db, 'expenses', selectedId));
                                    setIsOpen(false);
                                    setShowDeleteAlert(false);
                                }
                            }
                        }
                    ]}
                />

            </IonContent>
        </IonPage>
    );
};

export default ListExpense;