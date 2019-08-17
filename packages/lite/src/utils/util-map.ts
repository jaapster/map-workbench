export const disableInteractions = (map: any) => {
	if (map != null) {
		map.boxZoom.disable();
		map.dragPan.disable();
		map.dragRotate.disable();
		map.scrollZoom.disable();
		map.doubleClickZoom.disable();
	}
};
