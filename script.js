import { mounted, render, mut, sig, mem, eff_on, each, if_then } from "./chowk/monke.js"
import { hdom } from "./chowk/hdom/index.js"
import { drag } from "./drag.js"

let data = await fetch("./data.json").then(res => res.json())


let selectedvideo = sig(undefined)
let selectedaudio = sig(undefined)
let audios = []

function Root() {
	function playvideo(src) {
		selectedvideo("./" + src)
		let index = Math.floor(Math.random() * data.audiofiles.length)
		selectedaudio("./" + data.audiofiles[index])

		let audio = new Audio()
		audio.src = selectedaudio()
		audios.push(audio)

		setTimeout(() => {
			play()
			audio.play()
		}, 100)
	}

	let ref = (e) => ref = e
	let videoref = (e) => videoref = e

	let play = () => videoref.play()

	let top = sig(0)
	let left = sig(0)

	eff_on(selectedvideo, () => {
		if (selectedvideo()) {
			top(window.innerHeight * .05)
			left(window.innerWidth * .05)
		}
		else { top(-5000) }
	})

	eff_on(selectedaudio, () => {
		let selects = document.querySelectorAll('p.audio')

		selects.forEach((e) => {
			if (e.getAttribute("selection") == "true") {
				e.scrollIntoView({ behavior: "smooth" })
			}
		})

	})

	mounted(() => { drag(ref, { set_left: left, set_top: top }) })

	return hdom([".container",
		[".videos",
			data.videofiles.reverse()
				.map((src) => ["p.video",
					{
						onclick: () => playvideo(src),
						selection: mem(() => selectedvideo() == "./" + src ? "true" : "false"),
					},
					src.replace("clips/", "").replace("clips2/", "")])
		],

		[".audios",
			data.audiofiles.map((src) => ["p.audio", {
				selection: mem(() => selectedaudio() == "./" + src ? "true" : "false"),
			}, src.replace("audio/", "")])
		],

		[".window", { style: mem(() => `position: fixed; top: ${top()}px; left: ${left()}px;`), ref },
			["button.tl", { onclick: () => selectedvideo(null) }, "close"],
			["video", { loop: true, muted: true, ref: videoref, src: selectedvideo }]]
	])
}

render(Root, document.body)
