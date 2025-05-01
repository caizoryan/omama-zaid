import { mounted, render, mut, sig, mem, eff_on, each, if_then } from "./chowk/monke.js"
import { hdom } from "./chowk/hdom/index.js"

let range = (num) => Array(num).fill(0)
let data = await fetch("./data.json").then(res => res.json())

function Root() {
	return hdom([".container",
		[".videos",
			data.videofiles.map((e) => ["video", { src: "./" + e }])
		],

		[".audios",
			data.audiofiles.map((e) => ["p", e])
		]
	])
}

render(Root, document.body)
