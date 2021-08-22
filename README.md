# NotesSense
2021 Hack the 6ix <br>
NotesSense is a notes accessibility mobile application that aids users who have hearing and vision impairments to create notes based on an image or audio in real time! <br>

Devpost: https://devpost.com/software/notesense <br>
Demo: <br>

<h3>Inspiration 💡</h3>
Back at university, we had a friend who couldn't see the professor's notes during lectures so he needed to take pictures, and often fell behind in class. But what if there was a way to take the pictures and convert them straight to notes? Introducing NoteSense, the fast and easy way to digitize captured photos and audio into ready to use typed up notes.


<h3>What it does 🤔</h3>
NoteSense is a notes accessibility app that allows users to create notes based on  images or audio snippets. Through harnessing technologies such as speech recognition and optical character recognition (OCR) users who have hearing deficits or vision impairment can quickly create notes in a format they can access quickly and conveniently! Our platform quickly converts their image or audio they took from their mobile device to a  PDF that is sent to their email! This way users can quickly stay on track during their lectures and not feel behind or at a disadvantage compared to their colleagues. Users also have the ability to view their generated PDFs on their device for quick viewing as well!

<h3>How we built it 🖥️</h3>
When building out NotesSense, we chose 3 key design principles to help ensure our product meets the design challenge of accessibility! Simplicity, Elegance and Scalability.

We wanted NotesSense to be simple to design, upgrade and debug. This led to us harnessing the lightweight framework of Flask and the magic of Python to design our backend infrastructure. To ensure our platform is scalable and efficient we harnessed the Google Cloud Platform to perform both our speech and image conversions harnessing its vision and speech api respectively. Using GCP as our backbone allowed our product to be efficient and responsive! We then used various python libraries to create our email and file conversion services, enabling us to harness the output from GCP to rapidly send pdfs of their notes to our users' emails!

To create an elegant and user-friendly experience we leveraged React Native and various design libraries to present our users with a new, accessible platform to create notes for individuals who may have hearing and/or seeing difficulties. React Native also worked seamlessly with our Flask backend and our third party APIs. This integration also allowed for a concurrent development stream for both our front end and back end teams.  

