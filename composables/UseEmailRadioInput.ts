export const useEmailRadioInput = () => {
	const type = ref<
		| 'probate'
		| 'attorney'
		| 'cashOffer'
		| 'eviction'
		| 'codeViolation'
		| 'foreclosure'
	>('attorney');
	const skipTrace = ref<
		'propstream' | 'clearSkip_probate' | 'clearSkip_regular'
	>('propstream');

	const options = [
		{ value: 'cashOffer', label: 'Cash Offer' },
		{ value: 'probate', label: 'Probates' },
		{ value: 'attorney', label: 'Attorneys' },
		{ value: 'eviction', label: 'Evictions' },
		{ value: 'codeViolation', label: 'Code Violation' },
		{ value: 'foreclosure', label: 'Foreclosure' },
	];

	const skipTraceOptions = [
		{ value: 'propstream', label: 'Propstream' },
		{ value: 'clearSkip_probate', label: 'Clear Skip Probate' },
		{ value: 'clearSkip_regular', label: 'Clear Skip Regular' },
	];

	const handleOption = (value: string | boolean) => {
		type.value = value as
			| 'probate'
			| 'attorney'
			| 'cashOffer'
			| 'eviction'
			| 'codeViolation'
			| 'foreclosure';
	};

	const handleSkipOptions = (value: string | boolean) => {
		skipTrace.value = value as
			| 'propstream'
			| 'clearSkip_probate'
			| 'clearSkip_regular';
	};
	return {
		type,
		skipTrace,
		options,
		skipTraceOptions,
		handleOption,
		handleSkipOptions,
	};
};
