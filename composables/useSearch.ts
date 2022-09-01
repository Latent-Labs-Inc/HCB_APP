export default function useSearch(items, target, searchProps) {
	const filteredItems = computed(() => {
		let splitTarget = target.value.toLowerCase().split(" ");
		return items.value.filter((item) => {
			if (item[searchProps[0]].includes(splitTarget[0] || splitTarget[1])) {
				return true;
			}
			if (searchProps.length > 1) {
				if (item[searchProps[1]].includes(splitTarget[0] || splitTarget[1])) {
					return true;
				}
			}
			if (searchProps.length > 2) {
				if (item[searchProps[2]].includes(splitTarget[0] || splitTarget[1])) {
					return true;
				}
			}
			return false;
		});
	});

	return {
		filteredItems,
	};
}
