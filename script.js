import { mounted, render, mut, sig, mem, eff_on, each, if_then } from "./chowk/monke.js"
import { hdom } from "./chowk/hdom/index.js"

function Root() {
	return hdom(["h1", "hello world"])
}

render(Root, document.body)
