import React from 'react';

import classes from './SnowBlock.module.scss';

const SnowBlock = () => {
	return (
		<div className={classes.wrapper}>
			<div className={`${classes.snow} ${classes.layer1} ${classes.a}`}></div>
			<div className={`${classes.snow} ${classes.layer1}`}></div>
			<div className={`${classes.snow} ${classes.layer2} ${classes.a}`}></div>
			<div className={`${classes.snow} ${classes.layer2}`}></div>
			<div className={`${classes.snow} ${classes.layer3} ${classes.a}`}></div>
			<div className={`${classes.snow} ${classes.layer3}`}></div>
		</div>
	);
};

export default SnowBlock;
