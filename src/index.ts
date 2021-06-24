const raf = window.requestAnimationFrame;


type CaptureOptions = {
	format: 'png' | 'jpeg',
	quality: number,
	fps: number;
	serverUrl: string;
	name?: string;
	callback?: () => Promise<unknown>;
};


export class CanvasCapture {
	format: 'png' | 'jpeg';
	quality: number;
	canvas: HTMLCanvasElement;
	timeElapsed: number;
	timeStep: number;
	frameCounter: number;
	serverUrl: string;
	callback: () => Promise<unknown>;
	name: string | undefined;

	constructor(canvas: HTMLCanvasElement, options: CaptureOptions) {
		this.canvas = canvas;
		this.serverUrl = options.serverUrl;
		this.timeStep = 1000 / options.fps;
		this.timeElapsed = 0;
		this.frameCounter = 0;
		this.callback = options.callback || (() => Promise.resolve());
		this.name = options.name;
		this.format = options.format || 'jpeg';
		this.quality = options.quality || 0.9;
	}

	start(): void {
		this.frameCounter = 0;
		this.timeElapsed = -this.timeStep;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

	capture(): Promise<Response> {
		const payload = {
			format: this.format,
			frameNumber: this.frameCounter,
			dataUrl: this.canvas.toDataURL(
				`image/${this.format}`,
				this.quality
			),
			name: this.name,
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
