export default function isEmailValid(email: string) {
    if (!email || email.length === 0) return false;
    const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    return emailRegex.test(email);
}