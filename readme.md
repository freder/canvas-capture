# canvas-capture

super basic https://github.com/spite/ccapture.js alternative.

- overrides `window.requestAnimationFrame()`
- sends canvas contents as data url to server
- server saves stills to disk

## ⚠️
- very wip (I will extend this as needed over time)
- PRs welcome

## example

```js
const capture = new Capture(canvasElem, {
	fps: 30,
	serverUrl: 'http://localhost:3000',
});
capture.start();
// ...
capture.stop();
```
