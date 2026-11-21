// TypeScript "type": describes the shape of an object. Once you write
// this, TypeScript will complain if you try to use `.characterName`
// as a number, or misspell a field — that's the whole value of TS.
export type Me = {
	characterId: number;
	characterName: string;
};

export type Skill = {
	active_skill_level: number;
	skill_id: number;
	trained_skill_level: number;
};

export type UniverseNameResponse = {
	category: string;
	id: number;
	name: string;
}

export type PageType = 'overview' | 'skills' | 'industry' | 'fittings' | 'assets' | 'wallet' | 'contracts' | 'market' | 'mail';