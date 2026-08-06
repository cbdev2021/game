const ART = {
  "hero": {
    "warrior": {
      "atlas": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAEgCAYAAADVDXFAAAAEHUlEQVR42u2dv2oVURDG8y6KD2GlEFJoI4qlXfzTBW0sBCEIQQKCnUGxstBeMJUvYCM+go2vYLkyCxPO3X/nzO58M0i+Yrg3btzzy8nePff+5ju613Xd3pq6euVaV9ba87gMvgVi0+A/z7/kAZwdv+hLIKTk+RoIM8DX96c7P708/njzMm4GSgAtAZDHsItQIMqp14IDPHv6vJP6+/DJzgxofbx+pz8OAZATvz5525c8/3P3Xl+/bt3uvu8fXAyux10ByhNrPTo82hn85o39vsrjrgDDwWUwGVye69da+mduAOVJdTB51F/JEEBeJfLoClCeWAcfQsEAytttOegUgH6fG0B50nIGagBur4Kpn2wJwP1XMAT4/O64r5OjB6PBH98/6MsyC+YLUEoGH5YO7g4gV/sQYKqG14n8vc0AcqPR17qUfN0CoN/vMgMlhDzXu9/c2zK9R7gvRjr4+affFzV3T4AvxyWEglgXoU0AOtAUCBxgaqqHIHCAqbvc1K/GHaC88y0ds4CYAPQ133qsBcIE8O3Dq/62az3mNgO6CFmPuQGUC4/lmBtAueINB1o65vqWbIsLWAXg6QLMAN4uYDWAlwswA3i7gE0AHi5g1UXo6QJMAAgX0AyAcgFNAEgX0AyAcgFNAEgX0AyAcgFNAEgXUAVAu4AmAKQLMAN4uwATAMIFVAHQLmARIMIFVGcA7QKaFyOUC1i1HHu6gFUAni7ADODtAlYBeLoAEwDCBZgAEC7ABIBwASYAhAswASBcgAkA4QLYPWf3nN1zds/ZPWf3nN1zds/ZPWf3nN1zds/ZPWf3nN1zt09GlzNdj+qkp3kBMwCqk57mBVZdhIhOepoXaAZAd9LTvEAzALqTnuYFmgHQnfQ0L9DUsIjopKd5ATMAqpOe5gWqAFGd9DQvUJ2BqE56mhdYtRwjOulpXsAMgOqkp3kBEwCyk57mBUwAyE56mhcwASA76WlewKV77pGwTvMCTNczXc90PdP1TNczXc90PdP1TNczXc90PdP1TNczXc90PXffN70pRTmBJgCkE1gEiHACzQAoJ1C9CNFOYBYgyglMAkQ6gRFAtBOYBIh0AiOAaCcwCRDpBEYA0U5gByDDCYwAop3AIkCEE5gFiHICOwAZTmAEEO0Eyk/hKU5g1pBEOYHqcox2AlUAtBNYBIhwAlUAtBOYBYhyAlVTinYCswBRTmAWIMoJzAJEOYFZgCgn0PTxHOkEqgBoJ8Dt/9z+z+3/3P7P7f/c/s/t/9z+z+3/3P7P7f/c/s/t/9z+z+3//+f2/5R/HpDxfsb7Ge9nvJ/xfsb7Ge9nvJ/xfsb7Ge9nvJ/xfsb7Ge/vLuV/rsd4P+P9jPcz3s94P+P9jPcz3s94P+P9jPcz3s94P+P9jPenx/ujt///A8gcNv7d8u2yAAAAAElFTkSuQmCC",
      "fw": 32,
      "fh": 32,
      "foot": 32,
      "facesLeft": true,
      "anims": {
        "idle": [
          0,
          1
        ],
        "run": [
          2,
          3,
          4,
          5
        ],
        "jump": [
          0,
          0,
          0
        ],
        "attack": [
          6,
          7,
          8
        ],
        "land": [
          0
        ],
        "crouch": [
          0
        ],
        "crouchWalk": [
          3,
          4
        ]
      }
    },
    "wizard": {
      "atlas": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAEgCAYAAADVDXFAAAAD4UlEQVR42u2cPY7UQBCFfRcQOSEZCBICMiBDIiIiRCKDExAgJFISckRMTLIxR9iYKxiVRY96vHa7q7pe1SDeSq3Zn9H2N7Vue/zV653meZ5M4/Xj+WwYf4/L5L+f3V1GDMDGxKEA179+3JhcvifDAmECKBNP03SaXD4PAVi/ahlXH94tj2EHYQ3w5cWTZYQCyLj6/vmsCmEAT9++nGW8//ltFogy5Gv5PhSgTCKPMl59/bhMfv3pzenre88fzhCAetJSBflcluSD+49Ok4cClCEA8iiTL1DeAK3JtwA0EG4ApfzyHHkuDEAm6QHohRiugEy6BdD7Z1BNvgdw+9adTYAeiEOA8ovKkFdbv+IaQB7Xzx8CkCtcfcWrK1BAZNIyyjlAntd7ej7+G1UA9dmwlL8e9SvuvTb0nzD+VqMcE/WqsKx/88WogMjHGiQEoK7AuhqpACEV2Js8rAJ7k5dLcxqA5sQDAQhbhhdZgfocoH07NvSueO90DAWoLzyan40DOLkAG4CjC9ADOLsANYC3CzABeLoANYC3CzAdhJ4uwLwMvVyAGsDbBagAEC6gGwDlAoYAPFxAFwDSBbgBWF2AGsDbBQxXYNQFHAKgXcAhANoFNAEiXMBhBdAuoPtEhHIBZkXj5QLUAN53wm4AIRVAuAAXgBEX4AIweuIZBghbhhdZgVEXYH5X7OUCVAAIF8DuObvn7J6ze87uObvn7J6ze87uObvn7J6ze87uObvn7J673pj8h+l6UCc9zQuYABCd9DQvYDoIEZ30NC+gBkB10tO8gOnOCNFJT/MCqpYNspOe5gXUAKhOepoX6G5YoDvpaV6gq3cc0UlP8wIqQYHspKd5AbOq9e4jp3kBk6hMqwCyk552V+wCELYML7ICXp30NC+gAkB20tO8gA0AkLRnup7peqbrma5nup7peqbrma5nup7peqbrma5nup7peqbrufs+xQk0ASKcwCEA2gk0ASKcwOFBiHYCXasA6QSaABFOoHljEuEENgEinUA3AMoJ3ACIdgImAE8n0ASIcAKqCiCcwBlAhhM4A8hwAqt7z3gnsIKIdwJNQxLhBJoXowgn0KXpkHfEJoCQCkQ5ATWAtxNQA3jfEasBwpbhRVYA4QS63hUjncAuQJQT6Ls9BzqBYwCwE+D2f27/5/Z/bv/n9n9u/+f2f27/5/Z/bv/n9n9u/+f2f27/5/b/f3T7f8a/B2S8n/F+xvsZ72e8n/F+xvsZ72e8n/F+xvsZ72e8n/F+xvtz4v3Z2/8Z72e8n/F+xvsZ72e8n/F+xvsZ72e8n/F+xvsZ72e8n/H+/Hh/8Pb/P09iOYIuPmzaAAAAAElFTkSuQmCC",
      "fw": 32,
      "fh": 32,
      "foot": 32,
      "facesLeft": true,
      "anims": {
        "idle": [
          0,
          1
        ],
        "run": [
          2,
          3,
          4,
          5
        ],
        "jump": [
          0,
          0,
          0
        ],
        "attack": [
          6,
          7,
          8
        ],
        "land": [
          0
        ],
        "crouch": [
          0
        ],
        "crouchWalk": [
          3,
          4
        ]
      }
    },
    "priestess": {
      "atlas": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAEgCAYAAADVDXFAAAAD7ElEQVR42u2dPY4TQRCF+y78HIGYlcjQigCJG5CQLQk34AYrIW1I7pyEUxA64QicoFGvtlDPuP9dr2rNPkstG9lMf54Z90x/9RpCjDGMthBC/PrpbZRnae9fvbh/ntnWv21O/4UQNgD5n00ABEK+dd7gALe336I80uvUfv/6Hn/efYyfb77E4/EYYQDSYQlCOk8tvVYHSN+yBCCPvHMYQA6RP54/e7kBSIcjNXWAtNHSXkgAAgEBkG8vGx4BSJ9XBdh3XjsMOcDoXlAB2J8DEIDaTxEGEO7f2gJcvX4TS03Og9TS52ZOxO6YX9oDtc5lDJCR8exDkADyje0Pgez6/Sg4MyB1P5BvrDcazo6CwwORHI531x+6JyHsYpRDPJxsJwByEsIuxwLhBpC+vZyY8c8PGXJtAVKTzh9+nrYAqZN8eHYBSK/3Y4AJwOFwqP7UWu+p3pTWOmm9938ASAc9AMhNaW1Akku2PJtOzUrNHCCflpkA1Do/B2KaOJ+ey3OaqKrvAYQLWLol03QBS4dA0wVMASBcwDAAygUMASBdwDAAygUMA6BcQBcA7QKGAJAuQAXgnKn4MADKBVQBrFxAE8DCBTQPgYUL6J4DaBcwNBAhXcDwxQjlApYklRsAwgVMA2i7gGkAbRewBKDpAqYAEC5g+qZUeyp+OQAoF7A8MdFyActTMy0XcBaAhgtYuhZouoDpPaDtAlg9Z/Wc1XNWz1k9Z/Wc1XNWz1k9Z/Wc1XNWz1k9Z/Wc1XOVPfC00/WISrqbFxgGQFfS3bzAMAC6ku7mBboAVpV0Ny+gAqBRyHbzAs3KqWUl3c0LdEu3VpV0Ny8wVbBAVtLdvMCSIXEDQFbS3bzANACqku7mBaYAkJV0t2n55QCgK+luXmBZ1WpX0t28wNK1AFFJd/MC03sAlbR38wJM1zNdz3Q90/VM1zNdz3Q90/VM1zNdz3Q90/VM1zNdz3Q9V993b0iQTqAKYOUEigCWTuAEwNoJFAEsnUARwNIJbAA8nMAJgLUTmAbQnpIXASydQBXAygnkNzbBwwlsLvceTmAD4eEEqorGyglUFY2VE6hejq2cQBXAygk0ASycQBPAwgl0AdBOoApg5QSaN6UWU/LHCWDpBIZNKcoJDLlipBMYBkA5ge61AO0EmnvAwgk094CFExg6B5BOgMv/ufyfy/+5/J/L/7n8n8v/ufyfy/+5/J/L/7n8n8v/ufyfy/8vd/m/6T8PyHg/4/2M9zPez3g/4/2M9zPez3g/4/2M9zPez3g/4/2M98cn+Z/rMd7PeD/j/Yz3M97PeD/j/Yz3M97PeD/j/Yz3M97PeD/j/Y8m3m+5/P8v1+hWDYbE2hAAAAAASUVORK5CYII=",
      "fw": 32,
      "fh": 32,
      "foot": 32,
      "facesLeft": true,
      "anims": {
        "idle": [
          0,
          1
        ],
        "run": [
          2,
          3,
          4,
          5
        ],
        "jump": [
          0,
          0,
          0
        ],
        "attack": [
          6,
          7,
          8
        ],
        "land": [
          0
        ],
        "crouch": [
          0
        ],
        "crouchWalk": [
          3,
          4
        ]
      }
    },
    "ninja": {
      "atlas": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAGACAYAAADMEWCuAAACiElEQVR42u3cvU0DQRBA4avAGYHbcAkkJBRDNdRAAcRUAER0QQNkh+6EpZN/5J31jC2jLxjZOoH23Z4t7XuBh4enx+GaMwAAAAAAgO5/HIZxdy4GMC222Wz2pgeka/GPExOB6Fp8aJjSHZi2e/x6mReaXpfvSx/BsWe/+zkoAVhu/1UAthDHvoK9X8XwZ2C9WqXdfRhgufihRzFdm/6mFGAcv+c5BPD+9no5gPV6vTflAFuIecHpdTl/18o/A+Pn3TzLxab3P8/385Q/guWcuu5AAgAAAAAAALBjdsyO2TE7ZsfsmB07kAAAAAAAAAAAAPxfgKw6cpaeZ9SR7kCRVUe69TyrjnQHiqw6Et6B7DrSDFBVR8I7kF1HzgoUGXcfAqioI2GA7DrSDZBVR/r6QGIdie9Ach0JA2TXEQcSAAAAAAAAgB2zY3bMjtkxO2bH7NiBBAAAAAAAAGDH7Jgds2N2zI7ZMTt2IAEAAAAAAADYMTtmx+yYHbNjdsyOHUgAAAAAAAAAAAAAALhNgMxC9pD163wX6QMVhawr0WQWsq5IlVnIQjtQUciaACoLWWgHKgpZd6TKuvtmgKpCFgKoKGRdAJmFLN6IkgtZbAcKClkIoKKQOZAAAAAAAAAAAOg5Pafn9Jye03N6Ts8BAAAAAAAAAPScntNzek7P6Tk9p+cOJAAAAAAAAAAAALcHkF1HUn6B4SJuWFVHwnqeXUfCgSK7jjTvQFUdOQlQXUead6CqjnQFisy7bwKorCPNAFV1JAyQXUdifaCgjrTvQFEdaQaoqiMOJAAAAAAAgBtyQ27IDbkhN+SG3NCBBAAAAAAAcENuyA25ITfkhtyQGzqQAAAAAAAAANP8An9KxhZhKJ0pAAAAAElFTkSuQmCC",
      "fw": 32,
      "fh": 32,
      "foot": 26,
      "facesLeft": false,
      "anims": {
        "idle": [
          0,
          1
        ],
        "run": [
          2,
          3,
          4,
          5
        ],
        "jump": [
          6,
          7,
          8
        ],
        "attack": [
          9,
          10,
          11
        ],
        "land": [
          0
        ],
        "crouch": [
          0
        ],
        "crouchWalk": [
          3,
          4
        ]
      }
    }
  },
  "enemy": {
    "slime": {
      "atlas": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAEACAYAAADSoXR2AAAB+0lEQVR42u3bUUrEMBQF0NmL4jYEl+GC/NcNzFb8dk/SIcJIqe0k6eS9IpxCEBwkx2lCyE3eaZqm05HtBAAAAAAAAAAAAHDPH79+f0zzlgZYdvzy9T49n99yALP/9udZQkIBy87Lc54+f1v5rPeb6O788eFptfPy+/Kz93V0AUoH16d0VNockQKotVBADXHtPASwNv3mo39P57um4bWzZdvTubUAAAAAAAAAAAAAYNj2PA0wMhfYvTUblQt0ASJygWZAVC7QBYjIBboBo3OB7lcwOhfYNQhH5gLd03B0LmAtAAAAAAAAAAAAABiyPU8DROQC3Vuz0blAEyAyF6gConOBJkBkLtAMiMoFml9BVC7QNQgjcoHmaRiVC1gLAAAAAAAAAAAAAO7anqcBInOB5q1ZVC5wE5CRC2wCsnKBm4CMXKAKiM4Fqq8gOhdoGoSRuUB1GkbnAtYCAAAAAAAAAAAAgF3b8zRARi5Q3ZpF5wKrgMxc4A8gOxdYBWTmApuArFxg8xVk5QI3B2FGLrA5DbNyAWsBAAAAAAAAAIDid8Xvit8Vvyt+V/wOAAAAAAAAAAAA8P8AUQfZhxa+d9eeRxxkH1r4Xr0/kHGQfWjhexWQcZB9aOF70yCMPsg+tPDdWgAAAAAAAAAAAADgcrvL7S63u9zucru1AKC0C2MGsGpvTY2FAAAAAElFTkSuQmCC",
      "fw": 32,
      "fh": 32,
      "foot": 31,
      "facesLeft": true,
      "anims": {
        "walk": [
          0,
          1,
          2,
          3,
          4
        ],
        "death": [
          5,
          6,
          7
        ]
      }
    },
    "goblin": {
      "atlas": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAEACAYAAADSoXR2AAAC80lEQVR42u3bPWocQRCG4TmQM2fCoVFgkDBWbHBio0Cp0EkUOvYpfB1fQeGYDmZp7+5sV9fWV4XhDRr0g7afnZ4VU193Leu6LpVjAQAAAAAAALx/+OHpdt2+fnf/fk0FtMnbePn1fBhehBvQT97Gt9cfeYA24bIsh3e+fZ8K6C99yRUoXYJjRJu8/1SkXIFt0m20pfAg3O+8AfrRY2SA/p2fm7xdhe1n4YA/Xx7+mfDcO5cC+hfuJ22j4X5/vF1/3nw+/N6KMAPuPn09vODb98e1jTZxP3m//tZ7wQVoL94mPZ5c/inYENvab5e8X5Y0wPEap/8nLAXsXQEPgmdCAAAAAAAAoCwXcAEicwE3IKoodVdGUbmAGxCVC1wNKFmCyFzg6ur42lxgGhCdC0wBFLmAGaDKBcwAVS5gBqhyARcgMheYugkVuYAbEFWWu/8TlgIicwGeCQEAAAAAAIBpQHQuMAVQ5ALTgOiidLoyis4FpgHRuYAbULIEilzAXR1H5QJmgCoXMAGUucAQoM4FhgB1LjAEqHOBKYAiFzDdhMpcYBoQXZa7DrGUARS5AM+EAAAAAAAAgBmgygVMAGUuYAaoilJzZaTKBcwAVS4wDShZAmUuMF0dR+cCQ4A6F7gIyMgFdgFZucAuICsX2AVk5QImgDIXuHgTZuQCZoCqLJ86xFIGUOYCPBMCAAAAAAAAQ4A6F7gIyMgFhgB1UTqsjNS5wBCgzgXMgJIlyMgFzNWxKhfYBWTlAmcBmbnACSA7FzgBZOcCJ4DsXOAiICMXOHsTZuYCQ4C6LDcdYikDZOQCPBMCAAAAAM3vNL/T/E7zO83vNL/T/E7zO83vNL8DAAAAAAAA/xdAuZFd2vhuBih3UUsb36ePdis2sksb313d99Eb2aWN7+b+AuVGdmnj+y4gcyO7tPF9eLI6YyO7tPHd1H2v3sgubXyf6j0vA6g3snkmBAAAAAAAADjczuF2DrdzuJ3D7Rxu53A7h9s53M4zIYC/lCu/FeARib0AAAAASUVORK5CYII=",
      "fw": 32,
      "fh": 32,
      "foot": 31,
      "facesLeft": true,
      "anims": {
        "walk": [
          0,
          1,
          2,
          3,
          4
        ],
        "death": [
          5,
          6,
          7
        ]
      }
    }
  },
  "tile": {
    "atlas": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAYAAACm53kpAAABT0lEQVR42u1XMQ7CMAz045gZGFhgAAaGwoBUiQewwANYeC3IlU5YVztN0w4VdDi1SX2x6/qcVJaH/XtM7C6nUfhD11EsVutwTq8KiYKHARMY1l759hpBn9fbqoFdn6/eOsphfio22Clux6o1JzYoOPCMdewtwFy9B9Se+Xr/un7hBYqkgqOAPY9tzIwcvnBGPbIlMJhrnaR4AF6e53O44OfYRZCxe0CuHnkcaR7zXXK0cukjRUkZepWBkrOl5wXIZZ1CZGtl43FYYik+ZAlfeCZc7p4z+3WiUorW6FOOltvlp7TkWz2ghDwkgKlBfuVF5gRMOQGebHKktKnPDaK9PMUHl/sWN03J3WO9BqnNMeeFowYZNdUoYez7/nxkfQD2CW6zDc4S+PcEeKVWqu+SbbJE31F5R+f/ZAKGkBGAPTF6Pzwp2NNZyQGKT6F91/gAwTVN2/Mb7dwAAAAASUVORK5CYII=",
    "fw": 16,
    "fh": 16,
    "grass": [
      0,
      1
    ],
    "dirt": [
      2,
      3
    ]
  }
};

(function () {
  const list = [];
  function prep(o) {
    if (typeof Image === 'undefined') { o.img = null; return; }
    o.img = new Image();
    list.push(new Promise(function (res) { o.img.onload = res; o.img.onerror = res; o.img.src = o.atlas; }));
  }
  for (const k in ART.hero) prep(ART.hero[k]);
  for (const k in ART.enemy) prep(ART.enemy[k]);
  prep(ART.tile);
  ART.ready = Promise.all(list);
})();
