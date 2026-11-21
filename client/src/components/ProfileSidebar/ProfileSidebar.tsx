import { useEffect, useState } from 'react';

import { Me, UniverseNameResponse } from '../../types';
import styles from './ProfileSidebar.module.css'
import LoadingDiv from '../LoadingDiv/LoadingDiv';
import AffiliationBadge from '../AffiliationBadge/AffiliationBadge';
import usePortrait from '../../hooks/usePortrait';
import useOnlineStatus from '../../hooks/useOnlineStatus';
import useCharacterInfo from '../../hooks/useCharacterInfo';
import OnlineIndicator from '../OnlineIndicator/OnlineIndicator';
import { getAllianceIcon, getCorporationIcon } from '../../utils/eveImages';


type ProfileSidebarProps = {
	me: Me
};

type AffiliationIcons = {
	allianceIcon: string | null;
	corporationIcon: string | null;
};

type AffiliationNames = {
	allianceName: string | null;
	corporationName: string | null;
}

function ProfileSidebar({ me }: ProfileSidebarProps) {
	const characterInfo = useCharacterInfo(me.characterId);
	const portraits = usePortrait(me.characterId);
	
	const [affiliationIcons, setAffiliationIcons] = useState<AffiliationIcons>({
		allianceIcon: null,
		corporationIcon: null,
	});
	const [affiliationNames, setAffiliationNames] = useState<AffiliationNames>({
		allianceName: null,
		corporationName: null,
	});

	useEffect(() => {
		async function loadAffiliations() {
			if (!characterInfo) return;

			fetch('http://localhost:4000/api/universe_names', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify([characterInfo.alliance_id, characterInfo.corporation_id].filter((id): id is number => id != null))
			})
			.then(res => res.json())
			.then((data: UniverseNameResponse[]) => {
				if (data.length) {
					setAffiliationNames({
						allianceName: data.find(name => name.id === characterInfo.alliance_id)?.name ?? null,
						corporationName: data.find(name => name.id === characterInfo.corporation_id)?.name ?? null,
					});

					setAffiliationIcons({
						allianceIcon: getAllianceIcon(characterInfo.alliance_id),
						corporationIcon: getCorporationIcon(characterInfo.corporation_id)
					});
				}
			});
		}
		
		loadAffiliations();
	}, [characterInfo]);
	
	return (
		<div className={styles.profileSidebar}>
			<div className={styles.profileHeader}>
				<div className={styles.leftSideHeader}>
					{portraits ? <img src={portraits['px256x256']} width={256} height={256} /> : <LoadingDiv width={256} height={256} />}
					<div className={styles.characterName}>
						<h1>{me.characterName}</h1>
						<OnlineIndicator characterID={me.characterId} />
					</div>
					<span>Security Status: {characterInfo?.security_status}</span>
				</div>
				<div className={styles.rightSideHeader}>
					<div className={styles.affiliationBadges}>
						{characterInfo?.alliance_id ? <AffiliationBadge title={'Alliance'} icon={affiliationIcons.allianceIcon} name={affiliationNames.allianceName} width={50} height={50} /> : <></>}
						<AffiliationBadge title={'Corporation'} icon={affiliationIcons.corporationIcon} name={affiliationNames.corporationName} width={50} height={50} />
					</div>
					{/* <p>Character ID: {me.characterId}</p>
					{skillPointData ? (
						<>
							<p>Total SP: {skillPointData.total_sp}</p>
							{skillPointData.unallocated_sp > 0 && (
								<p>Unallocated: {skillPointData.unallocated_sp}</p>
							)}
						</>
					) : (
						<span>Loading...</span>
					)} */}
				</div>
			</div>
		</div>
	);
}

export default ProfileSidebar;