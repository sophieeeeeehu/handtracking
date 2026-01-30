import { useEffect, useRef } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

function Wand() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dist = (a: any, b: any) =>
        Math.hypot(a.x - b.x, a.y - b.y); // for calculating distance between two fingers I guess

    useEffect(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const hands = new Hands({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
            selfieMode: true,
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
        });

        function isHandOpen(landmarks: any[]) {
            const fingers = [
                [8, 5],
                [12, 9],
                [16, 13],
                [20, 17],
            ];

            // 0  = wrist
            // 1  = thumb CMC
            // 2  = thumb MCP
            // 3  = thumb IP
            // 4  = thumb tip
            // 5  = index MCP
            // 6  = index PIP
            // 7  = index DIP
            // 8  = index tip
            // 9  = middle MCP
            // 10 = middle PIP
            // 11 = middle DIP
            // 12 = middle tip
            // 13 = ring MCP
            // 14 = ring PIP
            // 15 = ring DIP
            // 16 = ring tip
            // 17 = pinky MCP
            // 18 = pinky PIP
            // 19 = pinky DIP
            // 20 = pinky tip

            let openFingers = 0;

            for (const [tip, base] of fingers) {
                if (dist(landmarks[tip], landmarks[base]) > 0.08) {
                    openFingers++;
                }
            }

            // 3+ fingers open = open hand
            return openFingers >= 3;
        }


        function isOkSign(landmarks: any[]) {

            let openFingers = 0;

            if (dist(landmarks[4], landmarks[8]) < dist(landmarks[4], landmarks[7])) {
                openFingers++;
            }

            if (dist(landmarks[12], landmarks[9]) > dist(landmarks[11], landmarks[9])) {
                openFingers++;
            }

            if (dist(landmarks[20], landmarks[17]) > dist(landmarks[19], landmarks[17])) {
                openFingers++;
            }

            // 3+ fingers open = open hand
            return openFingers >= 3;
        }

        function isMiddle(landmarks: any[]) {

            let openFingers = 0;
            if (landmarks[12].y < landmarks[10].y) {
                openFingers++;
            }

            if (landmarks[11].y < landmarks[10].y) {
                openFingers++;
            }
            // 3+ fingers open = open hand
            return openFingers >= 2;
        }

        function isFirst(landmarks: any[]) {

            let openFingers = 0;

            if (landmarks[8].y < landmarks[6].y) {
                openFingers++;
            }

            if (landmarks[7].y < landmarks[6].y) {
                openFingers++;
            }
            // 3+ fingers open = open hand
            return openFingers >= 2;
        }

        function isFour(landmarks: any[]) {

            let openFingers = 0;

            if (landmarks[16].y < landmarks[14].y) {
                openFingers++;
            }

            if (landmarks[15].y < landmarks[14].y) {
                openFingers++;
            }
            // 3+ fingers open = open hand
            return openFingers >= 2;
        }

        hands.onResults((results) => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext("2d")!;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            results.multiHandLandmarks?.forEach((landmarks) => {



                ctx.font = "48px serif";
                const ok = isOkSign(landmarks)
                const middle = isMiddle(landmarks)
                const first = isFirst(landmarks)
                const four = isFour(landmarks)

                if (ok && four) {
                    const x = landmarks[4].x * canvas.width;
                    const y = landmarks[4].y * canvas.height;
                    ctx.fillText("👽", x - 30, y + 5);

                }

                if (!ok && first && !middle) {
                    const x = landmarks[8].x * canvas.width;
                    const y = landmarks[8].y * canvas.height;
                    ctx.fillText("💡", x - 30, y + 5);
                }

                if (!ok && !first && middle) {
                    const x = landmarks[12].x * canvas.width;
                    const y = landmarks[12].y * canvas.height;
                    ctx.fillText("👹", x - 30, y + 5);

                }

                if (!ok && first && middle && !four) {
                    const x = landmarks[12].x * canvas.width;
                    const y = landmarks[12].y * canvas.height;

                    const x1 = landmarks[8].x * canvas.width;
                    const y1 = landmarks[8].y * canvas.height;
                    ctx.fillText("✌️", x - 30, y + 5);
                    ctx.fillText("✌️", x1 - 30, y1 + 5);

                }


            });
        });

        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                await hands.send({ image: videoRef.current! });
            },
            width: 640,
            height: 480,
        });

        camera.start();
    }, []);

    return (
        <div style={{ position: "relative", width: 640, height: 480 }}>
            <video
                ref={videoRef}
                style={{
                    position: "absolute",
                    transform: "scaleX(-1)"
                }}
                autoPlay
                muted
            />
            <canvas
                ref={canvasRef}
                width={640}
                height={480}
                style={{ position: "absolute" }}
            />
        </div>
    );
}

export default Wand;