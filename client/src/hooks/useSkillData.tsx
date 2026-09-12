import { useEffect, useState } from 'react';
import { Skill } from '../types';

type SkillsResponse = {
  skills: Skill[];
  total_sp: number;
  unallocated_sp: number;
};

function useSkillData(characterId: number | null) {
	const [skillData, setSkillData] = useState<SkillsResponse | null>(null);

	useEffect(() => {
		if (!characterId) return;

		async function load() {
			const res = await fetch('');
			const json = await res.json();
			setSkillData(json)
		}

		load();
	}, [characterId]);

	return skillData;
}

export default useSkillData;