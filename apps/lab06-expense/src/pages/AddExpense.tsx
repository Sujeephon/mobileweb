import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonTextarea,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonText
} from '@ionic/react';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useHistory } from 'react-router-dom';

const AddExpense: React.FC = () => {

    const history = useHistory();

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState<number | undefined>(undefined);
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');

    const saveExpense = async () => {

        if (!title || !amount) {
            alert("กรุณากรอกข้อมูลให้ครบ");
            return;
        }

        await addDoc(collection(db, 'expenses'), {
            title,
            amount: Number(amount),
            type,
            category,
            note,
            createdAt: new Date()
        });

        history.push('/list-expense');
    };

    return (
        <IonPage>

            <IonHeader>
                <IonToolbar>
                    <IonTitle>AddExpense</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">

                <div
                    style={{
                        width: '90%',
                        maxWidth: 1100,
                        margin: '40px auto',
                        background: '#ffffff',
                        padding: '40px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                    }}
                >

                    <div style={{ marginBottom: 32 }}>
                        <h2 style={{ marginBottom: 8 }}>สร้างรายการใหม่</h2>
                        <IonText color="medium">
                            เพิ่มข้อมูลรายรับหรือรายจ่ายของคุณ
                        </IonText>
                    </div>

                    <IonSegment
                        value={type}
                        color={type === 'income' ? 'primary' : 'danger'}
                        style={{ marginBottom: 32 }}
                        onIonChange={(e) =>
                            setType(e.detail.value as 'income' | 'expense')
                        }
                    >
                        <IonSegmentButton value="income">
                            <IonLabel>รายรับ</IonLabel>
                        </IonSegmentButton>

                        <IonSegmentButton value="expense">
                            <IonLabel>รายจ่าย</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '24px'
                        }}
                    >
                        <IonInput
                            label="ชื่อรายการ"
                            labelPlacement="stacked"
                            placeholder="เช่น ค่ากาแฟ"
                            value={title}
                            onIonChange={(e) => setTitle(e.detail.value!)}
                        />

                        <IonInput
                            label="จำนวนเงิน"
                            labelPlacement="stacked"
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onIonChange={(e) => setAmount(Number(e.detail.value))}
                        />

                        <IonInput
                            label="หมวดหมู่"
                            labelPlacement="stacked"
                            placeholder="เช่น อาหาร"
                            value={category}
                            onIonChange={(e) => setCategory(e.detail.value!)}
                        />

                        <IonTextarea
                            label="หมายเหตุ"
                            labelPlacement="stacked"
                            autoGrow
                            value={note}
                            onIonChange={(e) => setNote(e.detail.value!)}
                        />
                    </div>

                    <div
                        style={{
                            marginTop: 40,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 16
                        }}
                    >

                        <IonButton
                            color={type === 'income' ? 'primary' : 'danger'}
                            onClick={saveExpense}
                        >
                            บันทึกข้อมูล
                        </IonButton>
                    </div>

                </div>

            </IonContent>
        </IonPage>
    );
};

export default AddExpense;