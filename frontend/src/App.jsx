import { Editor } from "@monaco-editor/react";
import { useRef, useMemo, useState, useEffect } from "react";
import { SocketIOProvider } from "y-socket.io";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";

const App = () => {
  const editorRef = useRef(null);
  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });
  const [users, setUsers] = useState([]);
  const yDoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => yDoc.getText("monaco"), [yDoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;

    const monacoBinding = new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsername(e.target.username.value);
    window.history.pushState({}, "", `?username=${e.target.username.value}`);
  };
  useEffect(() => {
    if (username) {
      const provider = new SocketIOProvider("/", "monaco", yDoc, {
        autoConnect: true,
      });

      provider.awareness.setLocalStateField("user", { username });

      const states = Array.from(provider.awareness.getStates().values());
      setUsers(
        states
          .filter((state) => state.user && state.user.username)
          .map((state) => state.user),
      );

      provider.awareness.on("change", () => {
        const states = Array.from(provider.awareness.getStates().values());
        setUsers(
          states
            .filter((state) => state.user && state.user.username)
            .map((state) => state.user),
        );
      });

      function handleBeforeUnload() {
        provider.awareness.setLocalState("user", null);
      }
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        provider.disconnect();
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [username]);

  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-950 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded flex flex-col items-center gap-4 shadow-lg "
        >
          <h1 className="text-2xl mb-4 text-gray-950 font-bold">
            Enter your username
          </h1>
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="w-full p-2 rounded border bg-gray-700 text-gray-300 border-gray-300"
          />
          <button
            type="submit"
            className="w-full font-bold cursor-pointer outline-none bg-white text-gray-950 p-2 rounded hover:bg-blue-600"
          >
            Join
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-gray-950 flex gap-4 p-4">
      <aside className="w-1/4 h-full bg-amber-50 text-white p-4 rounded">
        <h2 className="text-gray-950 text-xl font-bold mb-4 border-b border-gray-300">
          Users
        </h2>
        <ul className="flex flex-col gap-2">
          {users.map((user, index) => (
            <li
              key={index}
              className="bg-gray-950 text-white p-2 rounded shadow text-ellipsis whitespace-nowrap overflow-hidden"
            >
              {user.username}
            </li>
          ))}
        </ul>
      </aside>
      <section className="w-3/4 h-full bg-neutral-800 text-white p-4 rounded overflow-hidden">
        <Editor
          height="100%"
          language="javascript"
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>
    </main>
  );
};

export default App;
