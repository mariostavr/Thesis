/*======================================================================*/
/*										CIRCULAR PROGRESS									*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useMemo } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { PulseLoader } from 'react-spinners';

//> Style
import 'react-circular-progressbar/dist/styles.css';
import '../styles/circularProgress.css';

export default function CircularProgressBar(props) {
	const fontSize = useMemo(() => {
		const progressBarSize = props.size || 200;
		return progressBarSize * 0.08; 
	}, [props.size]);

	return (
		<div className="cardProgress">
			<CircularProgressbar
				value={props.value / props.divider}
				styles={buildStyles({
					strokeLinecap: 'butt',
					pathColor: 'rgb(127,0,255)',
					textColor: 'rgb(127,0,255)',
					trailColor: 'lightgrey',
				})}
				size={props.size}
			/>
			{props.isLoading && (
				<div className="loader">
					<PulseLoader size="5px" color="rgb(127,0,255)" />
				</div>
			)}
			{props.value ? (
				<div
					className="progressValue"
					style={{ fontSize: `${fontSize}px`, whiteSpace: 'nowrap' }}
				>
					{props.symbol + `${props.value}`}
				</div>
			) : null}
		</div>
	);
}