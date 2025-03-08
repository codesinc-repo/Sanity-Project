'use client';

import React from 'react';
import Image from 'next/image';
import styles from './RamadanContent.module.css';

// ===== IMPORT IMAGES =====
import bigCardImg from './bigNewsCard.png'; // Big card image
import smallImg from './image.png'; // Shared by all small cards
import arrowRight from './Vector.svg'; // Arrow icon

export default function RamadanContent() {
	// 5 small cards => 2 columns means first row has 2, second row has 2, third row has 1
	const smallCardsData = [
		{
			date: '30 jan, 2025',
			title: 'Ramadan-timer – En digital följeslagare för fastan i Gottsunda Centrum',
			image: smallImg,
		},
		{
			date: '30 jan, 2025',
			title: 'Ramadan-timer – En digital följeslagare för fastan i Gottsunda Centrum',
			image: smallImg,
		},
		{
			date: '30 jan, 2025',
			title: 'Ramadan-timer – En digital följeslagare för fastan i Gottsunda Centrum',
			image: smallImg,
		},
		{
			date: '30 jan, 2025',
			title: 'Ramadan-timer – En digital följeslagare för fastan i Gottsunda Centrum',
			image: smallImg,
		},
		{
			date: '30 jan, 2025',
			title: 'Ramadan-timer – En digital följeslagare för fastan i Gottsunda Centrum',
			image: smallImg,
		},
	];

	return (
		<section className={styles.ramadanContent}>
			<nav className={styles.tabs}>
				<button className={`${styles.tab} ${styles.activeTab}`}>Alla</button>
				<button className={styles.tab}>Nyheter</button>
				<button className={styles.tab}>Ramadan</button>
				<button className={styles.tab}>Artiklar</button>
				<button className={styles.tab}>Övrigt</button>
			</nav>

			<div className={styles.mainLayout}>
				<div className={styles.bigCard}>

					<div className={styles.bigCardImageWrapper}>
						<Image
							src={bigCardImg}
							alt="Ramadan Lantern"
							width={450}
							height={450}
							className={styles.bigCardImage}
						/>
					</div>

					<div className={styles.bigCardText}>
						<p className={styles.bigCardDate}>30 jan, 2025</p>
						<h2 className={styles.bigCardTitle}>
							Ramadan-timer – En digital följeslagare för fastan i Gottsunda Centrum
						</h2>
						<button className={styles.bigCardButton}>Läs mer</button>
					</div>
				</div>

				<div className={styles.smallCardsGrid}>
					{smallCardsData.map((item, idx) => (
						<div className={styles.smallCard} key={idx}>
							<span className={styles.smallCardLabel}>{item.category}</span>

							<Image
								src={item.image}
								alt={item.title}
								width={280}
								height={180}
								className={styles.smallCardImage}
							/>
							<p className={styles.smallCardDate}>{item.date}</p>
							<h3 className={styles.smallCardTitle}>{item.title}</h3>

							{/* Arrow or "Visa fler" button in each card */}
							<div className={styles.arrowInsideCard}>
								<button className={styles.showMoreButton}>
									<Image
										src={arrowRight}
										alt="Arrow Right"
										width={18}
										height={18}
									/>
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			
		</section>
	);
}
