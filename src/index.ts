const raf = window.requestAnimationFrame;


declare type CaptureOptions = {
	fps: number;
	serverUrl: string;
	callback?: () => Promise<unknown>;
};


export class CanvasCapture {
	canvas: HTMLCanvasElement;
	timeElapsed: number;
	timeStep: number;
	frameCounter: number;
	serverUrl: string;
	callback: () => Promise<unknown>;

	constructor(canvas: HTMLCanvasElement, options: CaptureOptions) {
		this.canvas = canvas;
		this.serverUrl = options.serverUrl;
		this.timeStep = 1000 / options.fps;
		this.timeElapsed = 0;
		this.frameCounter = 0;
		this.callback = options.callback || (() => Promise.resolve());
	}

	start(): void {
		this.frameCounter = 0;
		this.timeElapsed = -this.timeStep;
		// @ts-ignore
		window.requestAnimationFrame = async (fn): Promise<void> => {
			this.frameCounter++;
			this.timeElapsed += this.timeStep;
			await this.capture();
			await this.callback();
			fn(this.timeElapsed);
		};
	}

	stop(): void {
		window.requestAnimationFrame = raf;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	capture(): Promise<Response> {
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