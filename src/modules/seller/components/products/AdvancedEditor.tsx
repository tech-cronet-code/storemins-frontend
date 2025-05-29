// ✅ AdvancedEditor.tsx
import { useEffect, useRef, useState } from "react";

const AdvancedEditor = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHtmlView, setIsHtmlView] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isHtmlView) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value, isHtmlView]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value || "");
    handleInput();
  };

  const toggleHtmlView = () => {
    if (!editorRef.current) return;
    if (isHtmlView) {
      editorRef.current.innerHTML = editorRef.current.innerText;
    } else {
      editorRef.current.innerText = editorRef.current.innerHTML;
    }
    setIsHtmlView(!isHtmlView);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toolbarBtn =
    "w-9 h-9 border border-gray-200 rounded-md text-sm hover:bg-gray-100 flex items-center justify-center";

  return (
    <div
      className={` rounded-lg bg-white ${
        isFullscreen ? "fixed inset-0 z-50 p-6" : "p-4"
      } flex flex-col gap-4 transition-all`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border border-gray-100 rounded-md p-2">
        <select
          onChange={(e) => exec("formatBlock", e.target.value)}
          className="h-9 px-3 py-1.5 text-sm rounded-md border border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
        </select>

        <button onClick={() => exec("bold")} className={toolbarBtn}>
          <strong>B</strong>
        </button>
        <button onClick={() => exec("italic")} className={toolbarBtn}>
          <em>I</em>
        </button>
        <button onClick={() => exec("underline")} className={toolbarBtn}>
          <u>U</u>
        </button>
        <button onClick={() => exec("strikeThrough")} className={toolbarBtn}>
          <s>S</s>
        </button>

        <button
          onClick={() => exec("insertUnorderedList")}
          className={toolbarBtn}
        >
          •
        </button>
        <button
          onClick={() => exec("insertOrderedList")}
          className={toolbarBtn}
        >
          1.
        </button>

        <button onClick={() => exec("justifyLeft")} className={toolbarBtn}>
          ⇤
        </button>
        <button onClick={() => exec("justifyCenter")} className={toolbarBtn}>
          ☰
        </button>
        <button onClick={() => exec("justifyRight")} className={toolbarBtn}>
          ⇥
        </button>

        <button
          onClick={() => exec("createLink", prompt("Enter URL") || "")}
          className={toolbarBtn}
        >
          🔗
        </button>
        <button onClick={() => exec("unlink")} className={toolbarBtn}>
          ❌
        </button>
        <button
          onClick={() => exec("insertImage", prompt("Image URL") || "")}
          className={toolbarBtn}
        >
          🖼️
        </button>

        <button onClick={toggleHtmlView} className={toolbarBtn}>
          {"</>"}
        </button>
        <button onClick={toggleFullscreen} className={toolbarBtn}>
          ⛶
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!isHtmlView}
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[300px] border border-gray-100 rounded-md p-4 text-sm bg-white overflow-auto focus:outline-none"
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
};

export default AdvancedEditor;
