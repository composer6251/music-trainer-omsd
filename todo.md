
### THE MUSIC READING PAGE ### 
1. Please add a display to the user in the Sheet music component which displays the note pressed along with the expected note (which is the currently highlighted note on the staff.)
2. Research the plausibility and difficulty of implementing a musicXml file upload option for user and provide planned implementation specifics. 
3. Research the plausibility and difficulty of implementing of converting a user-uploaded PDF of sheet music and converting it to a musicXml file.
4. Please remove the start button from the metronome. The Start button that begins the exercise should trigger the metronome.
5. On the Music Reading Page, add another user option which allowing them to select user uploaded exercise. The initial value should be sample.musicxml located in the public directory.

On the Music Reading Page, I would like to group the user selected options more categorically. I would suggest to group them, in rows, grouped by: 
Group 1: Staff, Scale, Voices, Range, Voices, Length
Group 2: Complexity, Metronome, Count-In
Group 3: Input, Sound, Mode, New Exercise(button), Start(button)

On the metronome component. There is a counting indicator. Instead of the existing counting indicator displayed to the user, I'd prefer to have a numbers, determined by number of beats, which illuminate the current beat. 

Additionally, I would like the user to be able to change the beat subdivisions of the displaying numbers via a dropdown of 1/4, 1/8, 1/8 triplet, and 1/16. For example, in 4/4 time, if the beat subdivision is set to 1/4 (for quarter note) then the numbers would appear as "1 2 3 4"
For 1/8: 1 & 2 & 3 & 4 &.
For 1/8 triplet: 1 & a 2 & a 3 & a 4 & a.
For 1/16: 1 e & a 2 e & a 3 e & a 4 e & a.
The numerals should have twice the vertical height of the subdivisions.

Additionally I would like to add a time signature dropdown for the user, as the first component of the row of rhythm user selections. Consisting of these time signatures: 2/4, 3/4, 4/4, 3/8, 6/8, 9/8, and 12/8.