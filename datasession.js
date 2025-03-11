function storeData(element) {
    const store = (key, value, storage) => value ? storage.setItem(key, value) : storage.removeItem(key);

    const sessionId = element.getAttribute('data-session');
    if (sessionId) {
        store(`data-session:${sessionId}`, element.value, sessionStorage);
    }

    const localId = element.getAttribute('data-local');
    if (localId) {
        store(`data-local:${localId}`, element.value, localStorage);
    }
}

function restoreData(element) {
    const restore = (key, storage) => storage.getItem(key);

    const sessionId = element.getAttribute('data-session');
    if (sessionId) {
        const savedValue = restore(`data-session:${sessionId}`, sessionStorage);
        if (savedValue) {
            element.value = savedValue;
        }
    }

    const localId = element.getAttribute('data-local');
    if (localId) {
        const savedValue = restore(`data-local:${localId}`, localStorage);
        if (savedValue) {
            element.value = savedValue;
        }
    }
}

function resetData() {
    const reset = (selector, storage) => {
        document.querySelectorAll(selector).forEach(element => {
            const id = element.getAttribute(selector.slice(1, -1));
            storage.removeItem(`${selector.slice(1)}:${id}`);
            element.value = '';
        });
    };

    reset('[data-session]', sessionStorage);
    reset('[data-local]', localStorage);
}

function initData() {
    document.querySelectorAll('[data-session], [data-local]').forEach(element => {
        restoreData(element);
        element.addEventListener('change', () => storeData(element));

        if (['INPUT', 'TEXTAREA'].includes(element.tagName)) {
            element.addEventListener('keyup', () => storeData(element));
        }
    });
}

// Initial Data Restore
document.addEventListener('DOMContentLoaded', initData);
window.addEventListener('popstate', () => setTimeout(initData, 0));
window.addEventListener('storage', event => {
    (event.key && event.key.startsWith('data-')) ? initData() : null;
});

// HTMX support
if (typeof htmx !== 'undefined') {
    htmx.on('htmx:afterSettle', initData);
    htmx.on('htmx:afterSwap', initData);
    htmx.on('load', initData);
}