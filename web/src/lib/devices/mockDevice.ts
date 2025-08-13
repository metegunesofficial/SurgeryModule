export type CycleReading = {
	timestamp: number;
	temperatureC: number;
	pressureBar: number;
};

export function* generateSteamCycleReadings(totalMinutes = 45) {
	const start = Date.now();
	for (let i = 0; i < totalMinutes; i++) {
		let temperatureC = 20;
		let pressureBar = 0;
		if (i < 10) {
			temperatureC = 20 + i * 11.4;
			pressureBar = 0 + i * 0.21;
		} else if (i < 35) {
			temperatureC = 134;
			pressureBar = 2.1;
		} else {
			temperatureC = 134 - (i - 35) * 5;
			pressureBar = 2.1 - (i - 35) * 0.1;
		}
		yield {
			timestamp: start + i * 60_000,
			temperatureC,
			pressureBar,
		};
	}
}


