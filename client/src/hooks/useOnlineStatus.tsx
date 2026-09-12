import { useEffect, useState } from 'react';

type CharacterOnlineResponse = {
	last_login: string;
	last_logout: string;
	logins: number;
	online: boolean;
}

function useOnlineStatus(characterId: number | null) {
	const [onlineStatus, setOnlineStatus] = useState<CharacterOnlineResponse | null>(null);

	useEffect(() => {
		if (!characterId) return;

		async function load() {
			const res = await fetch('http://localhost:4000/api/character_status');
			const json = await res.json();
			setOnlineStatus(json)
		}

		load();
	}, [characterId]);

	return onlineStatus
}

export default useOnlineStatus;