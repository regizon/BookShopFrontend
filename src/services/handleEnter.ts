export default function handleEnter(event: { key: string }, action: () => void) {
    if(event.key === 'Enter') {
        action()
    }
}