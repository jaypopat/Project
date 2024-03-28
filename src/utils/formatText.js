export const formatText = (text) => {
    let formattedText = text.replace(/&nbsp;|<br>|&lt;|&gt;|&amp;|<[^>]*>/g, '');
    formattedText = formattedText.trim();

    return formattedText;
}