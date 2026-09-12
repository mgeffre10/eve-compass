import { useEffect, useState } from "react";

type CharacterInfoResponse = {
	alliance_id: number;
	corporation_id: number;
	faction_id: number;
	race_id: number;
	security_status: number;
}

function useCharacterInfo(characterId: number | null) {
	const [characterInfo, setCharacterInfo] = useState<CharacterInfoResponse | null>(null);

	useEffect(() => {
		if (!characterId) return;

		async function load() {
			const res = await fetch('http://localhost:4000/api/character_info');
			const json = await res.json();
			setCharacterInfo(json);
		}

		load();
	}, [characterId])

	return characterInfo;
}

export default useCharacterInfo;