import type { EditorTypes, UserImageAPIData } from '$lib/types';

/** Form Modal State Management **/
let formModal = $state(false);

export function toggleFormModalState() {
	formModal = formModal === false ? true : false;
}

export function getFormModalState() {
	return formModal;
}

export function setFormModalState(newState: boolean) {
	formModal = newState;
}

/** Selection Modal State Management **/
let selectionModal = $state(false);

export function toggleSelectionModalState() {
	selectionModal = selectionModal === false ? true : false;
}

export function getSelectionModalState() {
	return selectionModal;
}

export function setSelectionModalState(newState: boolean) {
	selectionModal = newState;
}

/** Image Data Fetch State Management **/

let fetchData: UserImageAPIData | null;
let myPage = $state(1);
let limit = $state(6);
let total = <UserImageAPIData['total']>$state(0);
let items = <UserImageAPIData['images']>$state([]);

export async function fetchImageData() {
	try {
		const response = await fetch(`/api/images/me?page=${myPage}&limit=${limit}`);
		fetchData = await response.json();
		items = fetchData?.images;
		total = fetchData?.total;

		console.log(fetchData);
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

export function nextPage() {
	if (total && myPage * limit < total) {
		myPage++;
		fetchImageData();
	}
}

export function prevPage() {
	if (myPage > 1) {
		myPage--;
		fetchImageData();
	}
}

export function setPage(newPage: number) {
	myPage = newPage;
	fetchImageData();
}

export function getPage() {
	return myPage;
}

export function setLimit(updatedLimit: number) {
	limit = updatedLimit;
}

export function getLimit() {
	return limit;
}

export function getItems() {
	return items;
}

export function getTotal(): UserImageAPIData['total'] {
	return total;
}

/** Selected Image State Management **/
let selectedImage = $state('');

export function imageSelectionEvent(event: Event) {
	const target = event.currentTarget as HTMLElement;
	selectedImage = target.children[0].children[0].getAttribute('src') ?? '';
	selectionModal = false;
	console.log(selectedImage);
}

export function getSelectedImage() {
	return selectedImage;
}

/** Toast Status State Management */
let toastStatus = $state(false);

export function getToastStatus() {
	return toastStatus;
}

export function setToastStatus(newState: boolean) {
	toastStatus = newState;
}

export function toggleToastStatusState() {
	toastStatus = toastStatus === false ? true : false;
}

/** Editor State Management **/
let editor: EditorTypes = $state();

export function setEditorState(newState: EditorTypes) {
	editor = newState;
}

export function getEditorState(): EditorTypes {
	return editor;
}
