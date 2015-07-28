# three.turbo.js
Experimental Three.js extension which may speed up three.js to ~350% of it's current speed. This is early prototype. It works by replacing some calculations with SIMD instructions. Works in Firefox Nightly and very soon on Chrome

Use as bookmarklet and check how it works in your projects 
javascript:(function(){var script=document.createElement('script');script.src='//rawgit.com/DVLP/three.turbo.js/master/src/three.turbo.js';document.head.appendChild(script);})()