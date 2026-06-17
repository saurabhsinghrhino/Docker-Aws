import { Editor } from "@monaco-editor/react";

const App = () => {
  return (
    <main className="h-screen w-full bg-gray-950 flex gap-4 p-4">
      <aside className="w-1/4 h-full bg-amber-50 text-white p-4 rounded"></aside>
      <section className="w-3/4 h-full bg-neutral-800 text-white p-4 rounded overflow-hidden">
        <Editor height="100%" language="javascript" theme="vs-dark" />
      </section>
    </main>
  );
};

export default App;
