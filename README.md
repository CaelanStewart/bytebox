# Bytebox
I make music, and I also write code. So, a project like this, which sits at the intersection of the two, is something I'd like to try.

The plan is to write an audio analyser that identifies beatbox sounds and triggers the appropriate MIDI notes. It will not be a VST plugin, for I have not enough experience with C++ to pull that off. As a compromise, to be useful to me, it will just save a MIDI file which I can then drag into a DAW.

Broadly, it will recognise the sounds in a recording, making an educated guess as to the grouping, and then presenting the MIDI sequence, allow the user to alter the MIDI note mappings, the tolerance of sound and the velocities (also potentially offering velocity compression).

I have an idea of how I'm going to approach this at a technical level, which I will explain at some point.

This is in the initial stages and is not yet usable.
