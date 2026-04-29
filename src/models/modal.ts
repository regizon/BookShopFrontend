export type modalVariations = 'login' | 'registration' | 'cart' | 'successBook' | null

export interface ModalOptions {
    onAddAnother?: () => void;
    onCheckAddedPage?: () => void;
}