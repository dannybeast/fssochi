// slicer text
export function slicer(text, limit) {
    text = text.trim();
    if (text.length <= limit) return text;
    text = text.slice(0, limit);
    return text.trim() + '...';
}