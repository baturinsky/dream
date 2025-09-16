* What is it *

It's my entry for the 2025 js13k jam.

https://js13kgames.com/2025/games

Can be played here https://js13kgames.com/2025/games/all-you-have-to-do-is-dream

* Why *

There are two approaches of choosing what to make as a jam entry. Either take from the theme and figure what fun and interesting game can be made of it. 

Or pick up some idea that was atthe back of your head for ears, and do it, even though it 
dows not fit the theme, and maybe the jam format at all.

Just as in the last year, I did the latter, and had a very rewarding experience,
and tested some theories, though, I do not have much hopes for high grades/place.

So, what have I found.

Is it possible to squeeze a Fallout Shelter-like in 13k? Yes.

Is it possible to make it in css-3d? Yes, and it has pro and cons compared to webgl.
Pros is that ou have a lot of DOM functionality "out of the box", such as css styling,
mouse events, etc. Con is that it's not very performant when you get hundreds of the objects in play.

Is it possible to make art completely out of one-bit images? Yes.

What is the best way of storing them? Surprisingly, webp. My whole sprite atlas with 98 
items in it was only 712 bytes big, a little less than 8 bytes per sprite. Yes, those sprites were small, yet pretty readable. On the bigger atlases, png can be a bit more effective. gif is good at even smoller ones.

Another thing is how those sprites were processed.

I had a white and black atlas. And had to make sprites from it, recolored into various pair of colors.
And they wre made in  three variants - with two colors (red and green), with one color and opacity, and the most used one - one color with the outline of the other color. 
I.e. white pixel from original were converted to the color A, pixels ajactent to them were color B, and the rest was transparent.

And it was all done without the direct work with pixels or glsl - only with SVG filters.

```
      <filter id=_O>
        <feColorMatrix type=matrix values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result=f />
        <feMorphology operator=dilate radius=".9" />
        <feColorMatrix type=matrix values="0 0 0 0 0  1 0 0 0 0  0 0 0 0 0  1 0 0 0 0" />
        <feBlend in2=f mode=overlay />
      </filter>
```

This is the most complex filter - it converts white-and-black image to green with red outlines.

And this is code which makes filters which convert such images to combinations of other two colors

```
export function constructFilter(cab: string) {
  if (!filters.has(cab)) {
    filters.add(cab);
    let [a, b] = [...cab].map(c => palette[Number.parseInt(c, 36)]);
    let f = `<filter id=f${cab}><feColorMatrix type=matrix values="${a[0]} ${b[0]} 0 0 0  ${a[1]} ${b[1]} 0 0 0  ${a[2]} ${b[2]} 0 0 0  0 0 0 1 0" /></filter>`
    DEFS.innerHTML += f;
  }
  return `url(#f${cab})`
}
```

Color combinations are coded as two letters, which are base-36 numbers of the colors in palette.

I used Pineapple32 palette from here https://lospec.com/palette-list/pineapple-32 with a couple of "metal" colors added.

Palette itself was also compressed - each color was represented with three base-36 number, instead of, say, six hexadecimals.