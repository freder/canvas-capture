const raf = window.requestAnimationFrame;


declare type CaptureOptions = {
	fps: number;
	serverUrl: string;
};


export class CanvasCapture {
	canvas: HTMLCanvasElement;
	timeElapsed: number;
	timeStep: number;
	frameCounter: number;
	serverUrl: string;

	constructor(canvas: HTMLCanvasElement, options: CaptureOptions) {
		this.canvas = canvas;
		this.serverUrl = options.serverUrl;
		this.timeStep = 1000 / options.fps;
		this.timeElapsed = 0;
		this.frameCounter = 0;
	}

	start(): void {
		this.frameCounter = 0;
		this.timeElapsed = -this.timeStep;
		// @ts-ignore
		window.requestAnimationFrame = async (fn): Promise<any> => {
			console.log(this.frameCounter);
			this.frameCounter++;
			this.timeElapsed += this.timeStep;
			await this.capture();
			fn(this.timeElapsed);
		};
	}

	stop(): void {
		window.requestAnimationFrame = raf;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	capture(): Promise<any> {
		const payload = {
			frameNumber: this.frameCounter,
			dataUrl: this.canvas.toDataURL(),
		};
		return fetch(
			this.serverUrl,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			}
		);
	}
}
