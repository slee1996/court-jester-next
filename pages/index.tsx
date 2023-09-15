import { Inter } from "next/font/google";
import { useState } from "react";
import { MainContent } from "./components/MainContent";
import { Poem } from "./components/Poem";
import { ShiftingBackground } from "./components/ShiftingBg";
import anime from "animejs";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [prompt, setPrompt] = useState<string>(
    `describe("add function", () => {test('add function should add multiple numbers', () => { expect(addFn("5","0",5)).toBe(10) });test('should add two positive integers', () => { expect(addFn(2,2)).toBe(4) });})`
  );
  const [numberOfResponses, setNumberOfResponses] = useState<number>(1);
  const [chats, setChats] = useState<Response | null>();
  const [messages, setMessages] = useState<Set<any>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const [previousRegion, setPreviousRegion] = useState<any>(null);

  const handleSliderChange = (newValue: number) => {
    setNumberOfResponses(newValue);
  };

  const sendPrompt = async () => {
    const res = await fetch("http://localhost:3000/api/promptGpt", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        prompt: { role: "user", content: prompt },
        numberOfResponses: numberOfResponses,
      }),
    });
    const data = await res.json();

    setChats(data);
  };

  useEffect(() => {
    const eventSourceUrl = "/api/ssePromptGpt";
    const eventSource = new EventSource(eventSourceUrl);

    eventSource.onmessage = (event) => {
      console.log("Received event:", event.data);
      setMessages((currentValue) => {
        return currentValue.has(event.data)
          ? currentValue
          : // @ts-ignore
            new Set([...currentValue, event.data]);
      });
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  function getRandomIntegerInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomColorInRange(min: number, max: number) {
    min = Math.max(Math.min(min, 255), 0);
    max = Math.max(Math.min(max, 255), 0);

    let r, g, b;
    do {
      r = getRandomIntegerInRange(min, max);
      g = getRandomIntegerInRange(min, max);
      b = getRandomIntegerInRange(min, max);
    } while (r === 0 && g === 0 && b === 0);

    const rgbToHex = (r: number, g: number, b: number) =>
      "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

    return rgbToHex(r, g, b);
  }

  function createRegions(numRegionsX: number, numRegionsY: number) {
    const width = window.innerWidth / numRegionsX;
    const height = window.innerHeight / numRegionsY;

    const createBounds = (length: any, size: number) =>
      Array.from({ length }, (_, i) => [size * i, size * (i + 1)]);

    const xBounds = createBounds(numRegionsX, width);
    const yBounds = createBounds(numRegionsY, height);

    return xBounds.flatMap((x) =>
      yBounds.map((y) => ({
        xBound: x,
        yBound: y,
      }))
    );
  }

  function tweakHexColor(hexColor: string, shadeRange = 20) {
    const getRandomShadeOffset = (range: number) =>
      Math.floor(Math.random() * range) - range / 2;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    const newR = clamp(r + getRandomShadeOffset(shadeRange), 0, 255);
    const newG = clamp(g + getRandomShadeOffset(shadeRange), 0, 255);
    const newB = clamp(b + getRandomShadeOffset(shadeRange), 0, 255);

    return `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  }

  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function spawnDivs() {
    const numRegionsX = getRandomIntegerInRange(0, 16);
    const numRegionsY = getRandomIntegerInRange(0, 16);
    const regions = createRegions(numRegionsX, numRegionsY);
    const addedDivs = new Set();

    const pulseAnimations = Array.from(
      { length: 10 },
      (_, i) => `
    @keyframes pulse${i + 1} {
      0% { transform: scale(1); }
      50% { transform: scale(${1 + (i + 1) * 0.1}); }
      100% { transform: scale(1); }
    }
  `
    ).join("");

    const moveAnimations = Array.from(
      { length: 100 },
      (_, i) => `
    @keyframes move${i + 1} {
      0% { transform: translateY(0) translateX(0); }
      50% { transform: translateY(${
        getRandomIntegerInRange(-30, 30) *
        (i + 1) *
        (i + getRandomIntegerInRange(1, 10))
      }px) translateX(${
        getRandomIntegerInRange(-30, 30) * (i + getRandomIntegerInRange(0, 10))
      }px); }
      100% { transform: translateY(0) translateX(0); }
    }
  `
    ).join("");

    const styleElement = document.createElement("style");
    styleElement.innerHTML = `${pulseAnimations} ${moveAnimations}`;
    document.head.appendChild(styleElement);

    async function spawn() {
      shuffleArray(regions);
      for (const region of regions) {
        const [minX, maxX] = region.xBound;
        const [minY, maxY] = region.yBound;
        const spawnPointX = getRandomIntegerInRange(
          minX === 0 ? -20 : minX,
          maxX
        );
        const spawnPointY = getRandomIntegerInRange(
          minY === 0 ? -20 : minY,
          maxY
        );
        const spawnDimensions = getRandomIntegerInRange(10, 200);
        const dropShadowDimensionsOffsetX = 0;
        const dropShadowDimensionsOffsetY = 0;
        const spawnOpacity = Math.random();
        const newDiv = document.createElement("div");
        const randomColor = getRandomColorInRange(50, 255);

        newDiv.style.position = "absolute";
        newDiv.style.left = spawnPointX + "px";
        newDiv.style.top = spawnPointY + "px";
        newDiv.style.width = spawnDimensions + "px";
        newDiv.style.height = spawnDimensions + "px";
        newDiv.style.backgroundColor = randomColor;
        newDiv.style.opacity = spawnOpacity.toString();
        newDiv.style.borderRadius = "50%";
        newDiv.style.filter = `drop-shadow(${dropShadowDimensionsOffsetX}px -${dropShadowDimensionsOffsetY}px 5px ${tweakHexColor(
          randomColor
        )})`;

        // Assign random animations to each div
        const randomPulseAnimation = `pulse${getRandomIntegerInRange(1, 3)}`;
        const randomMoveAnimation = `move${getRandomIntegerInRange(1, 10)}`;
        const randomPulseDuration = getRandomIntegerInRange(2, 5);
        const randomMoveDuration = getRandomIntegerInRange(2, 6);

        newDiv.style.animation = `${randomMoveAnimation} ${randomMoveDuration}s infinite ease-in-out, ${randomPulseAnimation} ${randomPulseDuration}s infinite ease-in-out`;

        const targetDiv = document.getElementById("targetDiv");
        targetDiv?.insertAdjacentElement("beforebegin", newDiv);

        addedDivs.add(newDiv);
        await sleep(getRandomIntegerInRange(10, 600));
      }
    }

    async function remove() {
      while (true) {
        await sleep(getRandomIntegerInRange(10, 2000));

        for (const div of Array.from(addedDivs)) {
          // @ts-ignore
          div.remove();
          addedDivs.delete(div);
          await sleep(getRandomIntegerInRange(10, 200));
        }
      }
    }

    await Promise.all([spawn(), spawn()]);
  }

  return (
    <>
      {/* <div className='shifting-background w-full h-screen'> */}
      {/* <div id='targetDiv'> */}
      {/* <Poem /> */}

      {/* <ShiftingBackground /> */}
      {Array.from(messages).length > 0 &&
        Array.from(messages).map((message, i) => <div key={i}>{message}</div>)}
      <MainContent
        setPrompt={setPrompt}
        numberOfResponses={numberOfResponses}
        handleSliderChange={handleSliderChange}
        setChats={setChats}
        sendPrompt={sendPrompt}
        chats={chats as Response}
      />
      {/* </div>
      </div> */}
    </>
  );
}
