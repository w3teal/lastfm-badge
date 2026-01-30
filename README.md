> # This repository has been moved!
> 
> See this repository on [SourceHut](https://sourcehut.org/): https://git.sr.ht/~w3teal/lastfm-badge

# lastfm-badge
Generate a dynamic badge for the last played song on Last.fm. _Insipired from [abskmj/badges-lastfm](https://github.com/abskmj/badges-lastfm)_

## Features
- [x] `user.getRecentTracks` (last-played)
  - `sort`s: none
- [x] `user.getTopAlbums` (top-album)
  - `sort`s: `all-time`, `7`, `30`, `90`, `180`, `365`
- [x] `user.getTopArtists` (top-artist)
  - `sort`s: `all-time`, `7`, `30`, `90`, `180`, `365`
- [x] `user.getTopTags` (top-tag)
  - `sort`s: `all-time`, `7`, `30`, `90`, `180`, `365`
- [x] `user.getTopTracks` (top-track)
  - `sort`s: `all-time`, `7`, `30`, `90`, `180`, `365`


### Example


```
![](https://lastfm-badge.vercel.app/top-artist?user=ligmatv&sort=365&color=blue)
            Domain                  Type       User         Sort     Color
                                                           [Advanced]
```
![](https://lastfm-badge.vercel.app/top-artist?user=ligmatv&sort=365&color=blue)


## GUI

Proudly using [BeerCSS](https://github.com/beercss/beercss). _[Demo](https://lastfm-badge.vercel.app/)_

<img width="1311" height="728" alt="image" src="https://github.com/user-attachments/assets/60725903-5ed4-4b08-b6c4-93f6442935f0" />


## Building

These are the steps to run it locally or deploy it to Vercel.

1. Get Last.fm API key
   - **You must already signed up and login to LastFM account.**
   - Go to [Create API account page](https://www.last.fm/api/account/create).
   - After fill up some informations (like **Contact email** and **Application name**), click <kbd>Submit</kbd>.
   - Copy the value next to "**API key**". _(The character must be 32.)_

### Local

2. Clone this repository
```
git clone https://github.com/LIGMATV/lastfm-badge.git
cd lastfm-badge
npm install
```

3. Create a new file "`.env`" with this content (Replace `XXX...` with your actual API key)
```
API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

3. Start in your terminal
```
npm start
```

### Deploy

2. [<img src="https://vercel.com/button" alt="Deploy with Vercel" width="256"/>](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLIGMATV%2Flastfm-badge&env=API_KEY&envDescription=LastFM%20API%20key.&envLink=https%3A%2F%2Fgithub.com%2FLIGMATV%2Flastfm-badge%2Ftree%2Fmain%3Ftab%3Dreadme-ov-file%23building&project-name=lastfm-badge&repository-name=lastfm-badge)

## Limitation

LastFM does not provide any limits for API per user, including Vercel which does not provide any limits for requests and visitors.
You can also check out [LastFM API TOS](https://www.last.fm/api/tos) and [Vercel Limits Overview](https://vercel.com/docs/limits/overview) to learn more.  
I would recommend you to use your own deployed version to get a stable experience.
