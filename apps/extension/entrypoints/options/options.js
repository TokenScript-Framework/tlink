// Saves options to chrome.storage
const saveOptions = () => {
	const use_popup_window = document.getElementById('use_popup_window').checked;

	chrome.storage.sync.set(
		{ use_popup_window },
		() => {
			// Update status to let user know options were saved.
			const status = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(() => {
				status.textContent = '';
			}, 750);
		}
	);
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
	chrome.storage.sync.get(
		{ use_popup_window: false },
		(items) => {
			document.getElementById('use_popup_window').checked = items.use_popup_window;
		}
	);
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
