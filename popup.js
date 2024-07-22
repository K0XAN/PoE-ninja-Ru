document.addEventListener('DOMContentLoaded', () => {
    const fileSelect = document.getElementById('file-select');
    const saveButton = document.getElementById('save');

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

        // Обработка оригинала
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
                // Задержка перед обновлением страницы
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
});
