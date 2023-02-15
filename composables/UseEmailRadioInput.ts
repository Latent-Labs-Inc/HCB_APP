export const useEmailRadioInput = () => {
	const type = ref<'probates' | 'attorneys' | 'cashOffer'>('attorneys');
	const skipTrace = ref<
		'propstream' | 'clearSkip_probate' | 'clearSkip_regular'
	>('propstream');

	const options = [
		{ value: 'cashOffer', label: 'Cash Offer' },
		{ value: 'probates', label: 'Probates' },
		{ value: 'attorneys', label: 'Attorneys' },
		{ value: 'evictions', label: 'Evictions' },
		{ value: 'codeViolation', label: 'Code Violation' },
	];

	const skipTraceOptions = [
		{ value: 'propstream', label: 'Propstream' },
		{ value: 'clearSkip_probate', label: 'Clear Skip Probate' },
		{ value: 'clearSkip_regular', label: 'Clear Skip Regular' },
	];

	const handleOption = (value: string | boolean) => {
		type.value = value as 'probates' | 'attorneys' | 'cashOffer';
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
