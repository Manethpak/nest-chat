<script lang="ts">
  import autoAnimate from "@formkit/auto-animate";
  import io, { Socket } from "socket.io-client";
  import { onMount } from "svelte";

  let socket: Socket;
  const id = Date.now();

  onMount(() => {
    socket = io("http://192.168.1.4:3000");

    socket.on("receive", receiveMessage);
  });

  let name = "";
  let message = "";
  let errorMsg = false;
  let chats = [];

  function sendMessage() {
    if (message === "") {
      errorMsg = true;
      return;
    }

    socket.emit("send", {
      id,
      sender: name || "Anonymous",
      message: message,
    });
    errorMsg = false;
    message = "";
  }

  function receiveMessage(data) {
    chats = [...chats, data];
  }

  function formatTime(time: string) {
    const date = new Date(time);
    // pad 0 to single digit
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${hour}:${minute}`;
  }
</script>

<main
  class="w-screen h-screen flex flex-col justify-center items-center gap-2 px-6"
>
  <div>Enter your name here</div>
  <input
    type="text"
    placeholder="Type here"
    class="input input-bordered input-sm w-full max-w-xs"
    bind:value={name}
  />
  <div
    class="mx-4 w-full md:w-[50vw] h-[75vh] border rounded-2xl overflow-auto p-5 flex flex-col-reverse justify-start"
  >
    {#if errorMsg}
      <label class="label" for="input">
        <span class="label-text-alt text-error">Chat cannot be empty</span>
      </label>
    {/if}
    <div
      id="chat"
      class="gap-2 flex flex-col justify-end no-scrollbar h-full"
      use:autoAnimate
    >
      {#each chats as chat}
        <div class="chat {id === chat.id ? 'chat-end' : 'chat-start'}">
          <div class="chat-header">
            {chat.sender}
            <time class="text-xs opacity-50">{formatTime(chat.timestamp)}</time>
          </div>
          <div
            class="chat-bubble {id === chat.id ? '' : 'chat-bubble-primary'}"
          >
            {chat.message}
          </div>
        </div>
      {/each}
    </div>
  </div>
  <form
    class="flex w-full md:w-[50vw] gap-2"
    on:submit|preventDefault={sendMessage}
  >
    <input
      type="text"
      id="input"
      placeholder="Type here"
      class="input input-bordered w-full {errorMsg
        ? 'input-error'
        : 'input-primary'}
      "
      on:focus={() => (errorMsg = false)}
      bind:value={message}
      autocomplete="off"
    />
    <button class="btn btn-primary w-[3rem] text-white" type="submit">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-full h-full"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
        />
      </svg>
    </button>
  </form>
</main>
