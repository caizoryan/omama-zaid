import { mounted, render, mut, sig, mem, eff_on, each, if_then } from "./chowk/monke.js"
import { hdom } from "./chowk/hdom/index.js"
import { drag } from "./drag.js"

let data = await fetch("./data.json").then(res => res.json())


let selectedvideo = sig(undefined)
let selectedaudio = sig(undefined)
let audios = []

let windows = mut([])
let blendmodes = ["multiply", "difference", "exclusion", "blend", "lighten"]

function window(src) {
	let top = sig(Math.random() * 400)
	let left = sig(Math.random() * 400)

	let ref
	let setref = (e) => ref = e
	let videoref = (e) => videoref = e
	let setvideoref = (e) => videoref = e
	let play = () => videoref.play()
	let blend = sig(blendmodes[Math.floor(Math.random() * blendmodes.length)])
	let oninput = (e) => blend(e.target.value)

	mounted(() => {
		drag(ref, { set_left: left, set_top: top })
		play()
	})

	return hdom([".window", { style: mem(() => `position: fixed; top: ${top()}px; left: ${left()}px; mix-blend-mode: ${blend()};`), ref: setref },
		["button.tl", {
			onclick: () => {
				let index = windows.findIndex(e => e == src)
				windows.splice(index, 1)
			}
		}, "close"],
		["select.tll", { oninput },
			...blendmodes.map(e => ["option", { value: e }, e])
		],
		["video", { loop: true, muted: true, ref: setvideoref, src }]]
	)
}

function Root() {
	function playvideo(src) {
		//selectedvideo("./" + src)
		let index = Math.floor(Math.random() * data.audiofiles.length)
		selectedaudio("./" + data.audiofiles[index])

		let audio = new Audio()
		audio.src = selectedaudio()
		audios.push(audio)

		windows.push("./" + src)
		setTimeout(() => {
			audio.play()
		}, 100)
	}

	eff_on(selectedaudio, () => {
		let selects = document.querySelectorAll('p.audio')

		selects.forEach((e) => {
			if (e.getAttribute("selection") == "true") {
				e.scrollIntoView({ behavior: "smooth" })
			}
		})
	})


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

		["button.clear", {
			onclick: () => {
				windows.splice(0, 999)
				audios.forEach((e) => e.pause())
			}
		}, "x"],

		() => each(windows, window)
	])
}

render(Root, document.body)
