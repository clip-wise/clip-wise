import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import React, { useEffect } from "react";

const TakeNotes = ({ url }: { url: string }) => {
  // Creates a new editor instance.
  const editor = useCreateBlockNote();

  useEffect(() => {
    const content = localStorage.getItem("takeNotes-" + url);
    if (content) {
      const parsedContent = JSON.parse(content);
      editor.replaceBlocks(editor.document, parsedContent);
    }

    editor.onChange(({ document }) => {
      localStorage.setItem("takeNotes-" + url, JSON.stringify(document));
    });
  }, []);

  return <BlockNoteView editor={editor} />;
};

export default TakeNotes;
