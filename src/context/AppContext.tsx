import { createContext, useContext, useMemo, useState } from 'react';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
	const [selectedGuest, setSelectedGuest] = useState(null);
	const [selectedSegment, setSelectedSegment] = useState('All');
	const [globalFilters, setGlobalFilters] = useState({
		timeframe: '30d',
	});

	const value = useMemo(
		() => ({
			selectedGuest,
			setSelectedGuest,
			selectedSegment,
			setSelectedSegment,
			globalFilters,
			setGlobalFilters,
		}),
		[selectedGuest, selectedSegment, globalFilters]
	);

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppContext must be used within AppProvider');
	}
	return context;
}
