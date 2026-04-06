
### THE MUSIC READING PAGE ### 
1. Research the plausibility and difficulty of implementing a musicXml file upload option for user and provide planned implementation specifics. 
2. Research the plausibility and difficulty of implementing of converting a user-uploaded PDF of sheet music and converting it to a musicXml file.


On the metronome component. There is a counting indicator. Instead of the existing counting indicator displayed to the user, I'd prefer to have a numbers, determined by number of beats, which illuminate the current beat. 

Additionally, I would like the user to be able to change the beat subdivisions of the displaying numbers via a dropdown of 1/4, 1/8, 1/8 triplet, and 1/16. For example, in 4/4 time, if the beat subdivision is set to 1/4 (for quarter note) then the numbers would appear as "1 2 3 4"
For 1/8: 1 & 2 & 3 & 4 &.
For 1/8 triplet: 1 & a 2 & a 3 & a 4 & a.
For 1/16: 1 e & a 2 e & a 3 e & a 4 e & a.
The numerals should have twice the vertical height of the subdivisions.

Also, I would like a dropdown which updates the metronome to count according to selected values which will be identical to the values in the beat subdivisions dropdown.

And a checkbox with the label 'Match subdivision' inside the metronome component which, if selected, will update the metronome to match the counting according to the subdivision dropdown.

Additionally I would like to add a time signature dropdown for the user, as the first component of the row of rhythm user selections. Consisting of these time signatures: 2/4, 3/4, 4/4, 3/8, 6/8, 9/8, and 12/8. The staff time signature should update accordingly.


On the Music Reading page, this is the functionality expected per mode:
1. Wait on Note - Correct midi input for highlighted note moves the highlight to the following note. Metronome does not play.
2. Sightreading with metronome - Metronome highlights next note simultaneously with metronome click, in accordance to note value and metronome subdivision setting. Additionally the number of correct and incorrect played notes should be displayed to the user at the top of the sheet music component.
3. Sightreading without metronome - Same as Sightreading with metronome