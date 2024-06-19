> [!NOTE]
> This fork was made to use SL API instead of Google Maps API to get departure times from my home area to Stockholm City.
> If you want to change locations you need to find `siteId` of your locations [here](https://transport.integration.sl.se/v1/sites?expand=true) and get departure `direction` and `line` from [here (replace with your siteId](https://transport.integration.sl.se/v1/sites/{siteId}/departures) 


Scriptable Transit Widget for iOS
=========


<img src="https://user-images.githubusercontent.com/14946478/192045408-d0224bbc-f87b-4dc3-8690-82102f3a768a.png" width="600" />

I wrote this script because I take the [Bart](https://en.wikipedia.org/wiki/Bay_Area_Rapid_Transit) to work every day

I needed to know when the next few trains would arrive at my stops.

With a glance I can see if I should hustle, or, wait for the next one.



## Project Requirements

This widget runs on iOS via the Scriptable ([App Store](https://apps.apple.com/us/app/scriptable/id1405459188)) app.

You'll also need a Google Maps API key.

~~

## ~~Why do I need a Google Maps API key?~~

You don't!


## Widget comes with Dark and Light Mode

I think the dark mode version looks better in all cases, but I created a light mode variant as well.

It will swap automatically to light mode depending on your iOS configuration. 

<img src="https://user-images.githubusercontent.com/14946478/192008691-20212da0-631c-493e-bbde-8b086f280a19.png" width="600" />


## Special thanks

Special thanks to a few people:

Romo, who asked me to share the setup for my transit widget multiple times. Here you go 😄

[Lillian](https://lilliansamra.com), who dutifully trudged through all the videos and blogs, twice 🙏

[Josh W. Comeau](https://twitter.com/JoshWComeau), who inspires me as a web engineer 🎆

[Simon B. Støvring](https://twitter.com/simonbs), the creator of Scriptable 💡


## License
[MIT](https://github.com/trevorwhealy/scriptable-transit/blob/main/LICENSE.md)
