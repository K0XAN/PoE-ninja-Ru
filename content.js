async function loadReplacements(fileName) {
    try {
        console.log('Загрузка файла:', chrome.runtime.getURL(fileName));
        const response = await fetch(chrome.runtime.getURL(fileName));
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        const replacements = {};

        text.split('\n').forEach(line => {
            const parts = line.split('->');
            if (parts.length === 2) {
                replacements[parts[0].trim()] = parts[1].trim();
            }
        });

        return replacements;
    } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        throw error;
    }
}

function replaceTextInNode(node, replacements) {
    if (node.nodeType === Node.TEXT_NODE) {
        let originalText = node.nodeValue;
        let newText = originalText;

        // Проверка на наличие знаков ( или )
        if (originalText.includes('(') || originalText.includes(')')) {
            return;
        }

        for (const [key, value] of Object.entries(replacements)) {
            const regex = new RegExp(`^${key}$`, 'g');

            // Заменяем только если новое значение ещё не присутствует
            if (regex.test(newText) && !newText.includes(value)) {
                newText = newText.replace(regex, value);
            }
        }

        if (newText !== originalText) {
            node.nodeValue = newText;
        }
    } else {
        node.childNodes.forEach(child => replaceTextInNode(child, replacements));
    }
}

async function replaceText(fileName) {
    try {
        const replacements = await loadReplacements(fileName);
        replaceTextInNode(document.body, replacements);
        monitorShowMore(replacements);
    } catch (error) {
        console.error('Ошибка при замене текста:', error);
    }
}

function monitorShowMore(replacements) {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    replaceTextInNode(node, replacements);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

async function getSelectedFile() {
    const { selectedFile } = await chrome.storage.sync.get('selectedFile');
    return selectedFile || 'replacements.txt';
}

async function initiateTextReplacement() {
    const selectedFile = await getSelectedFile();
    await replaceText(selectedFile);
}

// Инициализация замены текста
initiateTextReplacement();
