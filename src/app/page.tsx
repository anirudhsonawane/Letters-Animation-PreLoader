"use client";

import {
  useLayoutEffect,
  useRef,
} from "react";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

import "./landing.css";

gsap.registerPlugin(
  CustomEase,
  SplitText
);

CustomEase.create(
  "hop",
  ".8, 0, .3, 1"
);


export default function Page() {

  const rootRef =
    useRef<HTMLDivElement | null>(null);


  useLayoutEffect(() => {

    const root =
      rootRef.current;

    if (!root) {
      return;
    }


    let cancelled = false;

    const splits: SplitText[] = [];


    const ctx =
      gsap.context(() => {

        const splitTextElements = (
          selector: string,
          type = "words,chars",
          addFirstChar = false
        ) => {

          root
            .querySelectorAll(selector)
            .forEach((element) => {

              const split =
                new SplitText(
                  element,
                  {
                    type,

                    wordsClass:
                      "word",

                    charsClass:
                      "char",
                  }
                );


              splits.push(split);


              if (
                type.includes("chars")
              ) {

                split.chars.forEach(
                  (
                    char,
                    index
                  ) => {

                    const text =
                      char.textContent ??
                      "";

                    char.innerHTML =
                      `<span>${text}</span>`;


                    if (
                      addFirstChar &&
                      index === 0
                    ) {

                      char.classList.add(
                        "first-char"
                      );

                    }

                  }
                );

              }

            });

        };


        document.fonts.ready.then(() => {

          if (cancelled) {
            return;
          }


          /* =================================
             PRELOADER SPLITS
          ================================= */

          splitTextElements(
            ".intro-title h1",
            "words,chars",
            true
          );


          splitTextElements(
            ".outro-title h1"
          );


          splitTextElements(
            ".tag p",
            "words"
          );


          /* =================================
             VIEWPORT
          ================================= */

          const isMobile =
            window.innerWidth <= 1000;


          /* =================================
             P10 INITIAL STATES
          ================================= */

          gsap.set(
            [
              ".split-overlay .intro-title .first-char span",
              ".split-overlay .outro-title .char span",
            ],
            {
              y: "0%",
            }
          );


          gsap.set(
            ".split-overlay .intro-title .char:not(.first-char) span",
            {
              y: "-100%",
            }
          );


          gsap.set(
            ".split-overlay .intro-title .first-char",
            {
              x:
                isMobile
                  ? "7.5rem"
                  : "18rem",

              y:
                isMobile
                  ? "-1rem"
                  : "-2.75rem",

              fontWeight: 900,

              scale: 0.75,
            }
          );


          gsap.set(
            ".split-overlay .outro-title .char",
            {
              x:
                isMobile
                  ? "-3rem"
                  : "-8rem",

              fontSize:
                isMobile
                  ? "6rem"
                  : "14rem",

              fontWeight: 500,
            }
          );


          /* =================================
             TAG INITIAL STATE
          ================================= */

          gsap.set(
            ".tag .word",
            {
              y: "-100%",
            }
          );


          /* =================================
             CONTAINER INITIAL STATE
          ================================= */

          gsap.set(
            ".container",
            {
              clipPath:
                "polygon(0% 48%, 0% 48%, 0% 52%, 0% 52%)",
            }
          );


          /* =================================
             CARD INITIAL STATE

             CARD IS ALWAYS A COMPLETE
             RECTANGLE.
          ================================= */

          gsap.set(
            ".card",
            {
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }
          );


          /* =================================
             TIMELINE
          ================================= */

          const tl =
            gsap.timeline({
              defaults: {
                ease: "hop",
              },
            });


          /* =================================
             TAGS ENTER
          ================================= */

          const tags =
            Array.from(
              root.querySelectorAll(".tag")
            );


          tags.forEach(
            (tag, index) => {

              tl.to(
                tag.querySelectorAll(
                  ".word"
                ),
                {
                  y: "0%",

                  duration: 0.75,
                },
                0.5 +
                  index * 0.1
              );

            }
          );


          /* =================================
             INTRO ENTER
          ================================= */

          tl.to(
            ".preloader .intro-title .char span",
            {
              y: "0%",

              duration: 0.75,

              stagger: 0.05,
            },
            0.5
          );


          /* =================================
             INTRO EXIT
          ================================= */

          tl.to(
            ".preloader .intro-title .char:not(.first-char) span",
            {
              y: "100%",

              duration: 0.75,

              stagger: 0.05,
            },
            2
          );


          /* =================================
             10 ENTER
          ================================= */

          tl.to(
            ".preloader .outro-title .char span",
            {
              y: "0%",

              duration: 0.75,

              stagger: 0.075,
            },
            2.5
          );


          /* =================================
             N MOVE
          ================================= */

          tl.to(
            ".preloader .intro-title .first-char",
            {
              x:
                isMobile
                  ? "9rem"
                  : "21.25rem",

              duration: 1,
            },
            3.5
          );


          /* =================================
             10 MOVE
          ================================= */

          tl.to(
            ".preloader .outro-title .char",
            {
              x:
                isMobile
                  ? "-3rem"
                  : "-8rem",

              duration: 1,
            },
            3.5
          );


          /* =================================
             N MORPH
          ================================= */

          tl.to(
            ".preloader .intro-title .first-char",
            {
              x:
                isMobile
                  ? "7.5rem"
                  : "18rem",

              y:
                isMobile
                  ? "-1rem"
                  : "-2.75rem",

              fontWeight: 900,

              scale: 0.75,

              duration: 0.75,
            },
            4.5
          );


          /* =================================
             10 MORPH
          ================================= */

          tl.to(
            ".preloader .outro-title .char",
            {
              x:
                isMobile
                  ? "-3rem"
                  : "-8rem",

              fontSize:
                isMobile
                  ? "6rem"
                  : "14rem",

              fontWeight: 500,

              duration: 0.75,

              onComplete: () => {

                gsap.set(
                  ".preloader",
                  {
                    clipPath:
                      "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
                  }
                );


                gsap.set(
                  ".split-overlay",
                  {
                    clipPath:
                      "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                  }
                );

              },
            },
            4.5
          );


          /* =================================
             SLIT OPENS
          ================================= */

          tl.to(
            ".container",
            {
              clipPath:
                "polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)",

              duration: 1,
            },
            5
          );


          /* =================================
             TAGS EXIT
          ================================= */

          tags.forEach(
            (tag, index) => {

              tl.to(
                tag.querySelectorAll(
                  ".word"
                ),
                {
                  y: "100%",

                  duration: 0.75,
                },
                5.5 +
                  index * 0.1
              );

            }
          );


          /* =================================
             PRELOADER SPLIT
          ================================= */

          tl.to(
            [
              ".preloader",
              ".split-overlay",
            ],
            {
              y: (index) =>
                index === 0
                  ? "-50%"
                  : "50%",

              duration: 1,
            },
            6
          );


          /* =================================
             CONTAINER FULL
          ================================= */

          tl.to(
            ".container",
            {
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",

              duration: 1,
            },
            6
          );


          /* =================================
             CARD REVEAL
          ================================= */

          tl.to(
            ".container .card",
            {
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",

              duration: 0.75,
            },
            6.25
          );


          /* =================================
             FINISH
          ================================= */

          tl.call(() => {

            document.body.style.overflow =
              "auto";

          });


          (
            root as HTMLDivElement & {
              __p10Timeline?: gsap.core.Timeline;
            }
          ).__p10Timeline = tl;

        });

      },
      root
    );


    /* =======================================
       CLEANUP
    ======================================== */

    return () => {

      cancelled = true;


      const element =
        root as HTMLDivElement & {
          __p10Timeline?: gsap.core.Timeline;
        };


      element.__p10Timeline?.kill();

      delete element.__p10Timeline;


      splits.forEach(
        (split) => {
          split.revert();
        }
      );


      ctx.revert();


      document.body.style.overflow =
        "hidden";

    };

  }, []);


  return (
    <div
      ref={rootRef}
      className="p10-root"
    >

      {/* ===================================
          PRELOADER
      ==================================== */}

      <div className="preloader">

        <div className="intro-title">

          <h1>
            Nullspace Studio
          </h1>

        </div>


        <div className="outro-title">

          <h1>
            10
          </h1>

        </div>

      </div>


      {/* ===================================
          SPLIT OVERLAY
      ==================================== */}

      <div className="split-overlay">

        <div className="intro-title">

          <h1>
            Nullspace Studio
          </h1>

        </div>


        <div className="outro-title">

          <h1>
            10
          </h1>

        </div>

      </div>


      {/* ===================================
          TAGS
      ==================================== */}

      <div className="tags-overlay">

        <div className="tag tag-1">

          <p>
            Negative Space
          </p>

        </div>


        <div className="tag tag-2">

          <p>
            Form & Void
          </p>

        </div>


        <div className="tag tag-3">

          <p>
            Light Studies
          </p>

        </div>

      </div>


      {/* ===================================
          MAIN
      ==================================== */}

      <main className="container">

        <div className="hero-img">

          <img
            src="/images/hero-bg.png"
            alt=""
          />

        </div>


        {/* =================================
            NAV
        ================================== */}

        <nav>

          <p id="logo">
            N10
          </p>


          <p>
            Menu
          </p>

        </nav>


        {/* =================================
            CARD
        ================================== */}

        <div className="card">

          {/* ===============================
              NORMAL CARD
          ================================ */}

          <div className="card-main">

            <div className="card-main-top">

              <p>
                Rehabilitation of the
                Wall of Logroño
              </p>


              <p>
                1/3
              </p>

            </div>


            <h1 className="card-main-title">
              MUR
            </h1>


            <div className="card-main-bottom">

              <p>
                La Rioja, Spain
              </p>


              <p className="card-main-link">
                View Project
              </p>

            </div>

          </div>


          {/* ===============================
              HOVER SPLIT
          ================================ */}

          <div className="card-hover">

            {/* =============================
                TOP HALF
            ============================== */}

            <div
              className="
                card-hover-half
                card-hover-top
              "
            >

              <div className="card-hover-content">

                <div className="card-hover-info">

                  <p>
                    Rehabilitation of the
                    Wall of Logroño
                  </p>


                  <p>
                    1/3
                  </p>

                </div>


                <h1 className="card-hover-title">
                  MUR
                </h1>

              </div>

            </div>


            {/* =============================
                BOTTOM HALF
            ============================== */}

            <div
              className="
                card-hover-half
                card-hover-bottom
              "
            >

              <div className="card-hover-content">

                <h1 className="card-hover-title">
                  MUR
                </h1>


                <div className="card-hover-info">

                  <p>
                    La Rioja, Spain
                  </p>


                  <p className="view-project">
                    View Project
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =================================
            FOOTER
        ================================== */}

        <footer>

          <p>
            Scroll Down
          </p>


          <p>
            Made by Anirudh.   
          </p>

        </footer>

      </main>

      {/* =================================
          NEXT PROJECT SCROLL
      ================================== */}


    </div>
  );
}