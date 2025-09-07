let drawer = $state(false);

export function setDrawerState(newState: boolean) {
	drawer = newState;
}

export function getDrawerState() {
	return drawer;
}
