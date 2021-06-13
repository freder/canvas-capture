# canvas-capture

super basic https://github.com/spite/ccapture.js alternative.

- overrides `window.requestAnimationFrame()`
- sends canvas contents as data url to server
- server saves stills to disk

## ⚠️
- kind of WIP (will extend this as needed over time)
- PRs welcome


## example 1: basic

```js
const capture = new CanvasCapture(
	canvasElem,
	{
		fps: 30,
		serverUrl: 'http://localhost:3000',
	}
);
capture.start();
// ...
capture.stop();
```


## example 2: keep capture and video playback in sync

```js
const numFramesToCapture = 200;
const capture = new CanvasCapture(
	canvasElem,
	{
		fps: 30,
		serverUrl: 'http://localhost:3000',
		callback: () => {
			console.log(capture.frameCounter);

			// since seeking takes some time,
			// we need to wait for it
			const p1 = new Promise((resolve) => {
				video1.onseeked = resolve;
			});
			const p2 = new Promise((resolve) => {
				video2.onseeked = resolve;
			});
			// `currentTime` is in seconds
			const step = capture.timeStep / 1000;
			video1.currentTime += step;
			video2.currentTime += step;

			return Promise.all([p1, p2]).then(() => {
				if (capture.frameCounter === numFramesToCapture) {
					capture.stop();

					// resume regular playback
					video1.play();
					video2.play();
				}
			});
		}
	}
);

video1.pause();
video2.pause();
capture.start();
```


## server

```shell
node server.js
```
