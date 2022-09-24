import './style.css'
import Typewriter from './Typewriter'

const myTypewriter = new Typewriter(document.querySelector('.whitespace') as HTMLDivElement, {loop: false, typingSpeed: 80, deletingSpeed: 80})

myTypewriter
  .typeString('How are we doing')
  .typeString(`\n`)
  .pauseFor(7)
  .typeString('Are we ready for the next challenge')
  .typeString(`\n`)
  .typeString("Let's go get it boys!")
  .deleteAll()
  .start()