"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

import "./Preloader.css";

gsap.registerPlugin(Flip);

const BRAND = "AYUSH";

export default function Preloader() {
    const pathname = usePathname();

    const preloaderRef = useRef<HTMLElement | null>(null);
    const logoRef = useRef<HTMLParagraphElement | null>(null);

    useEffect(() => {
        const preloader = preloaderRef.current;
        const logo = logoRef.current;

        if (!preloader || !logo) {
            return;
        }

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        /*
         * ---------------------------------------------------------
         * CREATE CHARACTER ELEMENTS
         * ---------------------------------------------------------
         */

        logo.innerHTML = BRAND.split("")
            .map(
                (char, index) =>
                    `<div class="pr-char chr-${index + 1}">${char}</div>`
            )
            .join("");

        /*
         * ---------------------------------------------------------
         * STAGES
         * ---------------------------------------------------------
         */

        const stages = ["-stg1", "-stg2", "-stg3"];

        let stageIndex = 0;

        /*
         * ---------------------------------------------------------
         * FINISH PRELOADER
         * ---------------------------------------------------------
         *
         * IMPORTANT:
         *
         * We do NOT create another AYUSH.
         *
         * The existing .preloader-logo remains in the DOM.
         *
         * Only the blue background is moved away.
         *
         */

        const finishPreloader = () => {
            const background =
                preloader.querySelector<HTMLElement>(
                    ".preloader-bg"
                );

            if (!background) {
                document.body.style.overflow =
                    previousOverflow;

                return;
            }

            /*
             * -----------------------------------------------------
             * HOME PAGE BACKGROUND
             * -----------------------------------------------------
             *
             * The Home page remains black underneath.
             */

            if (pathname === "/") {
                document.body.style.backgroundColor =
                    "#000000";
            }

            /*
             * -----------------------------------------------------
             * CURTAIN REVEAL
             * -----------------------------------------------------
             *
             * The existing blue curtain animation remains
             * unchanged.
             */

            gsap.timeline({
                delay: 0.2,

                onComplete: () => {
                    /*
                     * Restore scrolling.
                     */

                    document.body.style.overflow =
                        previousOverflow;
                },
            })
                .to(background, {
                    y: "100%",
                    duration: 1,
                    ease: "power3.inOut",
                })

                /*
                 * IMPORTANT:
                 *
                 * We DO NOT hide the preloader.
                 *
                 * The preloader container remains because
                 * AYUSH itself is inside it.
                 *
                 * Only the blue background has moved away.
                 */

                .set(background, {
                    autoAlpha: 0,
                });
        };

        /*
         * ---------------------------------------------------------
         * MOVE S NEXT TO U
         * ---------------------------------------------------------
         */

        const moveSNextToU = () => {
            const u =
                logo.querySelector<HTMLElement>(
                    ".chr-3"
                );

            const s =
                logo.querySelector<HTMLElement>(
                    ".chr-4"
                );

            if (!u || !s) {
                finishPreloader();

                return;
            }

            /*
             * Remove final stage.
             */

            preloader.classList.remove("-stg3");

            /*
             * Measure actual rendered positions.
             */

            const uRect =
                u.getBoundingClientRect();

            const sRect =
                s.getBoundingClientRect();

            /*
             * Desired final position:
             *
             * U S
             */

            const targetX =
                uRect.right - sRect.left;

            const targetY =
                uRect.top - sRect.top;

            /*
             * Gap between U and S.
             */

            const S_GAP = 0;

            /*
             * Move S next to U.
             */

            gsap.to(s, {
                x: targetX + S_GAP,

                y: targetY,

                duration: 1,

                ease: "power3.inOut",

                overwrite: true,

                onComplete: () => {
                    finishPreloader();
                },
            });
        };

        /*
         * ---------------------------------------------------------
         * RUN FLIP STAGES
         * ---------------------------------------------------------
         */

        const runStage = () => {
            /*
             * All stages completed.
             */

            if (stageIndex === 3) {
                moveSNextToU();

                return;
            }

            /*
             * Select characters participating in this stage.
             */

            const movingChars =
                logo.querySelectorAll<HTMLElement>(
                    `div:nth-child(n + ${stageIndex + 2})`
                );

            /*
             * Capture current layout.

             */

            const state =
                Flip.getState(movingChars);

            /*
             * Remove current stage.

             */

            preloader.classList.remove(
                stages[stageIndex]
            );

            /*
             * Advance stage.

             */

            stageIndex += 1;

            /*
             * Apply next stage.

             */

            if (stageIndex < stages.length) {
                preloader.classList.add(
                    stages[stageIndex]
                );
            }

            /*
             * Animate layout change.

             */

            Flip.from(state, {
                absolute: true,

                duration: 1,

                simple: true,

                ease: "power3.inOut",

                onComplete: () => {
                    runStage();
                },
            });
        };

        /*
         * ---------------------------------------------------------
         * START
         * ---------------------------------------------------------
         */

        preloader.classList.add(
            stages[0]
        );

        runStage();

        /*
         * ---------------------------------------------------------
         * CLEANUP
         * ---------------------------------------------------------
         */

        return () => {
            document.body.style.overflow =
                previousOverflow;

            gsap.killTweensOf(
                preloader
            );

            gsap.killTweensOf(
                logo.querySelectorAll(
                    ".pr-char"
                )
            );
        };
    }, [pathname]);

    /*
     * ---------------------------------------------------------
     * JSX
     * ---------------------------------------------------------
     */

    return (
        <section
            ref={preloaderRef}
            id="ayush-preloader"
            className="ayush-preloader"
        >
            <img
                className="preloader-bg"
                src="/images/preloader/ario-blue.png"
                alt=""
            />

            <p
                ref={logoRef}
                className="preloader-logo"
                aria-label={BRAND}
            >
                {BRAND}
            </p>
        </section>
    );
}