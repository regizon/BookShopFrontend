import { useEffect, useState, type JSX } from "react";
import styles from "./AdminOrdersPage.module.css";
import {
    adminOrdersList,
    updateAdminOrder,
    type AdminOrderType,
    type AdminOrderUpdate,
} from "../../services/adminOrder.service.ts";

const DELIVERY_STATUS_OPTIONS: string[] = ["pending", "shipped", "cancelled"];
const PAYMENT_STATUS_OPTIONS: string[] = ["paid", "unpaid", "failed", "refunded", "partially_refunded"];
const DELIVERY_TYPE_OPTIONS: string[] = ["self", "courier"];
const PAYMENT_METHOD_OPTIONS: string[] = ["online", "offline"];

const deliveryStatusLabels: Record<string, string> = {
    pending: "Очікується",
    shipped: "Доставлено",
    cancelled: "Скасовано",
};

const paymentStatusLabels: Record<string, string> = {
    paid: "Сплачено",
    unpaid: "Не сплачено",
    failed: "Помилка оплати",
    refunded: "Повернуто",
    partially_refunded: "Частково повернуто",
};

const deliveryTypeLabels: Record<string, string> = {
    self: "Самовивіз",
    courier: "Кур'єр",
};

const paymentMethodLabels: Record<string, string> = {
    online: "Онлайн",
    offline: "Офлайн",
};

type EditFormState = {
    name: string;
    surname: string;
    phone: string;
    email: string;
    delivery_status: string;
    payment_status: string;
    comments: string;
    delivery_type: string;
    payment_method: string;
    city: string;
    street: string;
    house: string;
    apartment: string;
};

function formFromOrder(order: AdminOrderType): EditFormState {
    return {
        name: order.name,
        surname: order.surname,
        phone: order.phone,
        email: order.email,
        delivery_status: order.delivery_status,
        payment_status: order.payment_status,
        comments: order.comments,
        delivery_type: order.delivery_type,
        payment_method: order.payment_method,
        city: order.city,
        street: order.street,
        house: order.house,
        apartment: order.apartment,
    };
}

interface OrderCardProps {
    order: AdminOrderType;
    isActive: boolean;
    onEdit: (order: AdminOrderType) => void;
}

