import {AnySampleArray} from '@/types/audio';

export default function findAvgSample(data: AnySampleArray) {
	let total = 0;
	
	for (let i = 0; i < data.length; i++) {
		total += Math.abs(data[i]);
	}
	
	return total / data.length;
}