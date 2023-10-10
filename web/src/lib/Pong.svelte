<script lang="ts">
    import {
        ballPosition,
        display,
        isServer,
        opponent,
        opponentPosition,
        score,
        sendExit,
        sendPosition,
        sendPositionAndBall,
        sendScore,
    } from "../pong";
    import Modal from "./Modal.svelte";
    let screen: HTMLElement | null = null;

    let myPosition = 0;
    let opPosition = 0;

    let ballVelocity = { x: 0, y: 0 };

    let myPaddle: HTMLElement | null = null;
    let opPaddle: HTMLElement | null = null;
    let ball: HTMLElement | null = null;

    function restart() {
        if (!$isServer) return;

        const getRandomInt = (max: number) => {
            return Math.floor(Math.random() * max);
        };

        $ballPosition.x = screen!.clientWidth / 2 - ball!.clientWidth / 2;
        $ballPosition.y = screen!.clientHeight / 2 - ball!.clientHeight / 2;
        ballVelocity.x = 0;
        ballVelocity.y = 0;

        setTimeout(() => {
            ballVelocity.y = Math.random() * 2;
            ballVelocity.x = (getRandomInt(2) - 0.5) * 6;
        }, 1000);
    }

    function updateScreen() {
        myPaddle!.style.top = myPosition + "px";
        opPaddle!.style.top = opPosition + "px";
        ball!.style.top = $ballPosition.y + "px";

        if ($isServer) {
            ball!.style.left = $ballPosition.x + "px";
        } else {
            ball!.style.right = $ballPosition.x + "px";
        }
    }

    function updateClient() {
        updateScreen();
        sendPosition(myPosition);
    }

    function updateServer() {
        updateScreen();

        $ballPosition.x += ballVelocity.x;
        $ballPosition.y += ballVelocity.y;

        if (
            $ballPosition.x >
                screen!.clientWidth -
                    ball!.clientWidth -
                    opPaddle!.clientWidth &&
            opPosition < $ballPosition.y + myPaddle!.clientWidth &&
            $ballPosition.y < opPosition + opPaddle!.clientHeight
        ) {
            ballVelocity.x *= -1.05;
            $ballPosition.x =
                screen!.clientWidth - ball!.clientWidth - opPaddle!.clientWidth;
        }

        if (
            $ballPosition.x < 0 + myPaddle!.clientWidth &&
            myPosition < $ballPosition.y + ball!.clientWidth &&
            $ballPosition.y < myPosition + myPaddle!.clientHeight
        ) {
            ballVelocity.x *= -1.05;
            $ballPosition.x = myPaddle!.clientWidth;
        }

        if (
            $ballPosition.y > screen!.clientHeight - ball!.clientHeight ||
            $ballPosition.y < 0
        ) {
            ballVelocity.y *= -1;
        }

        if ($ballPosition.x > screen!.clientWidth - ball!.clientWidth) {
            $score.my += 1;
            sendScore($score);
            restart();
        }

        if ($ballPosition.x < 0) {
            $score.opponent += 1;
            sendScore($score);
            restart();
        }

        sendPositionAndBall(myPosition, $ballPosition);
    }

    function update() {
        if ($opponent) {
            if ($isServer) {
                updateServer();
            } else {
                updateClient();
            }
        }
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);

    document.onmousemove = (ev) => {
        myPosition += ev.movementY;
        if (myPosition < 0) myPosition = 0;

        const height = screen!.clientHeight - myPaddle!.clientHeight;
        if (myPosition > height) myPosition = height;
    };

    $: $opponent,
        (() => {
            if ($opponent) {
                $display = true;
                restart();
            } else {
                $score.my = 0;
                $score.opponent = 0;
                $display = false;
            }
        })();
    $: $opponentPosition, (opPosition = $opponentPosition);
</script>

<Modal display={$display}>
    <div class="pong" bind:this={screen}>
        <div class="paddle left" bind:this={myPaddle} />
        <div class="paddle right" bind:this={opPaddle} />

        <div class="ball" bind:this={ball} />

        <div class="line" />

        <p class="score left">{$score.my}</p>
        <p class="score right">{$score.opponent}</p>
    </div>

    <div style="height: 2vh;" />

    <button
        on:click={() => {
            if ($opponent) sendExit();
            $opponent = null;
            $display = false;
        }}>Exit</button
    >
</Modal>

<style>
    .pong {
        width: 70vmax;
        height: 35vmax;
        padding: 0;
        margin: 0;
        background-color: black;
    }

    .paddle {
        width: 2vmax;
        height: 8vmax;
        background-color: #fff;
        position: absolute;
    }

    .paddle.left {
        left: 0;
        position: absolute;
    }

    .paddle.right {
        right: 0;
        position: absolute;
    }

    .ball {
        background-color: #fff;
        width: 3vmax;
        height: 3vmax;
        border-radius: 50%;
        position: absolute;
    }

    .line {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 0.5vmax;
        height: 35vmax;
        background-color: #fff;
    }

    .score {
        color: #fff;
        position: absolute;
        font-size: 4vmax;
    }

    .score.left {
        left: 23%;
    }

    .score.right {
        right: 23%;
    }
</style>
