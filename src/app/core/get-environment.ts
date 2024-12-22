export function getEnvironment(name: string, key: string): string {
    const metadata = Array.from(document.getElementsByTagName('meta'));

    const el = metadata.find(e => e.getAttribute('name') === name);

    return el?.getAttribute(key) ?? '';
}