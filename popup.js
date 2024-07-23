document.addEventListener('DOMContentLoaded', () => {
    const fileSelect = document.getElementById('file-select');
    const saveButton = document.getElementById('save');
    const githubLinkButton = document.getElementById('github-link');

    // Загрузка сохраненного значения
    chrome.storage.sync.get('selectedFile', (data) => {
        if (data.selectedFile) {
            fileSelect.value = data.selectedFile;
        }
    });

    // Сохранение выбранного файла
    saveButton.addEventListener('click', () => {
        console.log('Кнопка сохранения нажата');
        const selectedFile = fileSelect.value;

        if (selectedFile === "original") {
            console.log('Выбрано: Оригинал, замены не произойдет');
            chrome.storage.sync.set({ selectedFile: 'original' }, () => {
                console.log('Сохранено: Оригинал');
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    chrome.tabs.reload(tabs[0].id);
                });
            });
        } else if (selectedFile) {
            chrome.storage.sync.set({ selectedFile: selectedFile }, () => {
                console.log('Сохранено:', selectedFile);
                setTimeout(() => {
                    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                        chrome.tabs.reload(tabs[0].id);
                    });
                }, 100);
            });
        } else {
            console.log('Выберите файл перед сохранением');
        }
    });

    // Переход на GitHub по кнопке
    githubLinkButton.addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://github.com/K0XAN/PoE-ninja-Ru' });
    });
});
