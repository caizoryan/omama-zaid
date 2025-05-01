import { mounted, render, mut, sig, mem, eff_on, each, if_then } from "./chowk/monke.js"
import { hdom } from "./chowk/hdom/index.js"
import { drag } from "./drag.js"

let data = await fetch("./data.json").then(res => res.json())


let selectedvideo = sig(undefined)

function Root() {
	function playvideo(src) {
		selectedvideo("./" + src)
		setTimeout(() => {
			play()
		}, 100)
	}

	let ref = (e) => ref = e
	let videoref = (e) => videoref = e

	let play = () => videoref.play()

	let top = sig(0)
	let left = sig(0)

	eff_on(selectedvideo, () => {
		if (selectedvideo()) {
			top(5)
		}
		else { top(-5000) }
	})

	mounted(() => { drag(ref, { set_left: left, set_top: top }) })

	return hdom([".container",
		[".videos",
			data.videofiles.reverse()
				.map((src) => ["p.video",
					{ onclick: () => playvideo(src) },
					src.replace("clips/", "").replace("clips2/", "")])
		],

		[".audios",
			data.audiofiles.map((e) => ["p.audio", e.replace("audio/", "")])
		],

		[".window", { style: mem(() => `position: fixed; top: ${top()}px; left: ${left()}px;`), ref },
			["button.tl", { onclick: () => selectedvideo(null) }, "close"],
			["video", { ref: videoref, src: selectedvideo }]]
	])
}

render(Root, document.body)
