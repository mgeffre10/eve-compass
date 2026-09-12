import { useEffect, useState } from 'react';

type PortraitResponse = {
  "px128x128": string;
  "px256x256": string;
  "px512x512": string;
  "px64x64": string;
}

function usePortrait(characterId: number | null) {
	const [portrait, setPortrait] = useState<string | null>(null);

	useEffect(() => {
		if (!characterId) return;

		async function load() {
			const res = await fetch("http://localhost:4000/api/portrait");
			const json = await res.json();
			setPortrait(json['px256x256']);
		}
		
		load();
	}, [characterId]);

	return portrait;
}

export default usePortrait;