function OrderCard({ order, isActive, onEdit }: OrderCardProps): JSX.Element {
    const [isExpanded, setIsExpanded] = useState(false);

    const date = new Date(order.order_date).toLocaleDateString("ua-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader} onClick={() => setIsExpanded(!isExpanded)}>
                <div className={styles.cardHeaderMain}>
                    <span className={styles.orderId}>#{order.id}</span>
                    <span className={styles.customerName}>{order.name} {order.surname}</span>
                    <span className={styles.orderDate}>{date}</span>
                    <span className={`${styles.badge} ${styles["badge_" + order.delivery_status]}`}>
                        {deliveryStatusLabels[order.delivery_status] ?? order.delivery_status}
                    </span>
                    <span className={styles.totalPrice}>{order.total_price} грн.</span>
                </div>
                <span className={styles.expandIcon}>{isExpanded ? "▲" : "▼"}</span>
            </div>

            {isExpanded && (
                <div className={styles.cardBody}>
                    <div className={styles.orderGrid}>
                        <div className={styles.orderSection}>
                            <span className={styles.orderSectionTitle}>Контакти</span>
                            <div className={styles.orderRow}><span className={styles.orderLabel}>Телефон</span><span>{order.phone}</span></div>
                            <div className={styles.orderRow}><span className={styles.orderLabel}>Email</span><span>{order.email}</span></div>
                        </div>

                        <div className={styles.orderSection}>
                            <span className={styles.orderSectionTitle}>Доставка</span>
                            <div className={styles.orderRow}><span className={styles.orderLabel}>Тип</span><span>{deliveryTypeLabels[order.delivery_type] ?? order.delivery_type}</span></div>
                            <div className={styles.orderRow}><span className={styles.orderLabel}>Місто</span><span>{order.city}</span></div>
                            <div className={styles.orderRow}><span className={styles.orderLabel}>Вулиця</span><span>{order.street}</span></div>
                            <div className={styles.orderRow}><span className={styles.orderLabel}>Будинок</span><span>{order.house}</span></div>
                            {order.apartment && (
                                <div className={styles.orderRow}><span className={styles.orderLabel}>Квартира</span><span>{order.apartment}</span></div>
                            )}
                        </div>

                        <div className={styles.orderSection}>
                            <span className={styles.orderSectionTitle}>Оплата</span>
                            <div className={styles.orderRow}><span className={styles.orderLabel}>Метод</span><span>{paymentMethodLabels[order.payment_method] ?? order.payment_method}</span></div>
                            <div className={styles.orderRow}><span className={styles.orderLabel}>Статус</span><span>{paymentStatusLabels[order.payment_status] ?? order.payment_status}</span></div>
                        </div>

                        {order.comments && (
                            <div className={styles.orderSection}>
                                <span className={styles.orderSectionTitle}>Коментар</span>
                                <span className={styles.commentText}>{order.comments}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.itemsSection}>
                        <span className={styles.orderSectionTitle}>Товари</span>
                        {order.items.map((item, idx) => (
                            <div key={idx} className={styles.itemRow}>
                                <span className={styles.itemTitle}>{item.item.title}</span>
                                <span className={styles.itemQty}>×{item.quantity}</span>
                                <span className={styles.itemPrice}>{item.price} грн.</span>
                            </div>
                        ))}
                    </div>

                    {isActive && (
                        <div className={styles.cardActions}>
                            <button className={styles.editBtn} onClick={() => onEdit(order)}>
                                Редагувати
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function AdminOrdersPage(): JSX.Element {
    const [orders, setOrders] = useState<AdminOrderType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"active" | "history">("active");
    const [editingOrder, setEditingOrder] = useState<AdminOrderType | null>(null);
    const [editForm, setEditForm] = useState<EditFormState | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrders() {
            setIsLoading(true);
            setError(null);
            try {
                const data = await adminOrdersList();
                setOrders(data);
            } catch {
                setError("Помилка завантаження замовлень. Спробуйте оновити сторінку.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchOrders();
    }, []);

    const activeOrders = orders.filter(
        (o) => o.delivery_status !== "shipped" && o.delivery_status !== "cancelled"
    );
    const historyOrders = orders.filter(
        (o) => o.delivery_status === "shipped" || o.delivery_status === "cancelled"
    );

    function handleEditClick(order: AdminOrderType) {
        setEditingOrder(order);
        setEditForm(formFromOrder(order));
        setSaveError(null);
    }

    function handleCloseModal() {
        if (!isSaving) {
            setEditingOrder(null);
            setEditForm(null);
        }
    }

    function handleFieldChange(field: keyof EditFormState, value: string) {
        setEditForm((prev) => prev ? { ...prev, [field]: value } : prev);
    }

    async function handleSave() {
        if (!editingOrder || !editForm) return;
        setIsSaving(true);
        setSaveError(null);

        const payload: AdminOrderUpdate = { ...editForm };
        if (editingOrder.payment_status === "paid") {
            delete payload.payment_status;
        }

        try {
            const updated = await updateAdminOrder(editingOrder.id, payload);
            setOrders((prev) =>
                prev.map((o) => (o.id === editingOrder.id ? { ...o, ...updated } : o))
            );
            setEditingOrder(null);
            setEditForm(null);
        } catch {
            setSaveError("Помилка збереження. Спробуйте знову.");
        } finally {
            setIsSaving(false);
        }
    }

    const displayedOrders = activeTab === "active" ? activeOrders : historyOrders;

    if (isLoading) {
        return <div className={styles.stateMessage}>Завантаження...</div>;
    }

    if (error) {
        return <div className={`${styles.stateMessage} ${styles.errorState}`}>{error}</div>;
    }

    return (
        <div className={styles.content}>
            <span className={styles.caption}>Управління замовленнями</span>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === "active" ? styles.tabActive : ""}`}
                    onClick={() => setActiveTab("active")}
                >
                    Активні замовлення ({activeOrders.length})
                </button>
                <button
                    className={`${styles.tab} ${activeTab === "history" ? styles.tabActive : ""}`}
                    onClick={() => setActiveTab("history")}
                >
                    Історія замовлень ({historyOrders.length})
                </button>
            </div>

            {displayedOrders.length === 0 ? (
                <div className={styles.stateMessage}>Замовлень немає</div>
            ) : (
                <div className={styles.orderList}>
                    {displayedOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            isActive={activeTab === "active"}
                            onEdit={handleEditClick}
                        />
                    ))}
                </div>
            )}

            {editingOrder && editForm && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Редагування замовлення #{editingOrder.id}</h2>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>✕</button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.formSection}>
                                <h3 className={styles.formSectionTitle}>Клієнт</h3>
                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>Ім'я</label>
                                    <input
                                        className={styles.formInput}
                                        value={editForm.name}
                                        onChange={(e) => handleFieldChange("name", e.target.value)}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>Прізвище</label>
                                    <input
                                        className={styles.formInput}
                                        value={editForm.surname}
                                        onChange={(e) => handleFieldChange("surname", e.target.value)}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>Телефон</label>
                                    <input
                                        className={styles.formInput}
                                        value={editForm.phone}
                                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>Email</label>
                                    <input
                                        className={styles.formInput}
                                        value={editForm.email}
                                        onChange={(e) => handleFieldChange("email", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.formSection}>
                                <h3 className={styles.formSectionTitle}>Статус</h3>
                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>Статус доставки</label>
                                    <select
                                        className={styles.formSelect}
                                        value={editForm.delivery_status}
                                        onChange={(e) => handleFieldChange("delivery_status", e.target.value)}
                                    >
                                        {DELIVERY_STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>
                                                {deliveryStatusLabels[s]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>Статус оплати</label>
                                    <select
                                        className={styles.formSelect}
                                        value={editForm.payment_status}
                                        onChange={(e) => handleFieldChange("payment_status", e.target.value)}
                                        disabled={editingOrder.payment_status === "paid"}
                                    >
                                        {PAYMENT_STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>
                                                {paymentStatusLabels[s]}
                                            </option>
                                        ))}
                                    </select>
                                    {editingOrder.payment_status === "paid" && (
                                        <span className={styles.fieldNote}>
                                            Сплачений статус незмінний
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.formSection}>
                                <h3 className={styles.formSectionTitle}>Доставка та оплата</h3>
                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>Тип доставки</label>
                                    <select
                                        className={styles.formSelect}
                                        value={editForm.delivery_type}
                                        onChange={(e) => handleFieldChange("delivery_type", e.target.value)}
                                    >
                                        {DELIVERY_TYPE_OPTIONS.map((s) => (
                                            <option key={s} value={s}>
                                                {deliveryTypeLabels[s]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>Метод оплати</label>
                                    <select
                                        className={styles.formSelect}
                                        value={editForm.payment_method}
                                        onChange={(e) => handleFieldChange("payment_method", e.target.value)}
                                    >
                                        {PAYMENT_METHOD_OPTIONS.map((s) => (
                                            <option key={s} value={s}>
                                                {paymentMethodLabels[s]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>Місто</label>
                                    <input
                                        className={styles.formInput}
                                        value={editForm.city}
                                        onChange={(e) => handleFieldChange("city", e.target.value)}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>Вулиця</label>
                                    <input
                                        className={styles.formInput}
                                        value={editForm.street}
                                        onChange={(e) => handleFieldChange("street", e.target.value)}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>Будинок</label>
                                    <input
                                        className={styles.formInput}
                                        value={editForm.house}
                                        onChange={(e) => handleFieldChange("house", e.target.value)}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>Квартира</label>
                                    <input
                                        className={styles.formInput}
                                        value={editForm.apartment}
                                        onChange={(e) => handleFieldChange("apartment", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.formSection}>
                                <h3 className={styles.formSectionTitle}>Примітки</h3>
                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>Коментар</label>
                                    <textarea
                                        className={styles.formTextarea}
                                        value={editForm.comments}
                                        onChange={(e) => handleFieldChange("comments", e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {saveError && <div className={styles.saveError}>{saveError}</div>}

                        <div className={styles.modalFooter}>
                            <button
                                className={styles.cancelBtn}
                                onClick={handleCloseModal}
                                disabled={isSaving}
                            >
                                Скасувати
                            </button>
                            <button
                                className={styles.saveBtn}
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? "Збереження..." : "Зберегти"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrdersPage;
