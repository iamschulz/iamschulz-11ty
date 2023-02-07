const serverLocation = "https://schulz2.uber.space/simana";

export const sendMetric = (name: string, body: Object) => {
	const url = new URL(`${serverLocation}/${name}`);
	navigator.sendBeacon(url, JSON.stringify(body));
};
