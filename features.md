

Let me give a little context before adding anything else. I think will aid in the UI design layout.

There will be a header for navigation. This will consist of: 
1. Music Reading (which is the current page), 2. Learn Theory - Beginner, 3. Learn Theory - Advanced, 4. Composition.

Below the header will be the options for changing:
1. Scale (random not generation will be based on this value)
2. Staff (options for Grand Staff, Bass Staff, Alto Staff, and Treble 8va staff(for guitar)).
3. Number of voices (random note generation will use this value to at some point)
4. An adjustable metronome, with both audio and visual cues.

Then the staff will be underneath and spaced so that it is easy to read. 

The ability to change: 
1. To change the current scale.
    a. Which changes the key signature.
2. The current staff with options for Grand Staff, Bass Staff, Alto Staff, and Treble 8va staff(for guitar).

The ability to generate music multiple voices with Soprano/Alto/Tenor/Bass formatted note stemming.

I would like to add staff options for Grand Staff, Bass Staff, Alto Staff, and Treble 8va staff(for guitar).

Add the ability to change keys
1. Key signature should update. 

I would like to add a metronome in the UI. It should consist of the following for adjusting the tempo and contain visual and audio cues, which can be toggled on/off.
1.  Adjusting the metronome BPM via 3 separate means which are logically grouped together: a slider, a tap/click(for a user "tapping" a tempo), and an input field for manually entering the tempo BPM.
2. An audible clicking sound that keeps the tempo time. Can be toggled on or off.
3. An a small, but noticeable, flashing area which also keeps time. Can be toggled on or off.

Add toggle for switching between 3 different learning modes:
1. Note learning: when the cursor doesn't progress until the current note is played correctly
2. Sight reading: 

4. Functionality to move the current note highlighter according to the tempo.





Finale-Sibelius style:
This is a large overview of what I would like to know if it is possible, without being overly complex.
Ability to input notes with a mouse and/or keyboard and adjust the note on the staff accordingly.

Could functionality be added to utilize virtual instruments as the playback sounds?
It could be synced up with VST manager apps such as Kontakt, Spitfire Audio App, along with others.
Assuming the user has the VSTs and appropriate licenses.

# MVP
### Sight reading
#### Midi
    - Display current note and note pressed
    - Move with - Correct note played
    - Move with - Metronome (Sight Reading mode)
    - On Sight Reading mode - Keep track of score based off of percentage of correct notes.
    - Initial metronome setting = 60 bpm

#### Audio

### Learn Theory
#### Learn keyboard notes - Games
#### Learn keyboard notes - Visual Keyboard
    1. Start with one octave keyboard (middle C to B.), highlighting middle C.
        - Display instruction: "Press the highlighted keyboard key"
            - If correct: 
                - Add the note name(C) overlayed on Middle C.
                - Unhighlight Middle C, but leave the note name.
                - Display the message: "Great! This is the Note C. Now play the new highlighted note next to it".
                - Highlight D next to middle C.
                - if the next note played is correct:
                    - Add the note name(D) overlayed on that D.
                - Unhighlight that D, but leave the note name.
                - Display the message: "Great! This is the Note D. Now, see if you can play the note E."
                - if the note played is correct, continue the pattern of Displaying the message with the newly identified note, and prompting the user to try to play the next note name. Continue this pattern through the B note that is the last note before the next octave.
                - Once that B note is reached then
                    - Display the message: "Great! These are the 7 notes of the C Major scale. The next note to play will be the 8th which begins a new Octave."
                    - Then the 1 octave keyboard should become a 2 octave keyboard and display the message: "Now that we have added the next octave, notice that it looks identical to the first octave."
                    - Then add the Note names overlayed on the new octave and display the message: "And the note names are repeated."

#### Learn treble clef
### Learn chords

To provide context for upcoming changes: I would like to have multiple modules for the Learn Theory page. With one module having sub modules. This may require some refactoring, but here is a broad overview of what I anticipate having:

1. Learn the notes of the keyboard.
2. Learn the staff
    - Treble clef
    - Treble clef 8va(Guitar)
    - Bass clef
    - Grand Staff(Treble + Bass)
3. Learn Chords








## MUSIC THEORY TRAINING MODULES

### Beginner
    
1. Introduce Keyboard single octave
or 
    Introduce staff one note/line at a time using keyboard

Games
    - 

Introduction to the staff - Kids(From scratch)
    - 

Learn a staff
    - Treble
    - Treble 8va(Guitar)
    - Bass
    - Alto


